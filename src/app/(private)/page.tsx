import { Button } from "@/components/ui/button";
import NavItem from "@/components/ui/nav-item";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Welcome to Todo Website</h1>
      <p className="text-lg mb-8">Use the website By creating Todo</p>
      <Link href={"/dashboard"}>
        <Button>Create TODO</Button>
      </Link>
    </div>
  );
}
