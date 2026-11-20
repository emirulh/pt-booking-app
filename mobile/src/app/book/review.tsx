import { useRef, useState } from "react";
import { Text } from "react-native";
import { Redirect, router } from "expo-router";
import { randomUUID } from "expo-crypto";
import { isAvailable, validateDetails } from "../../../../lib/booking";
import { useBooking } from "../../lib/store";
import { Button, Page, Step, s } from "../../components/ui";
import { Summary } from "../../components/summary";
export default function Review() {
  const { state, save } = useBooking();
  const d = state.draft;
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  if (!done && Object.keys(validateDetails(d)).length)
    return <Redirect href="/book/details" />;
  if (!done && !isAvailable(d.date, d.time))
    return <Redirect href="/book/schedule" />;
  async function confirm() {
    if (lock.current) return;
    if (!isAvailable(d.date, d.time)) {
      router.replace("/book/schedule");
      return;
    }
    lock.current = true;
    setBusy(true);
    setDone(true);
    try {
      const booking = {
        reference:
          "EH-" + randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase(),
        createdAt: new Date().toISOString(),
        details: { ...d },
      };
      await save(booking);
      router.replace({
        pathname: "/book/confirmed",
        params: { reference: booking.reference },
      });
    } catch {
      setError("Could not save this demo booking. Please try again.");
      setDone(false);
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <Page>
      <Step n={3} title="Ready for your next rep?" />
      {!done ? <Summary d={d} /> : null}
      <Button
        title="Edit details"
        secondary
        disabled={busy}
        onPress={() => router.push("/book/details")}
      />
      <Button
        title="Edit schedule"
        secondary
        disabled={busy}
        onPress={() => router.push("/book/schedule")}
      />
      <Text style={s.body}>
        This saves a demo booking on your device. No real session is reserved
        and no payment is taken. Demo policy: free cancellation or rescheduling
        with 12 hours’ notice.
      </Text>
      {error ? (
        <Text accessibilityRole="alert" style={s.error}>
          {error}
        </Text>
      ) : null}
      <Button title="Confirm demo booking" loading={busy} onPress={confirm} />
    </Page>
  );
}
