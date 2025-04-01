"use client";
import { useOptimistic } from "react";
import ReservationCard from "@/app/_components/ReservationCard";
import { BookingsAPIResponse } from "@/app/types/types";
import { deleteReservationAction } from "@/app/_lib/actions";

type ReservationListProps = {
  bookings: BookingsAPIResponse[];
};

function ReservationList({ bookings }: ReservationListProps) {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (currentBookings, bookingId) => {
      return currentBookings.filter((booking) => booking.id !== bookingId);
    },
  );

  async function handleDelete(bookingId: number) {
    optimisticDelete(bookingId);
    await deleteReservationAction(bookingId);
  }

  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking) => (
        <ReservationCard
          onDelete={handleDelete}
          booking={booking}
          key={booking.id}
        />
      ))}
    </ul>
  );
}

export default ReservationList;
