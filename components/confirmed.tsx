"use client";
import Link from "next/link";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {BookingShell,PageHeading,Summary} from "./ui";
import {useBooking} from "./booking-provider";
import {calendarICS,bookingMessage,whatsappUrl} from "@/lib/booking";
export default function Confirmed() {
  const {booking,reset}=useBooking();const router=useRouter();const [status,setStatus]=useState("");
  function download() {
    if(!booking)return;
    try {const url=URL.createObjectURL(new Blob([calendarICS(booking)],{type:"text/calendar;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download=booking.reference+".ics";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setStatus("Calendar file downloaded. The event is marked as a demo.");}
    catch {setStatus("The calendar download failed. Please try again.");}
  }
  return <BookingShell step={4}>{booking&&<><div className="success-icon" aria-hidden="true">✓</div><PageHeading eyebrow="Demo booking saved" title="Your next step is set.">Your session details are ready. This is a simulation, not a real reservation.</PageHeading><div className="reference"><span>Booking reference</span><strong>{booking.reference}</strong></div><Summary draft={booking.details}/><div className="confirmation-actions"><button className="button primary" onClick={download}>Add to calendar (.ics)</button><a className="button secondary" href={whatsappUrl(bookingMessage(booking))} target="_blank" rel="noopener noreferrer">Message Emirul on WhatsApp<span className="sr-only"> (opens a new tab)</span></a></div><p className="hint">WhatsApp opens a draft with your name, session, venue and price. Review it before sending. Nothing is sent automatically.</p><p role="status" className="hint">{status}</p><div className="form-actions"><Link href="/" className="text-link">Back to home</Link><button className="text-button" onClick={()=>{reset();router.push("/book/details");}}>Start a new demo</button></div></>}</BookingShell>;
}
