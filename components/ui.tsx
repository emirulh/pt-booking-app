"use client";
import Link from "next/link";
import {useEffect,useRef,useState,type ReactNode} from "react";
import {usePathname,useRouter} from "next/navigation";
import {useBooking} from "./booking-provider";
import {whatsappUrl,validateDetails,isAvailable,formatDate,SLOTS,priceLabel,type Draft} from "@/lib/booking";
export function Avatar() {
  const [failed,setFailed]=useState(false);
  return <span className="avatar">{failed ? <span role="img" aria-label="Emirul Hakimi initials">EH</span> :
    <img src="/images/emirul-initials.svg" width="88" height="88" alt="Emirul Hakimi initials" fetchPriority="high" onError={()=>setFailed(true)}/>}</span>;
}
export function SiteHeader() {
  return <header className="site-header wrap"><Link className="brand" href="/" aria-label="Emirul Hakimi home"><span className="brand-mark">EH</span><span>Emirul Hakimi<small>Personal training · Penang</small></span></Link><span className="demo-tag">Portfolio demo</span></header>;
}
export function Footer() {
  return <footer className="site-footer wrap"><p>Build strength. Make it a habit.</p><a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">Contact Emirul on WhatsApp <span className="sr-only">(opens a new tab)</span></a><small>Demo only. No payment collected or real session reserved.</small></footer>;
}
export function PageHeading({eyebrow,title,children}:{eyebrow?:string;title:string;children?:ReactNode}) {
  const ref=useRef<HTMLHeadingElement>(null); const pathname=usePathname();
  useEffect(()=>{ref.current?.focus({preventScroll:true});},[pathname]);
  return <div className="page-heading">{eyebrow&&<p className="eyebrow">{eyebrow}</p>}<h1 ref={ref} tabIndex={-1}>{title}</h1>{children&&<p className="muted">{children}</p>}</div>;
}
export function Price({draft}:{draft:Draft}) {
  return <dl className="price-list"><div><dt>Base session · 90 minutes</dt><dd>RM35</dd></div><div><dt>Travel fee</dt><dd>{draft.travel==="within"?"RM0":"Quote required"}</dd></div><div className="total"><dt>{draft.travel==="within"?"Total":"Estimated total"}</dt><dd>{priceLabel(draft)}</dd></div>{draft.travel!=="within"&&<p className="hint">Travel is not included in RM35. Agree on the quote before a real booking.</p>}</dl>;
}
export function Summary({draft,editable=false}:{draft:Draft;editable?:boolean}) {
  return <div className="summary"><section><div className="section-title"><h2>Your session</h2>{editable&&<Link href="/book/schedule">Edit schedule</Link>}</div><p className="summary-date">{formatDate(draft.date)}</p><p>{SLOTS.find(s=>s.id===draft.time)?.label} <span className="muted">MYT / UTC+8</span></p><p className="muted">90-minute 1-on-1 personal training</p></section><section><div className="section-title"><h2>Your details</h2>{editable&&<Link href="/book/details">Edit details</Link>}</div><dl className="details-list"><div><dt>Name</dt><dd>{draft.name}{draft.nickname&&` (${draft.nickname})`}</dd></div><div><dt>Phone</dt><dd>{draft.phone}</dd></div><div><dt>Email</dt><dd>{draft.email}</dd></div><div><dt>Training location</dt><dd>{draft.location}, Penang</dd></div><div><dt>Travel distance</dt><dd>{draft.travel==="within"?"Within 10km":draft.travel==="beyond"?"Beyond 10km":"To be checked"} of George Town city center</dd></div><div><dt>Training profile</dt><dd>{draft.age} years · {draft.height} cm · {draft.weight} kg<br/>{draft.experience}</dd></div></dl></section><section><h2>Price breakdown</h2><Price draft={draft}/></section></div>;
}
export function BookingShell({step,children}:{step:number;children:ReactNode}) {
  const {ready,draft,booking,storageError}=useBooking();const router=useRouter();
  const detailsValid=Object.keys(validateDetails(draft)).length===0;
  const validTime=isAvailable(draft.date,draft.time);
  const redirect = !ready?null:step===4&&!booking?"/book/details":step>1&&step<4&&!detailsValid?"/book/details":step===3&&!validTime?"/book/schedule":null;
  useEffect(()=>{if(redirect)router.replace(redirect);},[redirect,router]);
  if(!ready||redirect) return <main id="main" className="wrap loading" role="status">Preparing your booking…</main>;
  return <main id="main" className="wrap booking-layout"><aside className="session-sidebar"><Avatar/><p className="eyebrow">Your coach</p><h2>Emirul Hakimi</h2><p className="muted">A focused session.<br/>A stronger next step.</p><div className="sidebar-price">RM35 <span>/ session</span></div><ul className="session-facts"><li>90 minutes, just you and your coach</li><li>Your preferred gym in Penang</li><li>Monday–Friday · MYT</li></ul><p className="hint">Beyond 10km from George Town city center? Travel fee quoted separately.</p><div className="demo-note"><strong>Try the full experience</strong><p>No real reservation or payment. Use sample details for this demo.</p></div></aside><div className="booking-main">{step<4&&<nav aria-label="Booking progress" className="progress"><p>Step {step} of 3: {["Your Details","Select a Time","Review & Confirm"][step-1]}</p><ol>{["Details","Schedule","Review"].map((label,i)=><li key={label} aria-current={step===i+1?"step":undefined} className={step>=i+1?"reached":""}><span>{i+1}</span>{i+1<step?<Link href={["/book/details","/book/schedule","/book/review"][i]}>{label}</Link>:label}</li>)}</ol></nav>}{storageError&&<p className="notice" role="status">{storageError}</p>}<div className="panel page-enter">{children}</div></div></main>;
}
