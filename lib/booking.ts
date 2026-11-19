export const STORAGE_KEY = "eh-pt-booking-v1";
export const CONTACT = "601116631413";
export const ZONE = "Asia/Kuala_Lumpur";
export const BASE_PRICE = 35;
export const EXPERIENCE = ["New to training", "Some experience", "Regular training"] as const;
export type Draft = {
  name: string; nickname: string; phone: string; email: string; location: string;
  travel: string; age: string; height: string; weight: string; experience: string;
  date: string; time: string;
};
export type Booking = { reference: string; createdAt: string; details: Draft };
export type Errors = Partial<Record<keyof Draft, string>>;
export const EMPTY: Draft = {name:"",nickname:"",phone:"",email:"",location:"",travel:"",age:"",height:"",weight:"",experience:"",date:"",time:""};
export const SLOTS = [
  {id:"09:00",end:"10:30",label:"9:00 AM – 10:30 AM"},
  {id:"10:30",end:"12:00",label:"10:30 AM – 12:00 PM"},
  {id:"12:00",end:"13:30",label:"12:00 PM – 1:30 PM"},
  {id:"13:30",end:"15:00",label:"1:30 PM – 3:00 PM"},
  {id:"15:00",end:"16:30",label:"3:00 PM – 4:30 PM"},
  {id:"16:30",end:"18:00",label:"4:30 PM – 6:00 PM"},
  {id:"18:30",end:"20:00",label:"6:30 PM – 8:00 PM"},
];
export function normalizePhone(input: string) {
  const value = input.replace(/[\s()-]/g, "");
  return value.startsWith("0") ? "+60" + value.slice(1) : value.startsWith("60") ? "+" + value : value;
}
export function validateDetails(d: Draft): Errors {
  const e: Errors = {};
  if (d.name.trim().length < 2 || d.name.length > 100) e.name = "Enter your full name (2–100 characters).";
  if (!/^\+601(?:1\d{8}|[02-9]\d{7,8})$/.test(normalizePhone(d.phone))) e.phone = "Enter a Malaysian mobile number, for example +60 12-345 6789.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email) || d.email.length > 254) e.email = "Enter a valid email address.";
  if (d.location.trim().length < 3 || d.location.length > 200) e.location = "Enter your preferred gym or training location in Penang.";
  if (!["within","beyond","unsure"].includes(d.travel)) e.travel = "Select a travel distance, or choose Not sure.";
  for (const [key,min,max] of [["age",16,80],["height",100,240],["weight",30,250]] as const) {
    const n = Number(d[key]);
    if (!d[key].trim() || !Number.isFinite(n) || n < min || n > max || (key === "age" && !Number.isInteger(n)))
      e[key] = key === "age" ? "Enter a whole-number age from 16 to 80." : `Enter ${key} between ${min} and ${max} ${key === "height" ? "cm" : "kg"}.`;
  }
  if (!EXPERIENCE.includes(d.experience as typeof EXPERIENCE[number])) e.experience = "Select your training experience.";
  return e;
}
export function mytDate(now = new Date()): string {
  return new Date(now.getTime() + 8 * 3600000).toISOString().slice(0,10);
}
export function availableDates(now = new Date()): string[] {
  const start = new Date(mytDate(now) + "T00:00:00Z");
  return Array.from({length:30},(_,i) => new Date(start.getTime()+i*86400000))
    .filter(d => d.getUTCDay() !== 0 && d.getUTCDay() !== 6).map(d => d.toISOString().slice(0,10));
}
export function slotStart(date: string,time: string) { return new Date(`${date}T${time}:00+08:00`); }
export function isAvailable(date: string,time: string,now = new Date()) {
  return availableDates(now).includes(date) && SLOTS.some(s=>s.id===time) && slotStart(date,time).getTime() >= now.getTime()+3600000;
}
export function formatDate(date: string, options: Intl.DateTimeFormatOptions = {weekday:"long",day:"numeric",month:"long",year:"numeric"}) {
  return new Intl.DateTimeFormat("en-MY",{...options,timeZone:ZONE}).format(new Date(date+"T12:00:00+08:00"));
}
export function priceLabel(d: Draft) { return d.travel === "within" ? "RM35" : "RM35 + travel quote"; }
export function readDraft(value: unknown): Draft {
  const d = {...EMPTY};
  if (!value || typeof value !== "object") return d;
  for (const key of Object.keys(EMPTY) as (keyof Draft)[]) {
    const v = (value as Record<string,unknown>)[key];
    if (typeof v === "string") d[key] = v.slice(0,500);
  }
  return d;
}
export function readBooking(value: unknown): Booking | null {
  if (!value || typeof value !== "object") return null;
  const b = value as Booking;
  const details = readDraft(b.details);
  if (typeof b.reference !== "string" || !/^EH-[A-F0-9]{12}$/.test(b.reference) ||
      typeof b.createdAt !== "string" || !Number.isFinite(Date.parse(b.createdAt)) ||
      Object.keys(validateDetails(details)).length || !/^\d{4}-\d{2}-\d{2}$/.test(details.date) ||
      !Number.isFinite(slotStart(details.date,details.time).getTime()) || !SLOTS.some(s=>s.id===details.time)) return null;
  return {reference:b.reference,createdAt:b.createdAt,details};
}
export function bookingMessage(b: Booking) {
  const d = b.details;
  return `Hi Emirul, I tried your portfolio booking demo. Reference: ${b.reference}.\nName: ${d.name}\nSession: ${formatDate(d.date)}, ${SLOTS.find(s=>s.id===d.time)?.label} MYT (90 minutes).\nVenue: ${d.location}, Penang.\nPrice: ${priceLabel(d)}.\nThis is a demo, not a real reservation. Can we discuss availability?`;
}
export function whatsappUrl(message = "Hi Emirul, I'd like to ask about personal training in Penang.") {
  return `https://wa.me/${CONTACT}?text=${encodeURIComponent(message)}`;
}
function escapeICS(value: string) { return value.replace(/\\/g,"\\\\").replace(/\r?\n/g,"\\n").replace(/;/g,"\\;").replace(/,/g,"\\,"); }
function stamp(d: Date) { return d.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,""); }
function foldICS(line: string) {
  const parts: string[] = []; let part = ""; let length = 0;
  for (const char of line) { const bytes = new TextEncoder().encode(char).length; if (length + bytes > 75) {parts.push(part);part = " ";length = 1;} part += char;length += bytes; }
  parts.push(part);return parts.join("\r\n");
}
export function calendarICS(b: Booking) {
  const start = slotStart(b.details.date,b.details.time);
  return ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//EH PT//Portfolio Demo//EN","CALSCALE:GREGORIAN","METHOD:PUBLISH","BEGIN:VEVENT",
    `UID:${b.reference}@eh-pt.demo`,`DTSTAMP:${stamp(new Date(b.createdAt))}`,`DTSTART:${stamp(start)}`,
    `DTEND:${stamp(new Date(start.getTime()+90*60000))}`,"SUMMARY:Demo PT session with Emirul",
    `LOCATION:${escapeICS(b.details.location + ", Penang")}`,`DESCRIPTION:${escapeICS("Portfolio demo only. No real reservation. Reference: "+b.reference+". "+priceLabel(b.details))}`,
    "STATUS:TENTATIVE","TRANSP:TRANSPARENT","END:VEVENT","END:VCALENDAR"].map(foldICS).join("\r\n")+"\r\n";
}
