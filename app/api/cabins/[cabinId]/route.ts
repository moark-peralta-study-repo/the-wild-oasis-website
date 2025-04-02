import { getBookedDatesByCabinId, getCabin } from "@/app/_lib/data-service";
import { NextRequest } from "next/server";

type CabinRouteParams = {
  params: {
    cabinId: string;
  };
};

export async function GET(request: NextRequest, { params }: CabinRouteParams) {
  const { cabinId } = params;

  try {
    const [cabin, bookedDates] = await Promise.all([
      getCabin(+cabinId),
      getBookedDatesByCabinId(+cabinId),
    ]);

    return Response.json({ cabin, bookedDates });
  } catch {
    return Response.json({ message: "Cabin not found" });
  }
}
