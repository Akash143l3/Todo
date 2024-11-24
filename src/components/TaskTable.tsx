"use client";

import React, { useState, useTransition } from "react";
import { Search, MoreVertical, Plus, Loader2 } from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Task {
  id: string;
  content: string;
  status: string;
  type: string;
}

interface TaskTableProps {
  tasks: Task[];
  addAction: (formData: FormData) => Promise<void>;
  updateAction: (taskId: string, formData: FormData) => Promise<void>;
  deleteAction: (taskId: string) => Promise<void>;
}

const TaskForm = ({
  task,
  action,
  isEdit = false,
  onClose,
}: {
  task?: Task;
  action: (formData: FormData) => Promise<void>;
  isEdit?: boolean;
  onClose: () => void;
}) => {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      await action(formData);
      window.location.reload();
      onClose();
    });
  };

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          onClose();
          handleSubmit(formData);
        });
      }}
      className="space-y-4"
    >
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

const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  addAction,
  updateAction,
  deleteAction,
}) => {
  const [filterText, setFilterText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredTasks = tasks.filter(
    (task) =>
      (task.content.toLowerCase().includes(filterText.toLowerCase()) ||
        task.id.toLowerCase().includes(filterText.toLowerCase())) &&
      (statusFilter === null || task.status === statusFilter)
  );

  const handleTaskSelect = (taskId: string) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedTasks.size === filteredTasks.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(filteredTasks.map((task) => task.id)));
    }
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (taskId: string) => {
    setDeletingTaskId(taskId);
    startTransition(async () => {
      try {
        await deleteAction(taskId);
      } catch (error) {
        console.error("Error deleting task:", error);
      } finally {
        setDeletingTaskId(null);
      }
    });
  };

  return (
    <div className="w-full mx-auto p-6">
      <div className="space-y-4">
        {/* Header Section */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Filter tasks.."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="pl-10"
            />
          </div>
          {/* Add Task Button */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Task</DialogTitle>
              </DialogHeader>
              <TaskForm
                action={addAction}
                onClose={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Edit Task Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            {editingTask && (
              <TaskForm
                task={editingTask}
                action={(formData) => updateAction(editingTask.id, formData)}
                isEdit
                onClose={() => setIsEditDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Table Section */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedTasks.size === filteredTasks.length &&
                      filteredTasks.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedTasks.has(task.id)}
                      onCheckedChange={() => handleTaskSelect(task.id)}
                    />
                  </TableCell>
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
      </div>
    </div>
  );
};

export default TaskTable;
