import { useEffect, useState } from "react";
import { AppState, ScrollView, Text, View } from "react-native";
import { Redirect, router } from "expo-router";
import {
  availableDates,
  formatDate,
  isAvailable,
  SLOTS,
  validateDetails,
} from "../../../../lib/booking";
import { useBooking } from "../../lib/store";
import { Button, Choice, Page, Step, s } from "../../components/ui";
export default function Schedule() {
  const { state, update } = useBooking();
  const d = state.draft;
  const [now, setNow] = useState(new Date());
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 15000);
    const sub = AppState.addEventListener("change", () => setNow(new Date()));
    return () => {
      clearInterval(timer);
      sub.remove();
    };
  }, []);
  if (Object.keys(validateDetails(d)).length)
    return <Redirect href="/book/details" />;
  const valid = isAvailable(d.date, d.time, now);
  return (
    <Page>
      <Step n={2} title="Make time for you." />
      <Text style={s.body}>
        Sessions available Monday–Friday; weekends unavailable. All times are
        MYT / UTC+8. Book at least 1 hour ahead.
      </Text>
      <Text style={s.heading}>Choose a date</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        contentContainerStyle={{
          gap: 10,
          paddingVertical: 6,
          paddingRight: 24,
        }}
      >
        {availableDates(now).map((date) => (
          <View key={date} style={{ width: 120 }}>
            <Choice
              title={formatDate(date, {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
              selected={d.date === date}
              onPress={() => {
                if (date !== d.date) {
                  update({ date, time: "" });
                  setNotice("Date updated. Choose a time below.");
                }
              }}
            />
          </View>
        ))}
      </ScrollView>
      <Text accessibilityLiveRegion="polite" style={s.body}>
        {notice || "Swipe the dates to explore the next 30 days."}
      </Text>
      <View style={{ gap: 10 }}>
        <Text style={s.heading}>
          {d.date
            ? formatDate(d.date, {
                weekday: "long",
                day: "numeric",
                month: "long",
              })
            : "Choose a date first"}
        </Text>
        {d.date
          ? SLOTS.map((slot) => {
              const available = isAvailable(d.date, slot.id, now);
              return (
                <Choice
                  key={slot.id}
                  title={`${slot.label}\n${available ? (d.time === slot.id ? "Selected" : "Available") : "Unavailable · past or too soon"}`}
                  selected={d.time === slot.id && available}
                  disabled={!available}
                  onPress={() => update({ time: slot.id })}
                />
              );
            })
          : null}
      </View>
      {d.time && !valid ? (
        <Text accessibilityRole="alert" style={s.error}>
          This time is no longer available. Please choose another slot.
        </Text>
      ) : null}
      <Button
        title="Review my session →"
        disabled={!valid}
        onPress={() => {
          if (isAvailable(d.date, d.time)) router.push("/book/review");
          else setNow(new Date());
        }}
      />
    </Page>
  );
}
