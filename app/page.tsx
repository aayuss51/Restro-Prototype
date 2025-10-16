import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ChefHat, Coffee, LogIn } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <ChefHat className="h-16 w-16 text-orange-500" />
          </div>
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
            RestaurantHub
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            The complete management solution for restaurant owners to handle
            menus, orders, and tables.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="dark:border-gray-700 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Menu Management</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Create and manage your restaurant menu items
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Coffee className="mb-4 h-12 w-12 text-orange-500" />
              <p className="mb-4 text-center text-sm text-gray-600 dark:text-gray-300">
                Easily add, edit, and organize your menu items with prices and
                descriptions.
              </p>
              <Button
                asChild
                className="mt-2 w-full bg-orange-500 hover:bg-orange-600"
              >
                <Link href="/login">Get Started</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="dark:border-gray-700 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Order Tracking</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Monitor and manage customer orders
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mb-4 h-12 w-12 text-orange-500"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 7 3 5" />
                <path d="M9 5 5 9" />
                <path d="m13 5-3 3" />
                <path d="m17 5-5 5" />
                <path d="m21 5-7 7" />
                <path d="M19 7 7 19" />
                <path d="m21 11-7 7" />
                <path d="m19 15-3 3" />
                <path d="m17 19-1 1" />
              </svg>
              <p className="mb-4 text-center text-sm text-gray-600 dark:text-gray-300">
                Keep track of all orders in real-time and update their status as
                they progress.
              </p>
              <Button
                asChild
                className="mt-2 w-full bg-orange-500 hover:bg-orange-600"
              >
                <Link href="/login">Get Started</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="dark:border-gray-700 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">
                Table Management
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Organize your restaurant seating
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mb-4 h-12 w-12 text-orange-500"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
              <p className="mb-4 text-center text-sm text-gray-600 dark:text-gray-300">
                Manage table reservations, availability, and seating
                arrangements efficiently.
              </p>
              <Button
                asChild
                className="mt-2 w-full bg-orange-500 hover:bg-orange-600"
              >
                <Link href="/login">Get Started</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Button
            asChild
            size="lg"
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Link href="/login" className="flex items-center gap-2">
              <LogIn className="h-5 w-5" />
              Login to Your Restaurant
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
