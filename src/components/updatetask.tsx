'use client';

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TodoStatus, TaskType } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";




interface UpdateTaskFormProps {
    task: {
      id: string;
      content: string;
      status: TodoStatus;
      type: TaskType;
    };
    
  }
  
export function UpdateTaskForm({ task }: UpdateTaskFormProps) {

    const router =useRouter()

    async function updateTask(id: string, formData: FormData) {
        const content = formData.get("content")?.toString();
        const status = formData.get("status")?.toString() as TodoStatus;
        const type = formData.get("type") as TaskType;
    
        if (!content || !status || !type) {
          return alert("Please fill out all fields");
        }
    
        const response = await fetch(`/api/task/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content, status, type }),
        });
    
        if (response.ok) {
          router.refresh()
        } else {
          const { message } = await response.json();
          alert(message);
        }
      }
    
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          updateTask(task.id, formData)
        
        }}
        className="flex flex-col gap-2"
      >
  
      <Textarea
        name="content"
        className="w-full"
        defaultValue={task.content}
      />
      <div className="flex gap-2 items-center">
        <label htmlFor="status" className="font-medium text-base">
          Status:
        </label>
        <select
          name="status"
          id="status"
          className="border rounded-md px-2 py-1"
          defaultValue={task.status.toString()}
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
            defaultChecked={task.type === TaskType.Backlog}
            required
          />
          <label htmlFor="backlog">Backlog</label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="radio"
            id="task"
            name="type"
            value="tasks"
            defaultChecked={task.type === TaskType.Tasks}
            required
          />
          <label htmlFor="task">Task</label>
        </div>
      </div>
      <Button type="submit">Update Task</Button>
    </form>
  );
}