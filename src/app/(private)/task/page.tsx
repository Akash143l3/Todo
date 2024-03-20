import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/db";
import { tasks, TodoStatus, TaskType } from "@/db/schema";
import { currentUser } from "@clerk/nextjs";
import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UpdateTaskForm } from "@/components/updatetask";
import DeleteTask from "@/components/deletetask";

export default async function Tasks() {
  const user = await currentUser();
  const allTasks = await db.select().from(tasks).orderBy(desc(tasks.createdAt));

  async function createPost(formData: FormData) {
    "use server";

    const content = formData.get("content")?.toString();
    const userId = user?.id;

    if (!userId || !content) return alert("Please fill out both fields");

    const status =
      formData.get("status")?.toString() || TodoStatus.Pending; // Default to Pending if status is not provided
    const userName = user?.firstName + " " + user?.lastName;

    const type =
      formData.get("type") === "backlog" ? TaskType.Backlog : TaskType.Tasks;

    if (!content) throw Error("Content must be there...");

    await db.insert(tasks).values({ content, userId, userName, status, type });

    revalidatePath("/");

    formData.set("content", "");
  }

  async function updateTask(id: string, formData: FormData) {
    const content = formData.get("content")?.toString();
    const status = formData.get("status")?.toString() as TodoStatus;
    const type = formData.get("type") as TaskType;

    if (!content || !status || !type) {
      return alert("Please fill out all fields");
    }

    const response = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, status, type }),
    });

    if (response.ok) {
      revalidatePath("/");
    } else {
      const { message } = await response.json();
      alert(message);
    }
  }

  async function deleteTask(id: string) {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      revalidatePath("/");
    } else {
      const { message } = await response.json();
      alert(message);
    }
  }

  return (
    <div className="flex gap-8 min-h-screen flex-col items-center px-8 py-10 overflow-y-auto">
      <Dialog>
        <DialogTrigger>Add Task</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adding Task</DialogTitle>
            <DialogDescription>
              <div className="flex items-start w-full gap-3 py-6 border-b">
                <div className="flex gap-2 items-center">
                  <Avatar>
                    <AvatarImage src={user?.imageUrl} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
                <form action={createPost} className="w-full flex flex-col gap-2">
                  <h3 className="font-medium text-base ">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <Textarea
                    name="content"
                    className="w-full"
                    placeholder="Start a new task..."
                  />
                  <div className="flex gap-2 items-center">
                    <label htmlFor="status" className="font-medium text-base">
                      Status:
                    </label>
                    <select
                      name="status"
                      id="status"
                      className="border rounded-md px-2 py-1"
                    >
                      {Object.values(TodoStatus).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2 items-center">
                    <label className="font-medium text-base">Type:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="backlog"
                        name="type"
                        value="backlog"
                        required
                      />
                      <label htmlFor="backlog">Backlog</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="task"
                        name="type"
                        value="task"
                        required
                      />
                      <label htmlFor="task">Task</label>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" size={"lg"}>
                      Add Task
                    </Button>
                  </div>
                </form>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="w-full max-w-4xl">
      {allTasks.filter((task) => task.type === TaskType.Tasks).map((task) => (
        
  <div
    key={task.id}
    className="flex items-center justify-between p-4 border rounded-md mb-4"
  >
    <div>
      <h3 className="font-medium">{task.content}</h3>
      <p className="text-sm">
        Status: {task.status} | Type: {task.type}
      </p>
    </div>
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger>
          <Button variant="outline">Update</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Task</DialogTitle>
            <DialogDescription>
            <UpdateTaskForm
                  task={{
                    id: task.id,
                    content: task.content,
                    status: task.status as TodoStatus,
                    type: task.type as TaskType,
                  }}
                 
                />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      
        <Button><DeleteTask task={{id: task.id}}/></Button>
    
    </div>
  </div>
))}

      </div>
    </div>
  );
}