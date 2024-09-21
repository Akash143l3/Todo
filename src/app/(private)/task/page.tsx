// File: app/tasks/page.tsx
import { db } from "@/db";
import { tasks, TodoStatus, TaskType } from "@/db/schema";
import { currentUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import AddTaskForm from "@/components/addtask-form";
import UpdateTaskForm from "@/components/updatetask";
import DeleteTask from "@/components/deletetask";

export default async function Tasks() {
  const user = await currentUser();
  const allTasks = await db.select().from(tasks).orderBy(desc(tasks.createdAt));

  async function createPost(formData: FormData) {
    "use server";
    const content = formData.get("content")?.toString();
    const userId = user?.id;

    if (!userId || !content) return;

    const status = formData.get("status")?.toString() || TodoStatus.Pending;
    const userName = `${user?.firstName} ${user?.lastName}`;
    const type =
      formData.get("type") === "backlog" ? TaskType.Backlog : TaskType.Tasks;

    await db.insert(tasks).values({ content, userId, userName, status, type });
    revalidatePath("/task");
  }

  async function updateTask(taskId: string, formData: FormData) {
    "use server";
    const content = formData.get("content")?.toString();
    const status = formData.get("status")?.toString() as TodoStatus;
    const type =
      formData.get("type") === "backlog" ? TaskType.Backlog : TaskType.Tasks;

    await db
      .update(tasks)
      .set({ content, status, type })
      .where(eq(tasks.id, taskId));
    revalidatePath("/task");
  }

  const safeUser = user
    ? {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      }
    : null;

  // Filter tasks by status and type (only show tasks with type "Tasks")
  const pendingTasks = allTasks.filter(
    (task) =>
      task.status === TodoStatus.Pending &&
      task.userId === user?.id &&
      task.type === TaskType.Tasks
  );
  const inProgressTasks = allTasks.filter(
    (task) =>
      task.status === TodoStatus.InProgress &&
      task.userId === user?.id &&
      task.type === TaskType.Tasks
  );
  const doneTasks = allTasks.filter(
    (task) =>
      task.status === TodoStatus.Done &&
      task.userId === user?.id &&
      task.type === TaskType.Tasks
  );

  return (
    <div className="min-h-screen flex flex-col items-center px-8 py-10 bg-gray-100">
      <AddTaskForm onSubmit={createPost} user={safeUser} />

      <div className="w-full max-w-6xl mt-8">
        {/* Pending Tasks */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Pending Tasks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col p-6 border border-orange-300 rounded-lg bg-orange-50 shadow-md transition-all duration-200 ease-in-out"
              >
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {task.content}
                  </h3>
                  <p className="text-sm">
                    Status: {task.status} | Type: {task.type}
                  </p>
                </div>
                <div className="flex justify-between mt-4">
                  <UpdateTaskForm
                    task={{
                      id: task.id,
                      content: task.content,
                      status: task.status as TodoStatus,
                      type: task.type as TaskType,
                    }}
                    onUpdate={updateTask}
                  />
                  <DeleteTask task={{ id: task.id }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* In Progress Tasks */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            In Progress Tasks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressTasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col p-6 border border-yellow-300 rounded-lg bg-yellow-50 shadow-md transition-all duration-200 ease-in-out"
              >
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {task.content}
                  </h3>
                  <p className="text-sm">
                    Status: {task.status} | Type: {task.type}
                  </p>
                </div>
                <div className="flex justify-between mt-4">
                  <UpdateTaskForm
                    task={{
                      id: task.id,
                      content: task.content,
                      status: task.status as TodoStatus,
                      type: task.type as TaskType,
                    }}
                    onUpdate={updateTask}
                  />
                  <DeleteTask task={{ id: task.id }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Done Tasks */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Completed Tasks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doneTasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col p-6 border border-green-300 rounded-lg bg-green-50 shadow-md transition-all duration-200 ease-in-out"
              >
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {task.content}
                  </h3>
                  <p className="text-sm">
                    Status: {task.status} | Type: {task.type}
                  </p>
                </div>
                <div className="flex justify-between mt-4">
                  <UpdateTaskForm
                    task={{
                      id: task.id,
                      content: task.content,
                      status: task.status as TodoStatus,
                      type: task.type as TaskType,
                    }}
                    onUpdate={updateTask}
                  />
                  <DeleteTask task={{ id: task.id }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
