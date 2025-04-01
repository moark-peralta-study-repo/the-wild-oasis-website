import DateSelector from "@/app/_components/DateSelector";
import ReservationForm from "@/app/_components/ReservationForm";
import { getBookedDatesByCabinId, getSettings } from "@/app/_lib/data-service";
import {
  CabinsAPIResponse,
  SettingsAPIResponse,
  UserAuthResponse,
} from "@/app/types/types";
import { auth } from "@/app/_lib/auth";
import LoginMessage from "@/app/_components/LoginMessage";
import { Session } from "next-auth";

type ReservationProps = {
  cabin: CabinsAPIResponse;
};

async function Reservation({ cabin }: ReservationProps) {
  const [settings, bookedDates]: [SettingsAPIResponse, Date[]] =
    await Promise.all([getSettings(), getBookedDatesByCabinId(cabin.id)]);

  const session: Session | null = await auth();

  const userAuth: UserAuthResponse | null = session?.user
    ? ({
        id: session.user.id || "",
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image || "",
      } as UserAuthResponse)
    : null;

  return (
    <div className="grid grid-cols-2 border border-primary-800 min-h-[400px]">
      <DateSelector
        settings={settings}
        bookedDates={bookedDates}
        cabin={cabin}
      />
      {userAuth ? (
        <ReservationForm cabin={cabin} user={userAuth} />
      ) : (
        <LoginMessage />
      )}
    </div>
  );
}

export default Reservation;
