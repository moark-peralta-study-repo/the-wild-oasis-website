export type CabinsAPIResponse = {
  id: number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  image: string;
  description: string;
};

export type SettingsAPIResponse = {
  id: number;
  created_at: string;
  minBookingLength: number;
  maxBookingLength: number;
  maxNumberOfGuestsPerBooking: number;
  breakfastPrice: number;
};

export type UserAuthResponse = {
  name: string;
  email: string;
  image: string;
};

export type GuestsAPIResponse = {
  id: number;
  fullName: string;
  email: string;
  nationalId: number;
  nationality: string;
  countryFlag: string;
};

export type BookingsAPIResponse = {
  id: number;
  created_at: string;
  status: string;
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  totalPrice: number;
  guestId: number;
  cabins: {
    name: string;
    image: string;
  }[];
};

export type CreateGuestInput = {
  email: string;
  fullName: string;
  nationalId?: number;
  nationality?: string;
  countryFlag?: string;
};

export type UpdateGuestInput = Pick<
  GuestsAPIResponse,
  "nationality" | "nationalId" | "countryFlag"
>;
