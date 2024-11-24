import { db } from "@/db";
import { tasks, TodoStatus, TaskType } from "@/db/schema";
import { currentUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import UpdateTaskForm from "@/components/updatetask";
import DeleteTask from "@/components/deletetask";
import AddBacklogForm from "@/components/addbacklog-form";

export default async function BackLog() {
  const user = await currentUser();
  const plainUser = user
    ? {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      }
    : null;
  const allTasks = await db.select().from(tasks).orderBy(desc(tasks.createdAt));

  async function createPost(formData: FormData) {
    "use server";

    const content = formData.get("content")?.toString();
    const userId = user?.id;

    if (!userId || !content) return alert("Please fill out both fields");

    const status = formData.get("status")?.toString() || TodoStatus.Pending; // Default to Pending if status is not provided
    const userName = user?.firstName + " " + user?.lastName;

    const type =
      formData.get("type") === "backlog" ? TaskType.Tasks : TaskType.Backlog;

    if (!content) throw Error("Content must be there...");

    await db.insert(tasks).values({ content, userId, userName, status, type });

    revalidatePath("/");

    formData.set("content", "");
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

  return (
    <div className="flex gap-8 min-h-screen flex-col items-center px-8 py-10 overflow-y-auto">
      <AddBacklogForm onSubmit={createPost} user={plainUser} />

      <div className="flex w-full max-w-6xl gap-4">
        {/* Pending Column */}
        <div className="w-1/3">
          <h2 className="text-xl font-bold mb-4">Pending</h2>
          <ScrollArea>
            {allTasks
              .filter(
                (task) =>
                  task.type === TaskType.Backlog &&
                  task.status === TodoStatus.Pending &&
                  task.userId === user?.id
              )
              .map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 border rounded-md mb-4 bg-orange-200"
                >
                  <div>
                    <h3 className="font-medium">{task.content}</h3>
                    <p className="text-sm">
                      Status: {task.status} | Type: {task.type}
                    </p>
                  </div>
                  <div className="flex gap-2">
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
          </ScrollArea>
        </div>

        {/* In Progress Column */}
        <div className="w-1/3">
          <h2 className="text-xl font-bold mb-4">In Progress</h2>
          <ScrollArea>
            {allTasks
              .filter(
                (task) =>
                  task.type === TaskType.Backlog &&
                  task.status === TodoStatus.InProgress &&
                  task.userId === user?.id
              )
              .map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 border rounded-md mb-4 bg-yellow-300"
                >
                  <div>
                    <h3 className="font-medium">{task.content}</h3>
                    <p className="text-sm">
                      Status: {task.status} | Type: {task.type}
                    </p>
                  </div>
                  <div className="flex gap-2">
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
          </ScrollArea>
        </div>

        {/* Done Column */}
        <div className="w-1/3">
          <h2 className="text-xl font-bold mb-4">Done</h2>
          <ScrollArea>
            {allTasks
              .filter(
                (task) =>
                  task.type === TaskType.Backlog &&
                  task.status === TodoStatus.Done &&
                  task.userId === user?.id
              )
              .map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 border rounded-md mb-4 bg-green-200"
                >
                  <div>
                    <h3 className="font-medium">{task.content}</h3>
                    <p className="text-sm">
                      Status: {task.status} | Type: {task.type}
                    </p>
                  </div>
                  <div className="flex gap-2">
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
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
