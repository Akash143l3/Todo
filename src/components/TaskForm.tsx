"use client";
import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Task {
  id: string;
  content: string;
  status: string;
  type: string;
  createdAt: Date;
}

interface TaskFormProps {
  task?: Task;
  action: (formData: FormData) => Promise<void>;
  isEdit?: boolean;
  onClose: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  action,
  isEdit = false,
  onClose,
}) => {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    startTransition(async () => {
      try {
        await action(formData);
        onClose(); // Close the form dialog after submission

        // Refresh the page after successful task creation/update
        window.location.reload();
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="content">Task Content</Label>
        <Input
          id="content"
          name="content"
          defaultValue={task?.content}
          placeholder="Enter task content..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select name="status" defaultValue={task?.status || "PENDING"}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="DONE">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select name="type" defaultValue={task?.type || "TASKS"}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TASKS">Tasks</SelectItem>
            <SelectItem value="BACKLOG">Backlog</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : isEdit ? "Update Task" : "Add Task"}
        </Button>
      </div>
    </form>
  );
};
