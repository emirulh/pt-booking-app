"use client";
import Link from "next/link";
import {useState,type FormEvent} from "react";
import {useRouter} from "next/navigation";
import {BookingShell,PageHeading} from "./ui";
import {useBooking} from "./booking-provider";
import {validateDetails,normalizePhone,EXPERIENCE,type Draft,type Errors} from "@/lib/booking";
export default function DetailsForm() {
  const {draft,update}=useBooking();const router=useRouter();const [errors,setErrors]=useState<Errors>({});
  const fields:{key:keyof Draft;label:string;type?:string;hint?:string;autoComplete?:string;min?:number;max?:number;optional?:boolean}[]=[
    {key:"name",label:"Full name",autoComplete:"name"},{key:"nickname",label:"Nickname",optional:true,autoComplete:"nickname"},
    {key:"phone",label:"WhatsApp / mobile number",type:"tel",hint:"Malaysian mobile, e.g. +60 12-345 6789.",autoComplete:"tel"},
    {key:"email",label:"Email address",type:"email",autoComplete:"email"},
    {key:"age",label:"Age",type:"number",min:16,max:80,hint:"16–80 years"},
    {key:"height",label:"Height (cm)",type:"number",min:100,max:240,hint:"100–240 cm"},
    {key:"weight",label:"Weight (kg)",type:"number",min:30,max:250,hint:"30–250 kg"}
  ];
  function change(key:keyof Draft,value:string) {update({[key]:value});if(errors[key])setErrors(e=>({...e,[key]:undefined}));}
  function submit(e:FormEvent) {
    e.preventDefault();const next=validateDetails(draft);setErrors(next);
    const first=Object.keys(next)[0];
    if(first) {requestAnimationFrame(()=>{const input=document.getElementById(first);input?.focus();input?.scrollIntoView({block:"center",behavior:"instant"});});return;}
    update({name:draft.name.trim(),phone:normalizePhone(draft.phone),email:draft.email.trim(),location:draft.location.trim()});
    router.push("/book/schedule");
  }
  function error(key:keyof Draft) {return errors[key]&&<p id={key+"-error"} className="field-error">{errors[key]}</p>;}
  return <BookingShell step={1}><PageHeading title="Let’s make it personal.">A few details help shape your session. Required fields are marked *.</PageHeading><p className="privacy-note">Portfolio demo: use sample details. Entries stay in this browser session and are not sent to Emirul.</p><form onSubmit={submit} noValidate>
    {Object.keys(errors).length>0&&<p role="alert" className="notice error-notice">Check the highlighted fields before continuing.</p>}
    <fieldset><legend>About you</legend><div className="form-grid">{fields.map(f=><div className={["age","height","weight"].includes(f.key)?"field metric":"field"} key={f.key}><label htmlFor={f.key}>{f.label} <span className="label-meta">{f.optional?"(optional)":"*"}</span></label><input id={f.key} name={f.key} type={f.type||"text"} value={draft[f.key]} onChange={e=>change(f.key,e.target.value)} autoComplete={f.autoComplete} min={f.min} max={f.max} step={f.key==="age"?1:f.type==="number"?"0.1":undefined} maxLength={f.key==="email"?254:100} required={!f.optional} aria-invalid={!!errors[f.key]} aria-describedby={[f.hint?f.key+"-hint":"",errors[f.key]?f.key+"-error":""].filter(Boolean).join(" ")||undefined}/>{f.hint&&<p className="hint" id={f.key+"-hint"}>{f.hint}</p>}{error(f.key)}</div>)}</div>
    <div className="field"><label htmlFor="experience">Gym experience *</label><select id="experience" value={draft.experience} onChange={e=>change("experience",e.target.value)} required aria-invalid={!!errors.experience} aria-describedby={errors.experience?"experience-error":undefined}><option value="">Select your experience</option>{EXPERIENCE.map(x=><option key={x}>{x}</option>)}</select>{error("experience")}</div></fieldset>
    <fieldset><legend>Where we’ll train</legend><div className="field"><label htmlFor="location">Preferred gym / training location in Penang *</label><input id="location" value={draft.location} onChange={e=>change("location",e.target.value)} required maxLength={200} aria-invalid={!!errors.location} aria-describedby={"location-hint"+(errors.location?" location-error":"")}/><p className="hint" id="location-hint">Include the gym name and area. Gym entry fees are separate.</p>{error("location")}</div>
    <div className="field"><label htmlFor="travel">Distance from George Town city center *</label><select id="travel" value={draft.travel} onChange={e=>change("travel",e.target.value)} required aria-invalid={!!errors.travel} aria-describedby={"travel-hint"+(errors.travel?" travel-error":"")}><option value="">Choose distance</option><option value="within">Within 10km · no travel fee</option><option value="beyond">Beyond 10km · quote required</option><option value="unsure">Not sure · check with Emirul</option></select><p id="travel-hint" className="hint">Distance is self-reported for this demo. Beyond 10km or unsure: RM35 plus an agreed travel quote.</p>{error("travel")}</div></fieldset>
    <div className="form-actions"><Link href="/" className="text-link">Back to home</Link><button className="button primary" type="submit">Continue to schedule</button></div>
  </form></BookingShell>;
}
