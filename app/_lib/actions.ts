"use server";

import { auth, signIn, signOut } from "@/app/_lib/auth";
import { supabase } from "@/app/_lib/supabase";
import { UpdateGuestInput } from "@/app/types/types";
import { revalidatePath } from "next/cache";
import { getBookings } from "@/app/_lib/data-service";
import { redirect } from "next/navigation";

export async function signInAction() {
  await signIn("google", {
    redirectTo: "/account",
  });
}

export async function signOutAction() {
  await signOut({
    redirectTo: "/",
  });
}

export async function updateGuestAction(formData: FormData) {
  const session = await auth();
  if (!session) {
    throw new Error("You must be logged in");
  }

  const nationalIdValue = formData.get("nationalId");
  if (!nationalIdValue) throw new Error("National ID is required");
  const nationalId = Number(nationalIdValue);

  const nationalityValue = formData.get("nationality") as string;

  if (!nationalityValue) throw new Error("Nationality is required");
  const [nationality, countryFlag] = nationalityValue.split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(String(nationalId)))
    throw new Error("Please enter a valid National ID");

  const updateData: UpdateGuestInput = { nationality, countryFlag, nationalId };

  const { error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user?.id);

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }

  revalidatePath("/account/profile");
}

export async function deleteReservationAction(reservationId: number) {
  const session = await auth();

  if (!session || !session.user?.id) {
    throw new Error("You must be logged in");
  }
  const guestBookings = await getBookings(Number(session.user.id));

  const guestBookingIds = guestBookings.map((booking) => booking.id);
  if (!guestBookingIds.includes(reservationId.toString())) {
    throw new Error("You are not allowed to delete this booking");
  }

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", reservationId);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }

  revalidatePath("/account/reservations");
}

export async function updateBookingAction(formData: FormData) {
  const numGuests = Number(formData.get("numGuests"));
  const observations = formData.get("observations")!.slice(0, 1000);
  const reservationId = formData.get("reservationId");

  const updateData = { numGuests, observations };

  const session = await auth();

  if (!session || !session.user?.id || !reservationId) {
    throw new Error("You must be logged in");
  }

  const guestBookings = await getBookings(Number(session.user.id));

  const guestBookingIds = guestBookings.map((booking) => String(booking.id));

  if (!guestBookingIds.includes(reservationId.toString())) {
    throw new Error("Your are not allowed to update this booking");
  }

  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", reservationId);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }

  revalidatePath(`/account/reservations/edit/${reservationId}`);
  revalidatePath(`/account/reservations`);

  redirect("/account/reservations");
}
