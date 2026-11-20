import { Linking, Platform } from "react-native";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import {
  Booking,
  bookingMessage,
  calendarICS,
  whatsappUrl,
} from "../../../lib/booking";
export async function message(b?: Booking) {
  await Linking.openURL(whatsappUrl(b ? bookingMessage(b) : undefined));
}
export async function calendar(b: Booking) {
  const content = calendarICS(b);
  if (Platform.OS === "web") {
    const url = URL.createObjectURL(
      new Blob([content], { type: "text/calendar" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `${b.reference}.ics`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return;
  }
  if (!(await Sharing.isAvailableAsync()))
    throw Error("Sharing is unavailable on this device.");
  const file = new File(Paths.cache, `${b.reference}.ics`);
  file.create({ overwrite: true });
  await file.write(content);
  await Sharing.shareAsync(file.uri, {
    mimeType: "text/calendar",
    UTI: "public.calendar-event",
    dialogTitle: "Save demo session to calendar",
  });
}
