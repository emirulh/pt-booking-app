"use client";
import Link from "next/link";
import {useState,useRef,type FormEvent} from "react";
import {useRouter} from "next/navigation";
import {useBooking} from "./booking-provider";
import {BookingShell,PageHeading,Summary} from "./ui";
import {isAvailable,validateDetails,type Booking} from "@/lib/booking";
export default function Review() {
  const {draft,booking,confirm}=useBooking();const router=useRouter();
  const [busy,setBusy]=useState(false);const lock=useRef(false);const [error,setError]=useState("");
  async function submit(e:FormEvent) {
    e.preventDefault();if(lock.current)return;lock.current=true;setBusy(true);setError("");
    try {
      await new Promise(resolve=>setTimeout(resolve,350));
      if(Object.keys(validateDetails(draft)).length){router.replace("/book/details");return;}
      if(!isAvailable(draft.date,draft.time)){setError("This time is now too close to start. Please edit your schedule and choose another slot.");return;}
      const next:Booking=booking&&JSON.stringify(booking.details)===JSON.stringify(draft)?booking:{
        reference:"EH-"+crypto.randomUUID().replace(/-/g,"").slice(0,12).toUpperCase(),createdAt:new Date().toISOString(),details:{...draft}};
      confirm(next);router.push("/book/confirmed");
    } catch {setError("Your demo booking could not be saved. Please try again.");}
    finally {lock.current=false;setBusy(false);}
  }
  return <BookingShell step={3}><PageHeading title="One last look.">Check the details, then confirm your demo booking.</PageHeading><Summary draft={draft} editable/><div className="demo-note"><strong>Portfolio demo mode</strong><p>Confirmation saves a demo record in this browser session. It does not reserve a real slot, send a notification, or take payment.</p></div><p className="hint"><strong>Demo policy:</strong> free cancellation or rescheduling with 12 hours’ notice. Shorter notice: contact Emirul.</p><form onSubmit={submit} aria-busy={busy}>{error&&<p className="field-error" role="alert">{error}</p>}<div className="form-actions"><Link href="/book/schedule" className="text-link">Back to schedule</Link><button disabled={busy} className="button primary">{busy?"Saving your booking…":"Confirm booking"}</button></div></form></BookingShell>;
}
