import { eachDayOfInterval } from "date-fns";
import { supabase } from "@/app/_lib/supabase";
import {
  BookingsAPIResponse,
  CabinsAPIResponse,
  CountriesAPIResponse,
  CreateGuestInput,
  GuestsAPIResponse,
  SettingsAPIResponse,
} from "@/app/types/types";
import { notFound } from "next/navigation";

/////////////
// GET

export async function getCabin(id: number): Promise<CabinsAPIResponse> {
  const { data, error } = await supabase
    .from("cabins")
    .select("*")
    .eq("id", id)
    .single<CabinsAPIResponse>();

  // For testing
  // await new Promise((res) => setTimeout(res, 1000));

  if (error) {
    console.error(error);
    notFound();
  }

  return data;
}

export const getCabins: () => Promise<CabinsAPIResponse[]> = async function () {
  const { data, error } = await supabase
    .from("cabins")
    .select("id, name, maxCapacity, regularPrice, discount, image")
    .order("name");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data as CabinsAPIResponse[];
};

export async function getCabinPrice(
  id: number,
): Promise<Pick<CabinsAPIResponse, "regularPrice" | "discount"> | null> {
  const { data, error } = await supabase
    .from("cabins")
    .select("regularPrice, discount")
    .eq("id", id)
    .single<Pick<CabinsAPIResponse, "regularPrice" | "discount">>();

  if (error) {
    console.error(error);
  }

  return data;
}

// Guests are uniquely identified by their email address
export async function getGuest(
  email: string,
): Promise<GuestsAPIResponse | null> {
  const { data } = await supabase
    .from("guests")
    .select("*")
    .eq("email", email)
    .single<GuestsAPIResponse>();

  // No error here! We handle the possibility of no guest in the sign in callback
  return data;
}

export async function getBooking(id: number): Promise<BookingsAPIResponse> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single<BookingsAPIResponse>();

  if (error) {
    console.error(error);
    throw new Error("Booking could not get loaded");
  }

  return data;
}

export async function getBookings(
  guestId: number,
): Promise<BookingsAPIResponse[]> {
  const { data, error } = await supabase
    .from("bookings")
    // We actually also need data on the cabins as well. But let's ONLY take the data that we actually need, in order to reduce downloaded data.
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, totalPrice, guestId, cabinId, status,observations, cabins(name, image)",
    )
    .eq("guestId", guestId)
    .order("startDate");

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  //checks if booking.cabins is an array else it converts it into one
  const transformedData = data.map((booking) => {
    return {
      ...booking,
      cabins: Array.isArray(booking.cabins) ? booking.cabins : [booking.cabins],
    };
  });

  return transformedData as BookingsAPIResponse[];
}

export async function getBookedDatesByCabinId(cabinId: number) {
  const todayDate = new Date();
  todayDate.setUTCHours(0, 0, 0, 0);
  const today = todayDate.toISOString();

  // Getting all bookings
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("cabinId", cabinId)
    .or(`startDate.gte.${today},status.eq.checked-in`);

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  // Converting to actual dates to be displayed in the date picker
  const bookedDates = data
    .map((booking) => {
      return eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });
    })
    .flat();

  return bookedDates;
}
//
export async function getSettings(): Promise<SettingsAPIResponse> {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .single<SettingsAPIResponse>();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }

  return data;
}
//

export async function getCountries(): Promise<CountriesAPIResponse> {
  try {
    const res = await fetch(
      "https://restcountries.com/v2/all?fields=name,flag",
    );
    const countries = await res.json();
    return countries;
  } catch {
    throw new Error("Could not fetch countries");
  }
}

/////////////
// CREATE

// export async function createGuest(
//   newGuest: GuestsAPIResponse,
// ): Promise<GuestsAPIResponse> {
//   const { data, error } = await supabase
//     .from("guests")
//     .insert([newGuest])
//     .select()
//     .single<GuestsAPIResponse>();
//
//   if (error) {
//     console.error(error);
//     throw new Error("Guest could not be created");
//   }
//
//   return data;
// }

export async function createGuest(
  newGuest: CreateGuestInput,
): Promise<GuestsAPIResponse> {
  const { data, error } = await supabase
    .from("guests")
    .insert([newGuest])
    .select()
    .single<GuestsAPIResponse>();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be created");
  }

  return data;
}

export async function createBooking(
  newBooking: BookingsAPIResponse,
): Promise<BookingsAPIResponse> {
  const { data, error } = await supabase
    .from("bookings")
    .insert([newBooking])
    // So that the newly created object gets returned!
    .select()
    .single<BookingsAPIResponse>();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }

  return data;
}

/////////////
// UPDATE
/*
// The updatedFields is an object which should ONLY contain the updated data
export async function updateGuest(id, updatedFields) {
  const { data, error } = await supabase
    .from("guests")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }
  return data;
}

export async function updateBooking(id, updatedFields) {
  const { data, error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

/////////////
// DELETE

export async function deleteBooking(id: number): Promise<void> {
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}
*/
