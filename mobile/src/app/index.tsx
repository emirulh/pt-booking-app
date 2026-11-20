import { useState } from "react";
import { Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { Button, Page, s, color } from "../components/ui";
import { message } from "../lib/actions";
export default function Home() {
  const [open, setOpen] = useState(-1);
  const [error, setError] = useState("");
  return (
    <Page>
      <View style={s.row}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: color.green,
            alignItems: "center",
            justifyContent: "center",
          }}
          accessibilityLabel="Emirul Hakimi initials"
        >
          <Text style={{ fontSize: 24, color: color.lime, fontWeight: "800" }}>
            EH
          </Text>
        </View>
        <Text style={s.eyebrow}>Penang, Malaysia</Text>
      </View>
      <View style={{ gap: 16 }}>
        <Text style={s.eyebrow}>Train with Emirul Hakimi</Text>
        <Text style={[s.title, { fontSize: 46, lineHeight: 49 }]}>
          Your next rep.{"\n"}A stronger you.
        </Text>
        <Text style={s.body}>
          One coach. Your pace. Personal training built around where you are and
          where you want to go.
        </Text>
      </View>
      <View
        style={[
          s.card,
          { backgroundColor: color.green, borderColor: color.green },
        ]}
      >
        <Text style={{ color: color.lime, fontSize: 40, fontWeight: "800" }}>
          RM35{" "}
          <Text style={{ fontSize: 17, color: color.white, fontWeight: "400" }}>
            / session
          </Text>
        </Text>
        <Text style={{ color: color.white, fontSize: 17 }}>
          90 minutes · 1-on-1 · Monday–Friday
        </Text>
        <View style={{ height: 1, backgroundColor: "#60836A" }} />
        <Text style={{ color: color.white, lineHeight: 22 }}>
          Your preferred gym in Penang. Gym access fees are separate and should
          be checked with your venue.
        </Text>
      </View>
      <Button
        title="Plan my session  →"
        onPress={() => router.push("/book/details")}
      />
      <Button
        title="My demo bookings"
        secondary
        onPress={() => router.push("/bookings")}
      />
      <View style={{ gap: 20 }}>
        <Text style={s.heading}>Know before you book</Text>
        <Text style={s.body}>
          Travel is included within 10km of George Town city center. Beyond
          10km, or if you are unsure, request a travel quote before arranging a
          real session.
        </Text>
        <Text style={s.body}>
          Demo policy: cancel or reschedule free with at least 12 hours’ notice.
          Confirm the actual policy with Emirul before booking.
        </Text>
      </View>
      <View style={{ gap: 0 }}>
        {[
          [
            "Is this suitable for beginners?",
            "Yes. Choose your experience level so the session can start at your pace.",
          ],
          [
            "What should I bring?",
            "Comfortable training clothes, trainers, water and a towel. Arrange gym access before your session.",
          ],
          [
            "Does this reserve a real session?",
            "No. This portfolio demo saves locally on your device. Message Emirul to discuss real availability.",
          ],
        ].map(([q, a], i) => (
          <View
            key={q}
            style={{ borderBottomWidth: 1, borderColor: color.line }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: open === i }}
              onPress={() => setOpen(open === i ? -1 : i)}
              style={{ paddingVertical: 20 }}
            >
              <Text style={s.label}>
                {q} {open === i ? "−" : "+"}
              </Text>
            </Pressable>
            {open === i ? (
              <Text style={[s.body, { paddingBottom: 20 }]}>{a}</Text>
            ) : null}
          </View>
        ))}
      </View>
      <Button
        title="Ask Emirul on WhatsApp"
        secondary
        onPress={() =>
          message().catch(() =>
            setError("Could not open WhatsApp. Please try again."),
          )
        }
      />
      {error ? <Text style={s.error}>{error}</Text> : null}
    </Page>
  );
}
