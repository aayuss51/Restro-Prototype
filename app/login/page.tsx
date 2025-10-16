"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChefHat } from "lucide-react";
import { mockUsers, getRestaurantByCode } from "@/lib/mock-data";
import { useForm } from "react-hook-form";

type LoginFormValues = {
  email: string;
  password: string;
  restaurantCode: string;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  const router = useRouter();

  const onSubmit = (data: LoginFormValues) => {
    // First check if restaurant code is valid
    const restaurant = getRestaurantByCode(data.restaurantCode);

    if (!restaurant) {
      setError("restaurantCode", {
        message: "Invalid restaurant code",
      });
      return;
    }

    // Then check if user credentials match
    const user = mockUsers.find(
      (user) =>
        user.email.toLowerCase() === data.email.toLowerCase() &&
        user.password === data.password &&
        user.restaurantId === restaurant.id
    );

    if (user) {
      // In a real app, we would set a cookie or use a token
      // For this mock version, we'll use localStorage
      localStorage.setItem("currentUser", JSON.stringify(user));
      router.push("/dashboard");
    } else {
      setError("root", {
        message: "Invalid email or password for this restaurant",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <ChefHat className="h-12 w-12 text-orange-500" />
          </div>
          <CardTitle className="text-2xl">Login to RestaurantHub</CardTitle>
          <CardDescription>
            Enter your credentials to access your restaurant dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="restaurantCode">Restaurant Code</Label>
              <Input
                id="restaurantCode"
                placeholder="Enter your restaurant code"
                {...register("restaurantCode", {
                  required: "Restaurant code is required",
                })}
                aria-invalid={errors.restaurantCode ? "true" : "false"}
              />
              {errors.restaurantCode && (
                <p className="text-sm text-red-500">
                  {errors.restaurantCode.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="restaurant@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                })}
                aria-invalid={errors.password ? "true" : "false"}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            {errors.root && (
              <p className="text-sm text-red-500">{errors.root.message}</p>
            )}
            <div className="text-sm text-gray-500">
              <p>Demo accounts:</p>
              <p>italian@example.com / password123 / ITALIA123</p>
              <p>sushi@example.com / password123 / SUSHI456</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
