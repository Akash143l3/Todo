"use server";

import { db } from "@/db";
import { tasks, TodoStatus, TaskType } from "@/db/schema";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
  const user = await currentUser();
  const content = formData.get("content")?.toString();
  const userId = user?.id;

  if (!userId || !content) return alert("Please fill out both fields");

  const status = formData.get("status")?.toString() || TodoStatus.Pending; // Default to Pending if status is not provided
  const userName = user?.firstName + " " + user?.lastName;

  const type =
    formData.get("type") === "task" ? TaskType.Tasks : TaskType.Backlog;

  if (!content) throw Error("Content must be there...");

  await db.insert(tasks).values({ content, userId, userName, status, type });

  revalidatePath("/");

  formData.set("content", "");
}

export async function getUser() {
  const user = await currentUser();
  if (!user) throw new Error("User not authenticated");
  return user;
}
