'use client';

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TodoStatus, TaskType } from "@/db/schema";




interface UpdateTaskFormProps {
    task: {
      id: string;
      content: string;
      status: TodoStatus;
      type: TaskType;
    };
    onSubmit: (formData: FormData) => Promise<void>;
  }
  
export function UpdateTaskForm({ task, onSubmit }: UpdateTaskFormProps) {
    
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          onSubmit(formData);
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
            value="task"
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