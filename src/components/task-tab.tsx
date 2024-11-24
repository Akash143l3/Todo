"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

export default function TaskTabsClient() {
  const pathname = usePathname();
  return (
    <Tabs>
      <TabsList>
        <TabsTrigger isActive={pathname === "/task"} value={"/task"}>
          <Link href={"/task"}>All Task</Link>
        </TabsTrigger>

        <TabsTrigger
          isActive={pathname === "/task/completed"}
          value={"/task/completed"}
        >
          <Link href={"/task/completed"}>Completed Task</Link>
        </TabsTrigger>

        <TabsTrigger
          isActive={pathname === "/task/inprogress"}
          value={"/task/inprogress"}
        >
          <Link href={"/task/inprogress"}>Inprogress Task</Link>
        </TabsTrigger>

        <TabsTrigger
          isActive={pathname === "/task/pending"}
          value={"/task/pending"}
        >
          <Link href={"/task/pending"}>Pending Task</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
