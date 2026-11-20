import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import { BookingProvider, useBooking } from "../lib/store";
import { color } from "../components/ui";
function Navigation() {
  const { ready } = useBooking();
  if (!ready)
    return (
      <View
        style={{ flex: 1, justifyContent: "center", backgroundColor: color.bg }}
      >
        <ActivityIndicator
          accessibilityLabel="Loading saved bookings"
          color={color.green}
        />
      </View>
    );
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: color.bg },
          headerTintColor: color.ink,
          headerShadowVisible: false,
          headerTitleStyle: { fontSize: 16 },
          animation: "default",
          contentStyle: { backgroundColor: color.bg },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: "EH / PERSONAL TRAINING" }}
        />
        <Stack.Screen name="bookings" options={{ title: "My bookings" }} />
        <Stack.Screen name="book/details" options={{ title: "Your details" }} />
        <Stack.Screen
          name="book/schedule"
          options={{ title: "Select a time" }}
        />
        <Stack.Screen name="book/review" options={{ title: "Review" }} />
        <Stack.Screen
          name="book/confirmed"
          options={{ title: "Demo booking", gestureEnabled: false }}
        />
      </Stack>
    </>
  );
}
export default function Layout() {
  return (
    <BookingProvider>
      <Navigation />
    </BookingProvider>
  );
}
