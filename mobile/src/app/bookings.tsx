import { useState } from "react";
import { Text, View } from "react-native";
import { router } from "expo-router";
import { formatDate, SLOTS } from "../../../lib/booking";
import { useBooking } from "../lib/store";
import { Button, Page, s } from "../components/ui";
export default function Bookings() {
  const { state, clear } = useBooking();
  const [confirm, setConfirm] = useState(false);
  return (
    <Page>
      <Text style={s.title}>Your training,{"\n"}in one place.</Text>
      <Text style={s.body}>
        Demo bookings saved on this device only. They are not sent to Emirul.
      </Text>
      {state.bookings.length ? (
        state.bookings.map((b) => (
          <View key={b.reference} style={s.card}>
            <Text style={s.eyebrow}>{b.reference}</Text>
            <Text style={s.heading}>
              {formatDate(b.details.date, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>
            <Text style={s.body}>
              {SLOTS.find((x) => x.id === b.details.time)?.label} MYT{"\n"}
              {b.details.location}
            </Text>
            <Button
              title="View session"
              secondary
              onPress={() =>
                router.push({
                  pathname: "/book/confirmed",
                  params: { reference: b.reference },
                })
              }
            />
          </View>
        ))
      ) : (
        <View style={s.card}>
          <Text style={s.heading}>A fresh start.</Text>
          <Text style={s.body}>Your first demo session will appear here.</Text>
        </View>
      )}
      <Button
        title="Plan a session"
        onPress={() => router.push("/book/details")}
      />
      {confirm ? (
        <View style={s.card}>
          <Text style={s.label}>
            Clear all bookings and draft details from this device?
          </Text>
          <Button
            title="Clear saved data"
            onPress={() =>
              clear()
                .then(() => setConfirm(false))
                .catch(() => {})
            }
          />
          <Button
            title="Keep my data"
            secondary
            onPress={() => setConfirm(false)}
          />
        </View>
      ) : (
        <Button
          title="Clear saved data"
          secondary
          onPress={() => setConfirm(true)}
        />
      )}
    </Page>
  );
}
