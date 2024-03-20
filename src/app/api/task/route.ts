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

// PUT route (for updating tasks)
export async function PUT(request: Request) {
  try {
    const user = await currentUser();
    const { id, content, status, type } = await request.json();

    if (!user || !content || !id) {
      return Response.json({ message: "Invalid request" }, { status: 400 });
    }

    // Update the task with the provided values
    await db
      .update(tasks)
      .set({
        content,
        status: status as TodoStatus,
        type: type as TaskType,
        updatedAt: new Date(),
      })
      .where(eq(tasks.id,(id)));

    // Revalidate cache
    revalidatePath("/");

    return Response.json({ message: "Task updated successfully" });
  } catch (e) {
    return Response.json({ message: "Error updating task" }, { status: 500 });
  }
}

// DELETE route (for deleting tasks)
export async function DELETE(request: Request) {
  try {
    const user = await currentUser();
    const { id } = await request.json();

    if (!user || !id) {
      return Response.json({ message: "Invalid request" }, { status: 400 });
    }

    // Delete the task with the provided id
    await db.delete(tasks).where(eq(tasks.id , (id)));

    // Revalidate cache
    revalidatePath("/");

    return Response.json({ message: "Task deleted successfully" });
  } catch (e) {
    return Response.json({ message: "Error deleting task" }, { status: 500 });
  }
}