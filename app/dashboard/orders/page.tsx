"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardNav } from "@/components/DashboardNav";
import { useAuth } from "@/lib/AuthContext";
import { getRestaurantData, type Order, type Table } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (user) {
      const data = getRestaurantData(user.restaurantId);
      setOrders(data.orders);
      setTables(data.tables);
    }
  }, [user]);

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const getStatusBadgeColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "served":
        return "bg-purple-100 text-purple-800";
      case "paid":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <div className="container mx-auto p-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="served">Served</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="flex h-40 items-center justify-center">
                <p className="text-center text-gray-500">No orders found</p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => {
              const table = tables.find((t) => t.id === order.tableId);
              return (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Order #{order.id.slice(-4)} - Table {table?.number}
                      </CardTitle>
                      <Badge className={getStatusBadgeColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{new Date(order.createdAt).toLocaleString()}</span>
                      <span className="font-medium text-orange-500">
                        ${order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="mb-4">
                      <h3 className="mb-2 font-medium">Order Items</h3>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between rounded-md bg-gray-50 p-2"
                          >
                            <div>
                              <span className="font-medium">{item.name}</span>
                              <span className="ml-2 text-sm text-gray-500">
                                x{item.quantity}
                              </span>
                            </div>
                            <span>
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      {order.status === "pending" && (
                        <Button
                          className="bg-blue-500 hover:bg-blue-600"
                          onClick={() =>
                            updateOrderStatus(order.id, "preparing")
                          }
                        >
                          Start Preparing
                        </Button>
                      )}
                      {order.status === "preparing" && (
                        <Button
                          className="bg-green-500 hover:bg-green-600"
                          onClick={() => updateOrderStatus(order.id, "ready")}
                        >
                          Mark as Ready
                        </Button>
                      )}
                      {order.status === "ready" && (
                        <Button
                          className="bg-purple-500 hover:bg-purple-600"
                          onClick={() => updateOrderStatus(order.id, "served")}
                        >
                          Mark as Served
                        </Button>
                      )}
                      {order.status === "served" && (
                        <Button
                          className="bg-gray-500 hover:bg-gray-600"
                          onClick={() => updateOrderStatus(order.id, "paid")}
                        >
                          Mark as Paid
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
