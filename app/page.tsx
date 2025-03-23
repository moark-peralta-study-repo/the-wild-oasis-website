import Link from "next/link";

function Home() {
  return (
    <div>
      <h1>The Wild Oasis. Welcome to paradise.</h1>

      <Link href="/cabins">Explore luxury cabins</Link>
    </div>
  );
}

export default Home;
