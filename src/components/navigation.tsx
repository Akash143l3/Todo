"use client";
import { usePathname } from "next/navigation";
import React from "react";
import NavItem from "./ui/nav-item";
import Link from "next/link";

export default function Navigation() {
  const pathname = usePathname();
  return (
    <div className="flex gap-7">
      <Link href={"/dashboard"}>
        <NavItem isActive={pathname == "/dashboard"}>Dashboard</NavItem>
      </Link>
      <Link href={"/task"}>
        <NavItem isActive={pathname.startsWith("/task")}>Task</NavItem>
      </Link>
      <Link href={"/backlog"}>
        <NavItem isActive={pathname.startsWith("/backlog")}>Backlog</NavItem>
      </Link>
    </div>
  );
}
