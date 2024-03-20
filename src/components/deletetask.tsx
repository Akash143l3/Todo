"use client"
import { useRouter } from 'next/navigation';
import { Button } from './ui/button'
import { TaskType, TodoStatus, tasks } from '@/db/schema';

interface UpdateTaskFormProps {
    task: {
      id: string;
    };
    
  }

export default function DeleteTask({ task }: UpdateTaskFormProps) {
    const router =useRouter()
    async function deleteTask(id: string) {
        const response = await fetch(`/api/task/${id}`, {
          method: "DELETE",
        });
    
        if (response.ok) {
            router.refresh()
        } else {
          const { message } = await response.json();
          alert(message);
        }
      }
  return (
    <div>
    <Button
    variant="destructive"
    onClick={() => deleteTask(task.id)}
  >
    Delete
  </Button></div>
  )
}
