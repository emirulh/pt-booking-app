"use client";
import {createContext,useContext,useEffect,useState,useRef,type ReactNode} from "react";
import {EMPTY,STORAGE_KEY,readDraft,readBooking,type Draft,type Booking} from "@/lib/booking";
type State = {draft:Draft;booking:Booking|null};
type Context = State & {ready:boolean;storageError:string;update:(patch:Partial<Draft>)=>void;confirm:(b:Booking)=>void;reset:()=>void};
const BookingContext = createContext<Context|null>(null);
export function BookingProvider({children}:{children:ReactNode}) {
  const [state,setState] = useState<State>({draft:{...EMPTY},booking:null});
  const current = useRef(state);
  const [ready,setReady] = useState(false);
  const [storageError,setStorageError] = useState("");
  useEffect(()=>{
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) { const data = JSON.parse(raw); const restored = {draft:readDraft(data.draft),booking:readBooking(data.booking)}; current.current=restored;setState(restored); }
    } catch { setStorageError("Your saved session could not be restored. You can start again below."); }
    setReady(true);
  },[]);
  function save(next:State) {
    current.current=next;setState(next);
    try {sessionStorage.setItem(STORAGE_KEY,JSON.stringify(next));setStorageError("");}
    catch {setStorageError("Browser storage is unavailable. Your details work in this tab but may be lost on refresh.");}
  }
  return <BookingContext.Provider value={{...state,ready,storageError,
    update:patch=>save({...current.current,draft:{...current.current.draft,...patch}}),
    confirm:booking=>save({...current.current,booking}),
    reset:()=>save({draft:{...EMPTY},booking:null})}}>{children}</BookingContext.Provider>;
}
export function useBooking() {
  const context=useContext(BookingContext);
  if (!context) throw new Error("BookingProvider is missing.");
  return context;
}
