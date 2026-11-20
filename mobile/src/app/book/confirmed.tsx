import { useState } from "react";
import { Text, View } from "react-native";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useBooking } from "../../lib/store";
import { Button, Page, s, color } from "../../components/ui";
import { Summary } from "../../components/summary";
import { calendar, message } from "../../lib/actions";
export default function Confirmed() {
  const { reference } = useLocalSearchParams<{ reference: string }>();
  const { state } = useBooking();
  const b = state.bookings.find((x) => x.reference === reference);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (!b) return <Redirect href="/bookings" />;
  async function exportCalendar() {
    setBusy(true);
    setError("");
    try {
      await calendar(b!);
    } catch {
      setError(
        "Could not export the calendar file. Please try again on your device.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Page>
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: color.lime,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 32, color: color.green }}>✓</Text>
      </View>
      <Text accessibilityRole="header" style={s.title}>
        Your demo session{"\n"}is saved.
      </Text>
      <Text style={s.body}>
        No real reservation has been made. Message Emirul when you’re ready to
        discuss a session.
      </Text>
      <Text selectable style={s.eyebrow}>
        {b.reference}
      </Text>
      <Summary d={b.details} />
      <Button
        title="Add to calendar (.ics)"
        loading={busy}
        onPress={exportCalendar}
      />
      <Button
        title="Message Emirul on WhatsApp"
        secondary
        onPress={() =>
          message(b).catch(() =>
            setError("Could not open WhatsApp. Please try again."),
          )
        }
      />
      {error ? (
        <Text accessibilityRole="alert" style={s.error}>
          {error}
        </Text>
      ) : null}
      <Button
        title="View my bookings"
        secondary
        onPress={() => router.replace("/bookings")}
      />
      <Button
        title="Back to home"
        secondary
        onPress={() => router.replace("/")}
      />
    </Page>
  );
}
