export type CabinsAPIResponse = {
  id: string;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  image: string;
  description: string;
};

export type SettingsAPIResponse = {
  id: string;
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
  id: string;
  fullName: string;
  email: string;
  nationalId: number;
  nationality: string;
  countryFlag: string;
};

export type BookingsAPIResponse = {
  id: string;
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

export type CountriesAPIResponse = {
  name: string;
  flag: string;
  independent: boolean;
}[];
