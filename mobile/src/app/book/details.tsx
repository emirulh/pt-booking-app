import { useRef, useState } from "react";
import { Text, TextInput, View, AccessibilityInfo } from "react-native";
import { router } from "expo-router";
import {
  Draft,
  Errors,
  EXPERIENCE,
  validateDetails,
} from "../../../../lib/booking";
import { useBooking } from "../../lib/store";
import { Button, Choice, Page, Step, s, color } from "../../components/ui";
const fields: [keyof Draft, string, string][] = [
  ["name", "Full name *", "default"],
  ["nickname", "Nickname · optional", "default"],
  ["phone", "WhatsApp / phone *", "phone-pad"],
  ["email", "Email address *", "email-address"],
  ["location", "Preferred gym / location in Penang *", "default"],
  ["age", "Age * · 16–80", "number-pad"],
  ["height", "Height * · 100–240 cm", "decimal-pad"],
  ["weight", "Weight * · 30–250 kg", "decimal-pad"],
];
export default function Details() {
  const { state, update } = useBooking();
  const [errors, setErrors] = useState<Errors>({});
  const [focus, setFocus] = useState("");
  const refs = useRef<
    Partial<Record<keyof Draft, React.ComponentRef<typeof TextInput> | null>>
  >({});
  function next() {
    const e = validateDetails(state.draft);
    setErrors(e);
    const first = Object.keys(e)[0] as keyof Draft | undefined;
    if (first) {
      refs.current[first]?.focus();
      AccessibilityInfo.announceForAccessibility(e[first]!);
      return;
    }
    router.push("/book/schedule");
  }
  return (
    <Page>
      <Step n={1} title="Let’s start with you." />
      <Text style={s.body}>
        Use sample details to explore. This demo stores your entries on this
        device until you clear them.
      </Text>
      {fields.map(([key, label, keyboard]) => (
        <View key={key} style={{ gap: 8 }}>
          <Text nativeID={`${key}-label`} style={s.label}>
            {label}
          </Text>
          <TextInput
            ref={(r) => {
              refs.current[key] = r;
            }}
            accessibilityLabel={label}
            accessibilityLabelledBy={`${key}-label`}
            accessibilityHint={errors[key] || undefined}
            value={state.draft[key]}
            onChangeText={(v) => update({ [key]: v })}
            onFocus={() => setFocus(key)}
            onBlur={() => setFocus("")}
            keyboardType={keyboard as "default"}
            autoCapitalize={key === "email" ? "none" : "words"}
            autoCorrect={key !== "email" && key !== "phone"}
            maxLength={key === "email" ? 254 : key === "location" ? 200 : 100}
            style={[
              s.input,
              focus === key && s.focus,
              errors[key] && { borderColor: color.error },
            ]}
          />
          {key === "phone" ? (
            <Text style={s.body}>Malaysian mobile, e.g. +60 12-345 6789</Text>
          ) : null}
          {errors[key] ? (
            <Text accessibilityRole="alert" style={s.error}>
              {errors[key]}
            </Text>
          ) : null}
        </View>
      ))}
      <View style={{ gap: 10 }}>
        <Text style={s.label}>Distance from George Town city center *</Text>
        {[
          ["within", "Within 10km · included"],
          ["beyond", "Beyond 10km · travel quote required"],
          ["unsure", "Not sure · please confirm"],
        ].map(([value, label]) => (
          <Choice
            key={value}
            title={label}
            selected={state.draft.travel === value}
            onPress={() => update({ travel: value })}
          />
        ))}
        {errors.travel ? (
          <Text accessibilityRole="alert" style={s.error}>
            {errors.travel}
          </Text>
        ) : null}
      </View>
      <View style={{ gap: 10 }}>
        <Text style={s.label}>Gym experience *</Text>
        {EXPERIENCE.map((value) => (
          <Choice
            key={value}
            title={value}
            selected={state.draft.experience === value}
            onPress={() => update({ experience: value })}
          />
        ))}
        {errors.experience ? (
          <Text accessibilityRole="alert" style={s.error}>
            {errors.experience}
          </Text>
        ) : null}
      </View>
      <Button title="Continue to schedule →" onPress={next} />
    </Page>
  );
}
