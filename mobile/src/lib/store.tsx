import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Booking,
  Draft,
  EMPTY,
  readBooking,
  readDraft,
} from "../../../lib/booking";
const KEY = "eh-native-v1";
type State = { draft: Draft; bookings: Booking[] };
const initial: State = { draft: { ...EMPTY }, bookings: [] };
const Context = createContext<null | {
  state: State;
  ready: boolean;
  error: string;
  update: (patch: Partial<Draft>) => void;
  save: (b: Booking) => Promise<void>;
  clear: () => Promise<void>;
}>(null);
export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initial);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const current = useRef(state);
  const queue = useRef(Promise.resolve());
  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (raw) {
          const data = JSON.parse(raw);
          const next = {
            draft: readDraft(data.draft),
            bookings: Array.isArray(data.bookings)
              ? data.bookings
                  .map(readBooking)
                  .filter((b: Booking | null): b is Booking => !!b)
              : [],
          };
          current.current = next;
          setState(next);
        }
      })
      .catch(() =>
        setError("Saved data could not be loaded. You can start again."),
      )
      .finally(() => setReady(true));
  }, []);
  function persist(next: State) {
    current.current = next;
    setState(next);
    const task = queue.current
      .catch(() => {})
      .then(() => AsyncStorage.setItem(KEY, JSON.stringify(next)));
    queue.current = task;
    return task
      .then(() => setError(""))
      .catch((e) => {
        setError("Could not save on this device. Please try again.");
        throw e;
      });
  }
  function update(patch: Partial<Draft>) {
    void persist({
      ...current.current,
      draft: { ...current.current.draft, ...patch },
    }).catch(() => {});
  }
  async function save(b: Booking) {
    const previous = current.current;
    try {
      await persist({
        draft: { ...EMPTY },
        bookings: [
          b,
          ...current.current.bookings.filter(
            (x) => x.reference !== b.reference,
          ),
        ].slice(0, 30),
      });
    } catch (e) {
      current.current = previous;
      setState(previous);
      throw e;
    }
  }
  async function clear() {
    await persist({ draft: { ...EMPTY }, bookings: [] });
  }
  return (
    <Context.Provider value={{ state, ready, error, update, save, clear }}>
      {children}
    </Context.Provider>
  );
}
export function useBooking() {
  const v = useContext(Context);
  if (!v) throw Error("Missing booking provider");
  return v;
}
