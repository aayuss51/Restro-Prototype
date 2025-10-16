"use client";

import { DialogTrigger } from "@/components/ui/dialog";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardNav } from "@/components/DashboardNav";
import { useAuth } from "@/lib/AuthContext";
import { getRestaurantData, type Table } from "@/lib/mock-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Users, Clock, X } from "lucide-react";
import { useForm } from "react-hook-form";

type TableFormValues = {
  number: string;
  capacity: string;
};

type ReservationFormValues = {
  name: string;
  time: string;
  phone: string;
};

export default function TablesPage() {
  const { user } = useAuth();
  const [tables, setTables] = useState<Table[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isReserveDialogOpen, setIsReserveDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const {
    register: registerTable,
    handleSubmit: handleSubmitTable,
    reset: resetTable,
    formState: { errors: errorsTable, isSubmitting: isSubmittingTable },
  } = useForm<TableFormValues>();

  const {
    register: registerReservation,
    handleSubmit: handleSubmitReservation,
    reset: resetReservation,
    formState: {
      errors: errorsReservation,
      isSubmitting: isSubmittingReservation,
    },
  } = useForm<ReservationFormValues>();

  useEffect(() => {
    if (user) {
      const data = getRestaurantData(user.restaurantId);
      setTables(data.tables);
    }
  }, [user]);

  const onAddTableSubmit = (data: TableFormValues) => {
    if (!user) return;

    const newTable: Table = {
      id: `table${Date.now()}`,
      restaurantId: user.restaurantId,
      number: Number.parseInt(data.number),
      capacity: Number.parseInt(data.capacity),
      status: "available",
    };

    setTables((prev) => [...prev, newTable]);
    resetTable();
    setIsAddDialogOpen(false);
  };

  const onReserveTableSubmit = (data: ReservationFormValues) => {
    if (!selectedTable) return;

    const updatedTables = tables.map((table) =>
      table.id === selectedTable.id
        ? {
            ...table,
            status: "reserved" as const,
            reservation: {
              name: data.name,
              time: data.time,
              phone: data.phone,
            },
          }
        : table
    );

    setTables(updatedTables);
    resetReservation();
    setIsReserveDialogOpen(false);
  };

  const handleTableStatusChange = (
    tableId: string,
    newStatus: Table["status"]
  ) => {
    setTables((prev) =>
      prev.map((table) =>
        table.id === tableId
          ? {
              ...table,
              status: newStatus,
              ...(newStatus !== "reserved" && { reservation: undefined }),
            }
          : table
      )
    );
  };

  const openReserveDialog = (table: Table) => {
    setSelectedTable(table);
    resetReservation();
    setIsReserveDialogOpen(true);
  };

  const getStatusColor = (status: Table["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "occupied":
        return "bg-red-100 text-red-800";
      case "reserved":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <div className="container mx-auto p-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Table Management</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="mr-2 h-4 w-4" /> Add Table
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Table</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmitTable(onAddTableSubmit)}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="number">Table Number</Label>
                    <Input
                      id="number"
                      type="number"
                      {...registerTable("number", {
                        required: "Table number is required",
                        min: {
                          value: 1,
                          message: "Table number must be at least 1",
                        },
                        validate: {
                          notDuplicate: (value) => {
                            const tableNumber = Number.parseInt(value);
                            const exists = tables.some(
                              (table) => table.number === tableNumber
                            );
                            return !exists || "Table number already exists";
                          },
                        },
                      })}
                    />
                    {errorsTable.number && (
                      <p className="text-sm text-red-500">
                        {errorsTable.number.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      {...registerTable("capacity", {
                        required: "Capacity is required",
                        min: {
                          value: 1,
                          message: "Capacity must be at least 1",
                        },
                        max: {
                          value: 20,
                          message: "Capacity cannot exceed 20",
                        },
                      })}
                    />
                    {errorsTable.capacity && (
                      <p className="text-sm text-red-500">
                        {errorsTable.capacity.message}
                      </p>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-orange-500 hover:bg-orange-600"
                    type="submit"
                    disabled={isSubmittingTable}
                  >
                    {isSubmittingTable ? "Adding..." : "Add Table"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tables.map((table) => (
            <Card key={table.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center justify-between bg-gray-50 p-4">
                  <div>
                    <h3 className="font-semibold">Table {table.number}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Users className="h-3 w-3" />
                      <span>Capacity: {table.capacity}</span>
                    </div>
                  </div>
                  <div
                    className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                      table.status
                    )}`}
                  >
                    {table.status.charAt(0).toUpperCase() +
                      table.status.slice(1)}
                  </div>
                </div>
                <div className="p-4">
                  {table.status === "reserved" && table.reservation && (
                    <div className="mb-4 rounded-md bg-blue-50 p-3 text-sm">
                      <div className="font-medium text-blue-800">Reserved</div>
                      <div className="text-blue-700">
                        Name: {table.reservation.name}
                      </div>
                      <div className="flex items-center gap-1 text-blue-700">
                        <Clock className="h-3 w-3" />
                        {new Date(table.reservation.time).toLocaleString()}
                      </div>
                      <div className="text-blue-700">
                        Phone: {table.reservation.phone}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {table.status === "available" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-orange-200 text-orange-500 hover:bg-orange-50 hover:text-orange-600"
                          onClick={() =>
                            handleTableStatusChange(table.id, "occupied")
                          }
                        >
                          Set Occupied
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-blue-200 text-blue-500 hover:bg-blue-50 hover:text-blue-600"
                          onClick={() => openReserveDialog(table)}
                        >
                          Reserve
                        </Button>
                      </>
                    )}
                    {table.status === "occupied" && (
                      <Button
                        size="sm"
                        className="w-full bg-green-500 hover:bg-green-600"
                        onClick={() =>
                          handleTableStatusChange(table.id, "available")
                        }
                      >
                        Mark Available
                      </Button>
                    )}
                    {table.status === "reserved" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-orange-200 text-orange-500 hover:bg-orange-50 hover:text-orange-600"
                          onClick={() =>
                            handleTableStatusChange(table.id, "occupied")
                          }
                        >
                          Seat Guests
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() =>
                            handleTableStatusChange(table.id, "available")
                          }
                        >
                          <X className="mr-1 h-3 w-3" />
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog
          open={isReserveDialogOpen}
          onOpenChange={setIsReserveDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reserve Table {selectedTable?.number}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitReservation(onReserveTableSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Guest Name</Label>
                  <Input
                    id="name"
                    {...registerReservation("name", {
                      required: "Guest name is required",
                    })}
                  />
                  {errorsReservation.name && (
                    <p className="text-sm text-red-500">
                      {errorsReservation.name.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">Reservation Time</Label>
                  <Input
                    id="time"
                    type="datetime-local"
                    {...registerReservation("time", {
                      required: "Reservation time is required",
                      validate: {
                        futureDate: (value) => {
                          const now = new Date();
                          const reservationTime = new Date(value);
                          return (
                            reservationTime > now ||
                            "Reservation must be in the future"
                          );
                        },
                      },
                    })}
                  />
                  {errorsReservation.time && (
                    <p className="text-sm text-red-500">
                      {errorsReservation.time.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    {...registerReservation("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9-+\s()]{7,15}$/,
                        message: "Please enter a valid phone number",
                      },
                    })}
                  />
                  {errorsReservation.phone && (
                    <p className="text-sm text-red-500">
                      {errorsReservation.phone.message}
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsReserveDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-orange-500 hover:bg-orange-600"
                  type="submit"
                  disabled={isSubmittingReservation}
                >
                  {isSubmittingReservation ? "Reserving..." : "Reserve Table"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
