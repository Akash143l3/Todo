// route.ts

import { db } from "@/db";
import { tasks, TodoStatus, TaskType } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// GET route (already provided)
export async function GET(request: Request) {
  try {
    const user = await currentUser();
    const allTasks = await db.select().from(tasks);
    return Response.json(allTasks);
  } catch (e) {
    return Response.json(
      { message: "Couldn't able to load the tasks!" },
      { status: 500 }
    );
  }
}

// DELETE route (for deleting tasks)
