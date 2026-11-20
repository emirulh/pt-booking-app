import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBooking } from "../lib/store";
export const color = {
  bg: "#F4F3EC",
  ink: "#182820",
  muted: "#536159",
  green: "#24563D",
  lime: "#D3EF89",
  line: "#D5DBD1",
  white: "#FFFFFF",
  error: "#A62424",
};
export const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: color.bg },
  content: {
    padding: 24,
    gap: 24,
    width: "100%",
    maxWidth: 620,
    alignSelf: "center",
    paddingBottom: 40,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    color: color.green,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: "800",
    letterSpacing: -1.2,
    color: color.ink,
  },
  heading: { fontSize: 22, fontWeight: "700", color: color.ink },
  body: { fontSize: 16, lineHeight: 24, color: color.muted },
  card: {
    backgroundColor: color.white,
    padding: 22,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: color.line,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  label: { fontSize: 15, fontWeight: "600", color: color.ink },
  error: { color: color.error, fontSize: 14, lineHeight: 20 },
  input: {
    borderWidth: 1,
    borderColor: color.line,
    borderRadius: 12,
    padding: 15,
    fontSize: 17,
    color: color.ink,
    backgroundColor: color.white,
    minHeight: 52,
  },
  rule: { height: 1, backgroundColor: color.line },
  badge: { fontSize: 12, color: color.green, fontWeight: "700" },
  choice: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: color.line,
    backgroundColor: color.white,
    minHeight: 52,
  },
  selected: {
    borderColor: color.green,
    backgroundColor: "#E6EFDD",
    borderWidth: 2,
  },
  focus: { borderColor: color.green, borderWidth: 2 },
});
export function Page({ children }: { children: React.ReactNode }) {
  const { error } = useBooking();
  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={s.page}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={s.content}
        >
          {error ? (
            <Text accessibilityRole="alert" style={s.error}>
              {error}
            </Text>
          ) : null}
          {children}
          <Text style={s.badge}>PORTFOLIO DEMO · NO REAL RESERVATION</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
export function Button({
  title,
  onPress,
  secondary = false,
  disabled = false,
  loading = false,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  loading?: boolean;
}) {
  const [focus, setFocus] = React.useState(false);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 54,
        padding: 16,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: secondary ? "transparent" : color.green,
        borderWidth: focus ? 3 : 1,
        borderColor: focus ? color.ink : color.green,
        opacity: disabled ? 0.45 : pressed ? 0.75 : 1,
      })}
    >
      {loading ? (
        <ActivityIndicator color={color.white} />
      ) : (
        <Text
          style={{
            color: secondary ? color.green : color.white,
            fontSize: 16,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}
export function Choice({
  title,
  selected,
  onPress,
  disabled = false,
}: {
  title: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
}) {
  const [focused, setFocused] = React.useState(false);
  return (
    <Pressable
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.choice,
        selected && s.selected,
        focused && s.focus,
        { opacity: disabled ? 0.4 : pressed ? 0.7 : 1 },
      ]}
    >
      <Text style={s.label}>
        {selected ? "●  " : "○  "}
        {title}
      </Text>
    </Pressable>
  );
}
export function Step({ n, title }: { n: number; title: string }) {
  return (
    <View style={{ gap: 12 }}>
      <Text style={s.eyebrow}>Step {n} of 3</Text>
      <View style={{ flexDirection: "row", gap: 6 }}>
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={{
              height: 4,
              flex: 1,
              borderRadius: 2,
              backgroundColor: i <= n ? color.green : color.line,
            }}
          />
        ))}
      </View>
      <Text accessibilityRole="header" style={s.title}>
        {title}
      </Text>
    </View>
  );
}
