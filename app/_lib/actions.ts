"use server";

import { auth, signIn, signOut } from "@/app/_lib/auth";
import { supabase } from "@/app/_lib/supabase";
import { UpdateGuestInput } from "@/app/types/types";
import { revalidatePath } from "next/cache";
import { getBookings } from "@/app/_lib/data-service";

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

export async function deleteReservationAction(reservationId: string) {
  const session = await auth();

  if (!session || !session.user?.id) {
    throw new Error("You must be logged in");
  }
  const guestBookings = await getBookings(Number(session.user.id));

  const guestBookingIds = guestBookings.map((booking) => booking.id);
  if (!guestBookingIds.includes(reservationId)) {
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
