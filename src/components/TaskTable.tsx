"use client";
import React, { useState, useTransition } from "react";
import { Search, MoreVertical, Loader2, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskForm } from "./TaskForm";

export interface Task {
  id: string;
  content: string;
  status: string;
  type: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  userId: string;
  userName: string;
}

export class TaskQueue {
  private items: Task[];

  constructor() {
    this.items = [];
  }

  enqueue(task: Task) {
    this.items.push(task);
  }

  dequeue(): Task | undefined {
    return this.items.shift();
  }

  getAllTasks(): Task[] {
    return [...this.items];
  }

  peek(): Task | undefined {
    return this.items[0];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  removeById(taskId: string) {
    this.items = this.items.filter((task) => task.id !== taskId);
  }

  updateTask(taskId: string, updatedTask: Partial<Task>) {
    this.items = this.items.map((task) =>
      task.id === taskId ? { ...task, ...updatedTask } : task
    );
  }
}

interface TaskTableProps {
  tasks: Task[];
  addAction: (formData: FormData) => Promise<void>;
  updateAction: (taskId: string, formData: FormData) => Promise<void>;
  deleteAction: (taskId: string) => Promise<void>;
}

const TaskTable: React.FC<TaskTableProps> = ({
  tasks: initialTasks,
  addAction,
  updateAction,
  deleteAction,
}) => {
  // Initialize TaskQueue
  const [taskQueue] = useState(() => {
    const queue = new TaskQueue();
    initialTasks.forEach((task) => queue.enqueue(task));
    return queue;
  });

  const [tasks, setTasks] = useState<Task[]>(taskQueue.getAllTasks());
  const [filterText, setFilterText] = useState("");
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showQueueInfo, setShowQueueInfo] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredTasks = tasks.filter(
    (task) =>
      (task.content.toLowerCase().includes(filterText.toLowerCase()) ||
        task.id.toLowerCase().includes(filterText.toLowerCase())) &&
      !selectedTasks.has(task.id)
  );

  const handleDelete = async (taskId: string) => {
    setDeletingTaskId(taskId);
    startTransition(async () => {
      try {
        await deleteAction(taskId);
        taskQueue.removeById(taskId);
        setTasks(taskQueue.getAllTasks());
        setSelectedTasks((prev) => {
          const newSelectedTasks = new Set(prev);
          newSelectedTasks.delete(taskId);
          return newSelectedTasks;
        });
      } catch (error) {
        console.error("Error deleting task:", error);
      } finally {
        setDeletingTaskId(null);
      }
    });
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsEditDialogOpen(true);
  };

  const handleUpdateTask = async (taskId: string, formData: FormData) => {
    await updateAction(taskId, formData);
    const updatedTask = {
      content: formData.get("content") as string,
      status: formData.get("status") as string,
      type: formData.get("type") as string,
    };
    taskQueue.updateTask(taskId, updatedTask);
    setTasks(taskQueue.getAllTasks());
  };

  const handleAddTask = async (formData: FormData) => {
    await addAction(formData);
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      content: formData.get("content") as string,
      status: formData.get("status") as string,
      type: formData.get("type") as string,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "default-user", // Replace with actual user ID from your auth system
      userName: "Default User", // Replace with actual user name from your auth system
    };
    taskQueue.enqueue(newTask);
    setTasks(taskQueue.getAllTasks());
  };

  return (
    <div className="w-full mx-auto p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Filter tasks..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowQueueInfo(!showQueueInfo)}
            className="flex items-center gap-2"
          >
            <Clock className="h-4 w-4" />
            Queue Info
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>Add New Task</Button>
        </div>

        {showQueueInfo && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p>Tasks in Queue: {taskQueue.size()}</p>
            {taskQueue.peek() && (
              <p>
                Next Task: TASK-{taskQueue.peek()?.id.slice(0, 4)} -{" "}
                {taskQueue.peek()?.content}
              </p>
            )}
            <p>Queue Status: {taskQueue.isEmpty() ? "Empty" : "Has Tasks"}</p>
          </div>
        )}

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task ID</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">
                    TASK-{task.id.slice(0, 4)}
                  </TableCell>
                  <TableCell>{task.content}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        task.status === "DONE"
                          ? "bg-green-100 text-green-800"
                          : task.status === "IN_PROGRESS"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {task.status === "IN_PROGRESS" ? "Progress" : task.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {task.createdAt?.toLocaleDateString() ?? "N/A"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={(event) => {
                            event.preventDefault();
                            handleEditClick(task);
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={(event) => {
                            event.preventDefault();
                            handleDelete(task.id);
                          }}
                          disabled={deletingTaskId === task.id}
                        >
                          {deletingTaskId === task.id ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Deleting...
                            </div>
                          ) : (
                            "Delete"
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsEditDialogOpen(false);
              setEditingTask(null);
              window.location.reload();
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            {editingTask && (
              <TaskForm
                task={{
                  ...editingTask,
                  createdAt: editingTask.createdAt ?? new Date(),
                }}
                action={(formData) =>
                  handleUpdateTask(editingTask.id, formData)
                }
                isEdit
                onClose={() => setIsEditDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>

        <Dialog
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            if (!open) setIsAddDialogOpen(false);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <TaskForm
              action={handleAddTask}
              onClose={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TaskTable;
