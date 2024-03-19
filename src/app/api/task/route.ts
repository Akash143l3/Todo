import { db } from "@/db";
import { tasks } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  try {
    const user = await currentUser()
    const allTasks = await db.select().from(tasks);
    return Response.json(allTasks);
  } catch (e) {
    return Response.json(
      { message: "Couldn't able to load the tasks!" },
      { status: 500 }
    );
  }
}