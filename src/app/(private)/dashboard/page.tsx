import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div className="flex gap-10 min-h-screen flex-col  px-8 py-10 overflow-y-auto ">
      <div className="flex justify-between w-full px-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-xl text-muted-foreground">
            Comprehensive Data Summary
          </p>
        </div>
        <Link href={"/task"}>
          <Button className="px-7">Create Task</Button>
        </Link>
      </div>
      <div className="lg:pr-32">
        <div className=" min-h-72 gap-10 grid md:grid-cols-2 lg:grid-cols-4 pl-10 ">
          <div className="bg-sky-300 text-white border-2 border-sky-400 rounded-lg px-2 pt-4 pb-2">
            <div className="flex flex-col gap-1 px-4">
              <h1 className="text-2xl font-bold">Total Tasks</h1>
              <p className="truncate">Comprehensive Task Breakdown </p>
            </div>
            <div className="w-full h-48 text-7xl justify-center font-bold flex items-center">
              20
            </div>
            <div className="flex justify-end">
              <Link href={"/task"}>
                {" "}
                <Button variant={"link"} className="text-white text-xl">
                  View {">>"}
                </Button>
              </Link>
            </div>
          </div>
          <div className=" bg-green-400  border-2 text-white border-green-500 rounded-lg px-2 pt-4 pb-2">
            <div className="flex flex-col gap-1 px-4">
              <h1 className="text-2xl font-bold">Completed Task</h1>
              <p className="truncate">Task Completion Overview</p>
            </div>
            <div className="w-full h-48 text-7xl justify-center font-bold flex items-center">
              20
            </div>
            <div className="flex justify-end">
              <Link href={"/task/completed"}>
                {" "}
                <Button variant={"link"} className="text-white text-xl">
                  View {">>"}
                </Button>
              </Link>
            </div>
          </div>
          <div className=" bg-yellow-300  border-2 border-yellow-400 text-white rounded-lg px-2 pt-4 pb-2">
            <div className="flex flex-col gap-1 px-4">
              <h1 className="text-2xl font-bold">Inprogress Task</h1>
              <p className="truncate">Current Status and Updates</p>
            </div>
            <div className="w-full h-48 text-7xl justify-center font-bold flex items-center">
              20
            </div>
            <div className="flex justify-end">
              <Link href={"/task/inprogress"}>
                {" "}
                <Button variant={"link"} className="text-white text-xl">
                  View {">>"}
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-red-300  border-2 border-red-400 text-white rounded-lg px-2 pt-4 pb-2">
            <div className="flex flex-col gap-1 px-4">
              <h1 className="text-2xl font-bold">Pending Task</h1>
              <p className="truncate">Tasks Awaiting Completion</p>
            </div>
            <div className="w-full h-48 text-7xl justify-center font-bold flex items-center">
              20
            </div>
            <div className="flex justify-end">
              <Link href={"/task/pending"}>
                {" "}
                <Button variant={"link"} className="text-white text-xl">
                  View {">>"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
