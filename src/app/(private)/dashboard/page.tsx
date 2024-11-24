import { Button } from "@/components/ui/button";
import Link from "next/link";
import { sql } from "drizzle-orm";
import { tasks } from "@/db/schema";
import { db } from "@/db";
import { currentUser } from "@clerk/nextjs";

export default async function Page() {
  try {
    const user = await currentUser();

    if (!user) {
      return <div>Please log in to view your tasks.</div>;
    }

    const plainUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
    };

    // Fetch all counts in a single query for current user only
    const statsResult = await db
      .select({
        total: sql<number>`COUNT(*)`,
        completed: sql<number>`COUNT(CASE WHEN ${tasks.status} = 'DONE' THEN 1 END)`,
        pending: sql<number>`COUNT(CASE WHEN ${tasks.status} = 'PENDING' THEN 1 END)`,
        inProgress: sql<number>`COUNT(CASE WHEN ${tasks.status} = 'IN_PROGRESS' THEN 1 END)`,
      })
      .from(tasks)

      .where(
        sql`${tasks.userId} = ${plainUser.id} AND ${tasks.type} = 'TASKS'`
      );

    const stats = statsResult[0] || {
      total: 0,
      completed: 0,
      pending: 0,
      inProgress: 0,
    };

    // Convert all values to numbers to ensure proper display
    const counts = {
      total: Number(stats.total),
      completed: Number(stats.completed),
      pending: Number(stats.pending),
      inProgress: Number(stats.inProgress),
    };

    console.log("Task Stats for user:", plainUser.id, counts);

    return (
      <div className="flex gap-10 min-h-screen flex-col px-8 py-10 overflow-y-auto">
        <div className="flex justify-between w-full px-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">
              Welcome, {plainUser.firstName}!
            </h1>
            <p className="text-xl text-muted-foreground">Your Task Summary</p>
          </div>
          <Link href="/task">
            <Button className="px-7">Create Task</Button>
          </Link>
        </div>
        <div className="lg:pr-32">
          <div className="min-h-72 gap-10 grid md:grid-cols-2 lg:grid-cols-4 pl-10">
            <div className="bg-sky-300 text-white border-2 border-sky-400 rounded-lg px-2 pt-4 pb-2">
              <div className="flex flex-col gap-1 px-4">
                <h1 className="text-2xl font-bold">Total Tasks</h1>
                <p className="truncate">Your Task Breakdown</p>
              </div>
              <div className="w-full h-48 text-7xl justify-center font-bold flex items-center">
                {counts.total}
              </div>
              <div className="flex justify-end">
                <Link href="/task">
                  <Button variant="link" className="text-white text-xl">
                    View {">>"}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="bg-green-400 border-2 text-white border-green-500 rounded-lg px-2 pt-4 pb-2">
              <div className="flex flex-col gap-1 px-4">
                <h1 className="text-2xl font-bold">Completed Tasks</h1>
                <p className="truncate">Your Completed Tasks</p>
              </div>
              <div className="w-full h-48 text-7xl justify-center font-bold flex items-center">
                {counts.completed}
              </div>
              <div className="flex justify-end">
                <Link href="/task/completed">
                  <Button variant="link" className="text-white text-xl">
                    View {">>"}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="bg-yellow-300 border-2 border-yellow-400 text-white rounded-lg px-2 pt-4 pb-2">
              <div className="flex flex-col gap-1 px-4">
                <h1 className="text-2xl font-bold">In Progress Tasks</h1>
                <p className="truncate">Your Ongoing Tasks</p>
              </div>
              <div className="w-full h-48 text-7xl justify-center font-bold flex items-center">
                {counts.inProgress}
              </div>
              <div className="flex justify-end">
                <Link href="/task/inprogress">
                  <Button variant="link" className="text-white text-xl">
                    View {">>"}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="bg-red-300 border-2 border-red-400 text-white rounded-lg px-2 pt-4 pb-2">
              <div className="flex flex-col gap-1 px-4">
                <h1 className="text-2xl font-bold">Pending Tasks</h1>
                <p className="truncate">Your Pending Tasks</p>
              </div>
              <div className="w-full h-48 text-7xl justify-center font-bold flex items-center">
                {counts.pending}
              </div>
              <div className="flex justify-end">
                <Link href="/task/pending">
                  <Button variant="link" className="text-white text-xl">
                    View {">>"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching task stats:", error);
    return <div>Error fetching task stats.</div>;
  }
}
