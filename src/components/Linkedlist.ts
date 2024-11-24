import { Task } from "./updatetask";

// LinkedList.ts
export interface Node {
  task: Task;
  next: Node | null;
}

export class LinkedList {
  private head: Node | null = null;

  // Insert task at the end
  insert(task: Task) {
    const newNode: Node = { task, next: null };
    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
  }

  // Delete task by id
  delete(taskId: string) {
    if (!this.head) return;

    if (this.head.task.id === taskId) {
      this.head = this.head.next;
      return;
    }

    let current = this.head;
    while (current.next && current.next.task.id !== taskId) {
      current = current.next;
    }

    if (current.next) {
      current.next = current.next.next;
    }
  }

  // Find task by id
  find(taskId: string): Task | null {
    let current = this.head;
    while (current) {
      if (current.task.id === taskId) {
        return current.task;
      }
      current = current.next;
    }
    return null;
  }

  // Get all tasks in an array (for filtering and rendering)
  toArray(): Task[] {
    const tasks: Task[] = [];
    let current = this.head;
    while (current) {
      tasks.push(current.task);
      current = current.next;
    }
    return tasks;
  }
}
