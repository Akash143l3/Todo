import { createPost } from "@/components/addtask";
import AddTaskForm from "@/components/addtask-form";
import TaskTabsClient from "@/components/task-tab";
import { currentUser } from "@clerk/nextjs";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();
  const plainUser = user
    ? {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      }
    : null;
  return (
    <div className="flex flex-col gap-8 px-16 py-10">
      <div className="flex justify-between w-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-xl text-muted-foreground">
            Comprehensive Task Breakdown
          </p>
        </div>

        <AddTaskForm onSubmit={createPost} user={plainUser} />
      </div>
      <div className="w-[600px]">
        <TaskTabsClient />
      </div>
      {children}
    </div>
  );
}
