import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Define your enum for TodoStatus
export enum TodoStatus {
  Pending = 'pending',
  InProgress = 'in progress',
  Done = 'done',
}

// Define your enum for TaskType
export enum TaskType {
  Backlog = 'backlog',
  Tasks = 'tasks',
}

// Define your table
export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  userId: text("userId").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow(),
  userName: text("userName").notNull(),
  status: text("status").notNull().default(TodoStatus.Pending),
  type: text("type").notNull().default(TaskType.Backlog),
});
