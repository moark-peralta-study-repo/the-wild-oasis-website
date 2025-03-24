import Counter from "@/app/_components/Counter";

export const metadata = {
  title: "Cabins",
};

async function Page() {
  return (
    <div>
      <h1>Cabins Page</h1>

      <Counter />
    </div>
  );
}

export default Page;
