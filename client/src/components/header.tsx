"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "./shared/user-button";

const navItems: { name: string; href: string }[] = [
  { name: "Dashboard", href: "/dashboard" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-8">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-primary hover:opacity-80 transition-opacity"
          >
            HOME
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-base font-medium">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "transition-colors px-2 py-1 rounded hover:bg-gray-100 hover:text-primary",
                  pathname === item.href
                    ? "text-primary bg-gray-100"
                    : "text-gray-500"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-2">
          <UserButton />
        </div>
      </div>
    </header>
  );
}
