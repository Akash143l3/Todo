"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UpdateTaskFormProps {
  task: {
    id: string;
  };
}

export default function DeleteTask({ task }: UpdateTaskFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function deleteTask(id: string) {
    setLoading(true); // Set loading state to true
    const response = await fetch(`/api/task/${id}`, {
      method: "DELETE",
    });

    setLoading(false); // Set loading state back to false

    if (response.ok) {
      router.refresh();
    } else {
      const { message } = await response.json();
      alert(message);
    }
  }

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Deleting a task is irreversible. Be sure to double-check that the
              task is no longer needed before confirming deletion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <Button
              variant="destructive"
              onClick={() => deleteTask(task.id)}
              disabled={loading} // Disable button while loading
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
