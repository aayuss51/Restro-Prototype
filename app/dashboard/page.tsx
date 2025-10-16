"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardNav } from "@/components/DashboardNav";
import { useAuth } from "@/lib/AuthContext";
import {
  getRestaurantData,
  type Restaurant,
  type MenuItem,
  type Order,
  type Table,
} from "@/lib/mock-data";
import { Utensils, DollarSign, Clock, Users } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<Table[]>([]);

  useEffect(() => {
    if (user) {
      const data = getRestaurantData(user.restaurantId);
      setRestaurant(data.restaurant || null);
      setMenuItems(data.menuItems);
      setOrders(data.orders);
      setTables(data.tables);
    }
  }, [user]);

  if (!user || !restaurant) {
    return <div>Loading...</div>;
  }

  // Calculate statistics
  const activeOrders = orders.filter((order) => order.status !== "paid").length;
  const availableTables = tables.filter(
    (table) => table.status === "available"
  ).length;
  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );
  const popularItems = [...menuItems]
    .sort(() => 0.5 - Math.random()) // Mock sorting by popularity
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {restaurant.name} Dashboard
          </h1>
          <p className="text-gray-600">{restaurant.address}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Active Orders
              </CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeOrders}</div>
              <p className="text-xs text-muted-foreground">
                {activeOrders > 0
                  ? "Orders need attention"
                  : "No pending orders"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Available Tables
              </CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableTables}</div>
              <p className="text-xs text-muted-foreground">
                {availableTables > 0
                  ? "Tables ready for seating"
                  : "All tables occupied"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
              <Utensils className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{menuItems.length}</div>
              <p className="text-xs text-muted-foreground">
                Items on your menu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalRevenue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">From all orders</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Latest orders from your customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">
                        Table{" "}
                        {tables.find((t) => t.id === order.tableId)?.number}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.items.length} items · $
                        {order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                    <div
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "preparing"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "ready"
                          ? "bg-green-100 text-green-800"
                          : order.status === "served"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Popular Menu Items</CardTitle>
              <CardDescription>Your best-selling dishes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div className="h-12 w-12 overflow-hidden rounded-md bg-gray-100">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                    <div className="font-medium text-orange-500">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
