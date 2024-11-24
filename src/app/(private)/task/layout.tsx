import Navbar from "@/components/navbar";
import TaskTabsClient from "@/components/task-tab";
import { Button } from "@/components/ui/button";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col gap-8 px-16 py-10">
      <div className="flex justify-between w-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-xl text-muted-foreground">
            Comprehensive Task Breakdown
          </p>
        </div>
        <Button> Add Task </Button>
      </div>
      <div className="w-[600px]">
        <TaskTabsClient />
      </div>
      {children}
    </div>
  );
}
