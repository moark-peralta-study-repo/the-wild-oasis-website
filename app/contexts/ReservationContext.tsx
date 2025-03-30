"use client";

import { createContext, useContext, useState } from "react";
import { DateRange } from "react-day-picker";

type ReservationContextType = {
  range: DateRange | undefined;
  setRange: (dateRange: DateRange | undefined) => void;
  resetRange: () => void;
};

type ReservationContextProp = {
  children: React.ReactNode;
};

const ReservationContext = createContext<ReservationContextType | null>(null);

const initialState = { from: undefined, to: undefined } as DateRange;

function ReservationProvider({ children }: ReservationContextProp) {
  const [range, setRangeState] = useState<DateRange | undefined>(initialState);
  function setRange(dateRange: DateRange | undefined) {
    setRangeState(dateRange ?? initialState);
  }

  function resetRange() {
    setRangeState(initialState);
  }

  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
}

function useReservation() {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error("useReservation must be used within the context");
  }

  return context;
}

export { ReservationProvider, useReservation };
