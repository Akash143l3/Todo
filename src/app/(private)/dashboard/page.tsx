import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/db";
import { tasks, TodoStatus, TaskType } from "@/db/schema"; // Import TodoStatus and TaskType enums
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

export default async function Home() {
  const user = await currentUser();

  const allTasks = await db.select().from(tasks).orderBy(desc(tasks.createdAt));

  async function createPost(formData: FormData) {
    "use server";

    const content = formData.get("content")?.toString();
    const userId = user?.id;

    if (!userId || !content) return alert("Please fill out both fields");

    // Get the status value from the form data
    const status = formData.get("status")?.toString() || TodoStatus.Pending; // Default to Pending if status is not provided
    const userName = user?.firstName + ' ' + user?.lastName;
    
    // Get the type value from the form data
    const type = formData.get("type") === "backlog" ? TaskType.Backlog : TaskType.Tasks;

    if (!content) throw Error("Content must be there...");

    // Insert the task with provided values
    await db.insert(tasks).values({ content, userId, userName, status, type });
    
    // Revalidate cache
    revalidatePath("/");
    
    // Clear the content field
    formData.set("content", "");
  }

  // Filter todos based on status
  const pendingTodos = allTasks.filter(post => post.status === TodoStatus.Pending);
  const inProgressTodos = allTasks.filter(post => post.status === TodoStatus.InProgress);
  const doneTodos = allTasks.filter(post => post.status === TodoStatus.Done);

  return (
    <div className="flex gap-8 flex-col px-8 py-10 ">
      
      <Dialog>
       <div className="flex justify-between "><h1 className="font-bold text-3xl">Starts with creating Todo</h1>
        <DialogTrigger className="bg-blue-500 p-2 rounded-lg">Add Todo</DialogTrigger></div>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adding Todo</DialogTitle>
            <DialogDescription>
              <div className="flex items-start w-full gap-3 py-6 border-b">
                <div className="flex gap-2 items-center">
                  <Avatar>
                    <AvatarImage src={user?.imageUrl} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
                <form action={createPost} className="w-full flex flex-col gap-2">
                  <h3 className="font-medium text-base">{user?.firstName}{" "}{user?.lastName}</h3>
                  <Textarea
                    name="content"
                    className="w-full"
                    placeholder="Start a new thread..."
                  />
                  <div className="flex gap-2 items-center">
                    <label htmlFor="status" className="font-medium text-base">Status:</label>
                    <select name="status" id="status" className="border rounded-md px-2 py-1">
                      {/* Populate dropdown options with enum values */}
                      {Object.values(TodoStatus).map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2 items-center">
                    <label className="font-medium text-base">Type:</label>
                    <div className="flex items-center gap-2">
                      <input type="radio" id="backlog" name="type" value="backlog" required/>
                      <label htmlFor="backlog">Backlog</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="radio" id="task" name="type" value="task" required/>
                      <label htmlFor="task">Task</label>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" size={"lg"}>
                      Post
                    </Button>
                  </div>
                </form>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Display Todos */}
      <div className="mt-8 grid grid-cols-3 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Pending</h2>
          {pendingTodos.map((post) => (
            <div key={post.id} className="border rounded-md p-4 mb-2">
              <h3 className="font-medium">{post.userName}</h3>
              <p>{post.content}</p>
              <p>Status: {post.status}</p>
              <p>Type: {post.type}</p>
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">In Progress</h2>
          {inProgressTodos.map((post) => (
            <div key={post.id} className="border rounded-md p-4 mb-2">
              <h3 className="font-medium">{post.userName}</h3>
              <p>{post.content}</p>
              <p>Status: {post.status}</p>
              <p>Type: {post.type}</p>
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Done</h2>
          {doneTodos.map((post) => (
            <div key={post.id} className="border rounded-md p-4 mb-2">
              <h3 className="font-medium">{post.userName}</h3>
              <p>{post.content}</p>
              <p>Status: {post.status}</p>
              <p>Type: {post.type}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
