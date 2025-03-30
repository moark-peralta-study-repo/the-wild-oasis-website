import { auth } from "@/app/_lib/auth";

export const metadata = {
  title: "Guest Area",
};

async function Page() {
  const session = await auth();

  const firstName = session?.user?.name?.split(" ")[0] ?? "Guest";
  const capitalizedFirstName =
    firstName.charAt(0).toUpperCase() + firstName.slice(1);

  return (
    <h2 className="font-semibold text-2xl text-accent-400 mb-7">
      Welcome, {capitalizedFirstName}!
    </h2>
  );
}

export default Page;
