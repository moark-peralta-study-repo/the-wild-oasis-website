"use client";

import {
  differenceInDays,
  isPast,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { CabinsAPIResponse, SettingsAPIResponse } from "@/app/types/types";
import { useReservation } from "@/app/contexts/ReservationContext";

function isAlreadyBooked(
  range: DateRange | undefined,
  datesArr: Date[],
): boolean {
  return Boolean(
    range?.from &&
      range?.to &&
      datesArr.some((date) =>
        isWithinInterval(date, { start: range.from!, end: range.to! }),
      ),
  );
}

type DateSelectorProps = {
  settings: SettingsAPIResponse;
  cabin: CabinsAPIResponse;
  bookedDates: Date[];
};

function DateSelector({ settings, cabin, bookedDates }: DateSelectorProps) {
  const { range, setRange, resetRange } = useReservation();

  const { regularPrice, discount } = cabin;

  const displayRange: DateRange | undefined = isAlreadyBooked(
    range,
    bookedDates,
  )
    ? undefined
    : range;

  const numNights =
    range?.from && range?.to ? differenceInDays(range.to, range.from) : 0;
  const cabinPrice = numNights * (regularPrice - discount);

  const { minBookingLength, maxBookingLength } = settings;

  return (
    <div className="flex flex-col justify-between">
      <DayPicker
        onSelect={setRange}
        selected={displayRange}
        className="pt-12 place-self-center"
        mode="range"
        min={minBookingLength + 1}
        max={maxBookingLength}
        fromMonth={new Date()}
        fromDate={new Date()}
        toYear={new Date().getFullYear() + 5}
        captionLayout="dropdown"
        numberOfMonths={2}
        disabled={(curDate) =>
          isPast(curDate) ||
          bookedDates.some((date) => isSameDay(date, curDate))
        }
      />

      <div className="flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-[72px]">
        <div className="flex items-baseline gap-6">
          <p className="flex gap-2 items-baseline">
            {discount > 0 ? (
              <>
                <span className="text-2xl">${regularPrice - discount}</span>
                <span className="line-through font-semibold text-primary-700">
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl">${regularPrice}</span>
            )}
            <span className="">/night</span>
          </p>
          {numNights > 0 ? (
            <>
              <p className="bg-accent-600 px-3 py-2 text-2xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p>
                <span className="text-lg font-bold uppercase">Total</span>{" "}
                <span className="text-2xl font-semibold">${cabinPrice}</span>
              </p>
            </>
          ) : null}
        </div>

        {range?.from || range?.to ? (
          <button
            className="border border-primary-800 py-2 px-4 text-sm font-semibold"
            onClick={resetRange}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default DateSelector;
