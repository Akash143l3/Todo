// task/page.tsx
import { db } from "@/db";
import { tasks, TodoStatus, TaskType } from "@/db/schema";
import { currentUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import TaskTable from "@/components/TaskTable";
import { redirect } from "next/navigation";

async function deleteTask(taskId: string) {
  "use server";
  await db.delete(tasks).where(eq(tasks.id, taskId));
  revalidatePath("/task");
}

async function addTask(formData: FormData) {
  "use server";
  const user = await currentUser();
  if (!user) return;

  const content = formData.get("content")?.toString();
  const status = formData.get("status")?.toString() as TodoStatus;
  const type = formData.get("type")?.toString() as TaskType;

  if (!content) return;

  await db.insert(tasks).values({
    content,
    status,
    type,
    userId: user.id,
    userName: `${user.firstName} ${user.lastName}`,
  });

  revalidatePath("/task");
}

async function updateTask(taskId: string, formData: FormData) {
  "use server";
  const user = await currentUser();
  if (!user) return;

  const content = formData.get("content")?.toString();
  const status = formData.get("status")?.toString() as TodoStatus;
  const type = formData.get("type")?.toString() as TaskType;

  await db
    .update(tasks)
    .set({ content, status, type })
    .where(eq(tasks.id, taskId));

  revalidatePath("/task");
}

export default async function Tasks() {
  try {
    const user = await currentUser();

    if (!user) {
      redirect("/sign-in");
    }

    const allTasks = await db
      .select()
      .from(tasks)
      .orderBy(desc(tasks.createdAt));
    const userTasks = allTasks.filter((task) => task.userId === user.id);

    return (
      <div className="min-h-screen bg-gray-100">
        <TaskTable
          tasks={userTasks}
          addAction={addTask}
          updateAction={updateTask}
          deleteAction={deleteTask}
        />
      </div>
    );
  } catch (error) {
    console.error("Error in Tasks page:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Tasks
          </h2>
          <p className="text-gray-600">
            Please try refreshing the page or sign in again.
          </p>
        </div>
      </div>
    );
  }
}
