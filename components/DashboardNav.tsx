"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import RestaurantImage from "@/public/restaurant.png";
import {
  ChefHat,
  Menu,
  ClipboardList,
  Grid,
  LogOut,
  Sun,
  Moon,
  Table2,
} from "lucide-react";
import Image from "next/image";

export function DashboardNav() {
  const { user, logout } = useAuth();

  const pathname = usePathname();

  if (!user) return null;

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <Grid className="h-5 w-5" />,
    },
    {
      href: "/dashboard/menu",
      label: "Menu",
      icon: <Menu className="h-5 w-5" />,
    },
    {
      href: "/dashboard/orders",
      label: "Orders",
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      href: "/dashboard/tables",
      label: "Tables",
      icon: <Table2 className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex h-16 items-center justify-between border-b bg-white px-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold text-orange-500"
        >
          <Image width={20} height={20} src={RestaurantImage} alt="logo" />
          <span className="hidden md:inline">RestaurantHub</span>
        </Link>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant={pathname === item.href ? "default" : "ghost"}
            size="sm"
            className={
              pathname === item.href ? "bg-orange-500 hover:bg-orange-600" : ""
            }
            asChild
          >
            <Link href={item.href} className="flex items-center gap-1">
              {item.icon}
              <span className="hidden md:inline">{item.label}</span>
            </Link>
          </Button>
        ))}
        {/* <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="text-gray-700 dark:text-gray-300"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button> */}
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="text-red-500 hover:text-red-600"
        >
          <LogOut className="h-5 w-5" />
          <span className="hidden md:inline">Logout</span>
        </Button>
      </div>
    </div>
  );
}
