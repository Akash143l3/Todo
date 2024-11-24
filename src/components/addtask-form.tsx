"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TodoStatus } from "@/db/schema";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
}

interface AddTaskFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  user: User | null;
}

export default function AddTaskForm({ onSubmit, user }: AddTaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(new FormData(e.currentTarget));
      setIsOpen(false);

      // Refresh the page after successful form submission
      window.location.reload();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>Add Task</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adding Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <DialogDescription>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage
                    src={user?.imageUrl || ""}
                    alt={user?.firstName || ""}
                  />
                  <AvatarFallback>
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>
              </div>
              <Textarea
                placeholder="Type your task here."
                name="content"
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
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
