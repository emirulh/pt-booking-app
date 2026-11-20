import { Text, View } from "react-native";
import { Draft, formatDate, SLOTS, priceLabel } from "../../../lib/booking";
import { s } from "./ui";
export function Summary({ d }: { d: Draft }) {
  return (
    <>
      <View style={s.card}>
        <Text style={s.heading}>{formatDate(d.date)}</Text>
        <Text style={s.label}>
          {SLOTS.find((x) => x.id === d.time)?.label} MYT
        </Text>
        <Text style={s.body}>90-minute 1-on-1 session</Text>
        <View style={s.rule} />
        <Text style={s.label}>
          {d.name}
          {d.nickname ? ` (${d.nickname})` : ""}
        </Text>
        <Text style={s.body}>
          {d.phone}
          {"\n"}
          {d.email}
        </Text>
        <Text style={s.label}>{d.location}, Penang</Text>
        <Text style={s.body}>
          {d.experience}
          {"\n"}Age {d.age} · {d.height} cm · {d.weight} kg
        </Text>
      </View>
      <View style={s.card}>
        <View style={s.row}>
          <Text style={s.body}>Base session</Text>
          <Text style={s.label}>RM35</Text>
        </View>
        <View style={s.row}>
          <Text style={s.body}>Travel fee</Text>
          <Text style={s.label}>
            {d.travel === "within" ? "RM0" : "Quote required"}
          </Text>
        </View>
        <View style={s.rule} />
        <Text style={s.heading}>Total · {priceLabel(d)}</Text>
        {d.travel !== "within" ? (
          <Text style={s.body}>
            Final total depends on the travel quote. No charge is made in this
            demo.
          </Text>
        ) : null}
      </View>
    </>
  );
}
