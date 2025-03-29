import CabinList, { FilterSize } from "@/app/_components/CabinList";
import { Suspense } from "react";
import Spinner from "@/app/_components/Spinner";

type PageProps = {
  searchParams: Record<string, string | undefined>;
};

// export const revalidate = 3600;

export const metadata = {
  title: "Cabins",
};

const validFilters: FilterSize[] = ["small", "medium", "large", "all"];

export default function Page({ searchParams }: PageProps) {
  const filterParam = searchParams?.capacity;
  const filter: FilterSize = validFilters.includes(filterParam as FilterSize)
    ? (filterParam as FilterSize)
    : "all";
  return (
    <div>
      <h1 className="text-4xl mb-5 text-accent-400 font-medium">
        Our Luxury Cabins
      </h1>
      <p className="text-primary-200 text-lg mb-10">
        Cozy yet luxurious cabins, located right in the heart of the Italian
        Dolomites. Imagine waking up to beautiful mountain views, spending your
        days exploring the dark forests around, or just relaxing in your private
        hot tub under the stars. Enjoy nature&#39;s beauty in your own little
        home away from home. The perfect spot for a peaceful, calm vacation.
        Welcome to paradise.
      </p>

      <Suspense fallback={<Spinner />}>
        <CabinList filter={filter} />
      </Suspense>
    </div>
  );
}
