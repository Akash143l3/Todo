"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TodoStatus, TaskType } from "@/db/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface Task {
  id: string;
  content: string;
  status: TodoStatus;
  type: TaskType;
}

interface UpdateTaskFormProps {
  task: Task;
  onUpdate: (taskId: string, formData: FormData) => Promise<void>;
}

export default function UpdateTaskForm({
  task,
  onUpdate,
}: UpdateTaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onUpdate(task.id, new FormData(e.currentTarget));
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Update</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <DialogDescription>
            <div className="space-y-4">
              <Textarea
                placeholder="Update your task here."
                name="content"
                defaultValue={task.content}
                required
              />
              <div className="flex gap-2 items-center mt-2">
                <label htmlFor="status" className="font-medium text-base">
                  Status:
                </label>
                <select
                  name="status"
                  id="status"
                  className="border rounded-md px-2 py-1"
                  defaultValue={task.status}
                >
                  {Object.values(TodoStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 items-center mt-2">
                <label className="font-medium text-base">Type:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="backlog"
                    name="type"
                    value="BACKLOG"
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
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
