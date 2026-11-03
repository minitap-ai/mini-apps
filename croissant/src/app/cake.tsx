import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { api, storage, type Cake, type CakeSize, type PickedPhoto } from "@/lib/backend";
import { useSession } from "@/state/session";
import { asApiError } from "@/state/use-load";
import { Body, Button, Card, Chip, ErrorState, Field, Heading, Loading, Notice, Row, Screen, Title } from "@/ui/kit";
import { SignInGate } from "@/ui/sign-in-gate";
import { radius } from "@/ui/theme";

const SIZES: { id: CakeSize; label: string }[] = [
  { id: "small", label: "Small (6 people)" },
  { id: "medium", label: "Medium (10 people)" },
  { id: "large", label: "Large (16 people)" },
];

const POLL_MS = 1000;

function toPhoto(asset: ImagePicker.ImagePickerAsset): PickedPhoto {
  const type = asset.mimeType ?? "image/jpeg";
  return {
    uri: asset.uri,
    name: asset.fileName ?? `cake-photo.${type.includes("png") ? "png" : "jpg"}`,
    type,
    size: asset.fileSize ?? asset.file?.size ?? 0,
    file: asset.file,
  };
}

export default function CakeScreen() {
  const { user, ready } = useSession();
  const [size, setSize] = useState<CakeSize>("medium");
  const [message, setMessage] = useState("Happy birthday!");
  const [cake, setCake] = useState<Cake | null>(null);
  const [uploading, setUploading] = useState(false);
  const [requested, setRequested] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cake || cake.status === "ready") return;
    const timer = setTimeout(() => {
      api
        .cake(cake.id)
        .then((r) => setCake(r.cake))
        .catch(() => setCake({ ...cake }));
    }, POLL_MS);
    return () => clearTimeout(timer);
  }, [cake]);

  const addPhoto = async () => {
    setError(null);
    const picked = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.8 });
    const asset = picked.canceled ? undefined : picked.assets[0];
    if (!asset) return;
    setUploading(true);
    setRequested(false);
    try {
      const fileId = await storage.uploadCakePhoto(toPhoto(asset));
      setCake((await api.requestCake(size, message.trim(), fileId)).cake);
    } catch (err) {
      setError(asApiError(err).message);
    } finally {
      setUploading(false);
    }
  };

  if (!ready) return <Loading testID="cake-loading" />;

  return (
    <Screen testID="cake-screen">
      <Title>Custom cake</Title>
      {!user ? <SignInGate reason="Sign in to send us a photo for your cake." /> : null}
      <Heading>Size</Heading>
      <Row style={{ flexWrap: "wrap" }}>
        {SIZES.map((s) => (
          <Chip key={s.id} label={s.label} selected={size === s.id} onPress={() => setSize(s.id)} testID={`cake-size-${s.id}`} />
        ))}
      </Row>
      <Field label="Message on the cake" testID="cake-message" value={message} onChangeText={setMessage} maxLength={40} />
      <Button
        label={cake ? "Choose another photo" : "Add a photo"}
        kind={cake ? "secondary" : "primary"}
        testID="cake-add-photo"
        busy={uploading}
        disabled={!user}
        onPress={() => void addPhoto()}
      />
      {uploading ? <Loading label="Uploading your photo…" testID="cake-uploading" /> : null}
      {error ? <ErrorState message={error} testID="cake-error" /> : null}
      {cake && cake.status === "processing" ? <Loading label="Processing your photo…" testID="cake-processing" /> : null}
      {cake && cake.status === "ready" && cake.thumbnailUrl ? (
        <Card testID="cake-preview">
          <Body strong>Your photo</Body>
          <Image
            source={{ uri: cake.thumbnailUrl }}
            style={{ width: 200, height: 200, borderRadius: radius.md }}
            contentFit="cover"
            accessibilityLabel="Cake photo thumbnail"
            testID="cake-thumbnail"
          />
          {requested ? (
            <Notice message="Cake requested! We'll call you to confirm." testID="cake-requested" />
          ) : (
            <Button label="Request this cake" testID="cake-request" onPress={() => setRequested(true)} />
          )}
        </Card>
      ) : null}
    </Screen>
  );
}
