"use client";
import Link from "next/link";
import {useEffect,useRef,useState,type FormEvent} from "react";
import {useRouter} from "next/navigation";
import {BookingShell,PageHeading} from "./ui";
import {useBooking} from "./booking-provider";
import {availableDates,isAvailable,formatDate,SLOTS} from "@/lib/booking";
export default function Schedule() {
  const {draft,update}=useBooking();const router=useRouter();const [now,setNow]=useState(()=>new Date());
  const [message,setMessage]=useState("");const [error,setError]=useState("");
  const strip=useRef<HTMLDivElement>(null);const [pageSize,setPageSize]=useState(4);const [page,setPage]=useState(0);
  const dates=availableDates(now);const date=dates.includes(draft.date)?draft.date:dates[0];
  const valid=isAvailable(date,draft.time,now);
  useEffect(()=>{const timer=setInterval(()=>setNow(new Date()),15000);const refresh=()=>setNow(new Date());window.addEventListener("focus",refresh);return()=>{clearInterval(timer);window.removeEventListener("focus",refresh);};},[]);
  useEffect(()=>{if(!strip.current)return;const observer=new ResizeObserver(entries=>setPageSize(entries[0].contentRect.width<360?3:entries[0].contentRect.width<500?4:5));observer.observe(strip.current);return()=>observer.disconnect();},[]);
  const pages=Math.ceil(dates.length/pageSize);const currentPage=Math.min(page,pages-1);
  const visibleDates=dates.slice(currentPage*pageSize,(currentPage+1)*pageSize);
  function choose(next:string) {update({date:next,time:""});setError("");setMessage("Date changed. Choose a time for "+formatDate(next,{day:"numeric",month:"long"})+".");}
  function submit(e:FormEvent) {
    e.preventDefault();
    if(!isAvailable(date,draft.time,new Date())){setError("Choose an available time at least one hour ahead.");document.getElementById("time-options")?.focus();return;}
    update({date});router.push("/book/review");
  }
  return <BookingShell step={2}><PageHeading title="Find your training time.">90 minutes of focused, 1-on-1 coaching.</PageHeading><form onSubmit={submit}>
    <div className="section-title"><h2>Choose a date</h2><div className="date-controls"><button type="button" className="icon-button" aria-label="Previous dates" disabled={currentPage===0} onClick={()=>setPage(p=>Math.max(0,p-1))}>‹</button><button type="button" className="icon-button" aria-label="Next dates" disabled={currentPage===pages-1} onClick={()=>setPage(p=>Math.min(pages-1,p+1))}>›</button></div></div>
    <p className="hint">Sessions available Monday–Friday; weekends unavailable.</p>
    <div className="date-strip" ref={strip} role="group" aria-label="Available dates">{visibleDates.map(d=><button key={d} type="button" aria-pressed={date===d} aria-label={formatDate(d)} className={"date-card "+(date===d?"selected":"")} onClick={()=>choose(d)}><span>{formatDate(d,{month:"short"})}</span><strong>{formatDate(d,{day:"numeric"})}</strong><span>{formatDate(d,{weekday:"short"})}</span></button>)}</div>
    <p className="hint">Dates {currentPage*pageSize+1}–{Math.min((currentPage+1)*pageSize,dates.length)} of {dates.length}. Use the arrows to browse.</p>
    <fieldset id="time-options" tabIndex={-1} className="time-options"><legend>{formatDate(date)}</legend><p className="hint">MYT / UTC+8 · Book at least 1 hour ahead.</p><div className="slot-grid">{SLOTS.map(slot=>{const available=isAvailable(date,slot.id,now);const selected=available&&draft.time===slot.id;return <button type="button" key={slot.id} disabled={!available} aria-pressed={selected} className={"time-slot "+(selected?"selected":"")} onClick={()=>{update({date,time:slot.id});setMessage("Selected "+slot.label+" MYT.");setError("");}}><strong>{slot.label}</strong><span>{!available?"Unavailable / past":selected?"Selected":"Available"}</span></button>;})}</div>{!SLOTS.some(s=>isAvailable(date,s.id,now))&&<p className="notice">No times remain for this date. Choose another weekday above.</p>}</fieldset>
    <p className="selection-message" role="status">{message||(!valid?"Choose a time to continue.":"Your saved time is selected.")}</p>{error&&<p className="field-error" role="alert">{error}</p>}
    <div className="form-actions"><Link href="/book/details" className="text-link">Back to details</Link><button className="button primary" disabled={!valid}>Review booking</button></div>
  </form></BookingShell>;
}
