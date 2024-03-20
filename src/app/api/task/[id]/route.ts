import { db } from "@/db";
import { TaskType, TodoStatus, tasks } from "@/db/schema";
import { currentUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// PUT route (for updating tasks)
export async function PUT(request: Request,  { params }: { params: { id: string } }) {
    
    try {
      const user = await currentUser();
      const { content, status, type } = await request.json();
      const id = params.id;


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
  
  export async function DELETE(request: Request,{ params }: { params: { id: string } }) {
    try {
      const user = await currentUser();
      const id = params.id;
  
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