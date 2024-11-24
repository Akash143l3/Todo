import { UserButton, auth, currentUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import Navigation from "./navigation";

export default async function Navbar() {
  const { userId } = auth();
  const user = await currentUser();

  return (
    <div className="bg-primary  text-secondary flex justify-between items-center h-16 px-6">
      <Link href="/">
        <div className="text-2xl font-bold">TODO</div>
      </Link>
      <div className="flex space-x-8">
        <Navigation />
        <div>
          {" "}
          {userId ? (
            <div className="flex w-36 justify-end text-sm pr-5 gap-2 items-center">
              {user ? `${user.firstName} ${user.lastName}` : "User"}
              <UserButton afterSignOutUrl="/signin" />
            </div>
          ) : (
            <div className="flex gap-4 items-center">
              <Button>
                <Link href="/signup">Sign up</Link>
              </Button>
              <Button>
                <Link href="/signin">Sign In</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
