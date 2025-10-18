// Types
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  restaurantId: string;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
  logo: string;
  ownerId: string;
  code: string; // Added restaurant code
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export interface Order {
  id: string;
  restaurantId: string;
  tableId: string;
  items: OrderItem[];
  status: "pending" | "preparing" | "ready" | "served" | "paid";
  totalAmount: number;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Table {
  id: string;
  restaurantId: string;
  number: number;
  capacity: number;
  status: "available" | "occupied" | "reserved";
  reservation?: {
    name: string;
    time: string;
    phone: string;
  };
}

// Mock Data
export const mockUsers: User[] = [
  {
    id: "user1",
    name: "Italian Restaurant Owner",
    email: "italian@example.com",
    password: "password123",
    restaurantId: "rest1",
  },
  {
    id: "user2",
    name: "Sushi Restaurant Owner",
    email: "sushi@example.com",
    password: "password123",
    restaurantId: "rest2",
  },
];

export const mockRestaurants: Restaurant[] = [
  {
    id: "rest1",
    name: "Bella Italia",
    address: "123 Italian Street, Foodville",
    phone: "555-123-4567",
    logo: "https://picsum.photos/seed/italian/200",
    ownerId: "user1",
    code: "ITALIA123", // Added restaurant code
  },
  {
    id: "rest2",
    name: "Sushi Paradise",
    address: "456 Japanese Avenue, Foodville",
    phone: "555-987-6543",
    logo: "https://picsum.photos/seed/sushi/200",
    ownerId: "user2",
    code: "SUSHI456", // Added restaurant code
  },
];

export const mockMenuItems: MenuItem[] = [
  // Italian Restaurant Menu Items
  {
    id: "item1",
    restaurantId: "rest1",
    name: "Margherita Pizza",
    description: "Classic pizza with tomato sauce, mozzarella, and basil",
    price: 12.99,
    category: "Pizza",
    image: "https://picsum.photos/seed/pizza1/300/200",
  },
  {
    id: "item2",
    restaurantId: "rest1",
    name: "Spaghetti Carbonara",
    description: "Pasta with eggs, cheese, pancetta, and black pepper",
    price: 14.99,
    category: "Pasta",
    image: "https://picsum.photos/seed/pasta1/300/200",
  },
  {
    id: "item3",
    restaurantId: "rest1",
    name: "Tiramisu",
    description: "Coffee-flavored Italian dessert",
    price: 7.99,
    category: "Dessert",
    image: "https://picsum.photos/seed/dessert1/300/200",
  },
  {
    id: "item4",
    restaurantId: "rest1",
    name: "Caprese Salad",
    description: "Salad with tomatoes, mozzarella, and basil",
    price: 9.99,
    category: "Appetizer",
    image: "https://picsum.photos/seed/salad1/300/200",
  },
  // Sushi Restaurant Menu Items
  {
    id: "item5",
    restaurantId: "rest2",
    name: "California Roll",
    description: "Crab, avocado, and cucumber roll",
    price: 8.99,
    category: "Maki",
    image: "https://picsum.photos/seed/sushi1/300/200",
  },
  {
    id: "item6",
    restaurantId: "rest2",
    name: "Salmon Nigiri",
    description: "Fresh salmon over pressed rice",
    price: 5.99,
    category: "Nigiri",
    image: "https://picsum.photos/seed/salmon1/300/200",
  },
  {
    id: "item7",
    restaurantId: "rest2",
    name: "Miso Soup",
    description: "Traditional Japanese soup with tofu and seaweed",
    price: 3.99,
    category: "Soup",
    image: "https://picsum.photos/seed/soup1/300/200",
  },
  {
    id: "item8",
    restaurantId: "rest2",
    name: "Green Tea Ice Cream",
    description: "Refreshing green tea flavored ice cream",
    price: 4.99,
    category: "Dessert",
    image: "https://picsum.photos/seed/icecream1/300/200",
  },
];

export const mockTables: Table[] = [
  // Italian Restaurant Tables
  {
    id: "table1",
    restaurantId: "rest1",
    number: 1,
    capacity: 2,
    status: "available",
  },
  {
    id: "table2",
    restaurantId: "rest1",
    number: 2,
    capacity: 4,
    status: "occupied",
  },
  {
    id: "table3",
    restaurantId: "rest1",
    number: 3,
    capacity: 6,
    status: "reserved",
    reservation: {
      name: "Smith Family",
      time: "2023-06-15T19:00:00",
      phone: "555-111-2222",
    },
  },
  {
    id: "table4",
    restaurantId: "rest1",
    number: 4,
    capacity: 4,
    status: "available",
  },
  // Sushi Restaurant Tables
  {
    id: "table5",
    restaurantId: "rest2",
    number: 1,
    capacity: 2,
    status: "occupied",
  },
  {
    id: "table6",
    restaurantId: "rest2",
    number: 2,
    capacity: 4,
    status: "available",
  },
  {
    id: "table7",
    restaurantId: "rest2",
    number: 3,
    capacity: 8,
    status: "reserved",
    reservation: {
      name: "Johnson Party",
      time: "2023-06-16T20:00:00",
      phone: "555-333-4444",
    },
  },
  {
    id: "table8",
    restaurantId: "rest2",
    number: 4,
    capacity: 4,
    status: "available",
  },
];

export const mockOrders: Order[] = [
  // Italian Restaurant Orders
  {
    id: "order1",
    restaurantId: "rest1",
    tableId: "table2",
    items: [
      {
        id: "orderItem1",
        menuItemId: "item1",
        name: "Margherita Pizza",
        price: 12.99,
        quantity: 1,
      },
      {
        id: "orderItem2",
        menuItemId: "item2",
        name: "Spaghetti Carbonara",
        price: 14.99,
        quantity: 1,
      },
    ],
    status: "preparing",
    totalAmount: 27.98,
    createdAt: "2023-06-15T18:30:00",
  },
  {
    id: "order2",
    restaurantId: "rest1",
    tableId: "table4",
    items: [
      {
        id: "orderItem3",
        menuItemId: "item4",
        name: "Caprese Salad",
        price: 9.99,
        quantity: 1,
      },
    ],
    status: "pending",
    totalAmount: 9.99,
    createdAt: "2023-06-15T18:45:00",
  },
  // Sushi Restaurant Orders
  {
    id: "order3",
    restaurantId: "rest2",
    tableId: "table5",
    items: [
      {
        id: "orderItem4",
        menuItemId: "item5",
        name: "California Roll",
        price: 8.99,
        quantity: 2,
      },
      {
        id: "orderItem5",
        menuItemId: "item7",
        name: "Miso Soup",
        price: 3.99,
        quantity: 2,
      },
    ],
    status: "served",
    totalAmount: 25.96,
    createdAt: "2023-06-15T19:00:00",
  },
  {
    id: "order4",
    restaurantId: "rest2",
    tableId: "table6",
    items: [
      {
        id: "orderItem6",
        menuItemId: "item6",
        name: "Salmon Nigiri",
        price: 5.99,
        quantity: 4,
      },
    ],
    status: "ready",
    totalAmount: 23.96,
    createdAt: "2023-06-15T19:15:00",
  },
];

// Helper functions to get data for a specific restaurant
export function getRestaurantData(restaurantId: string) {
  return {
    restaurant: mockRestaurants.find((r) => r.id === restaurantId),
    menuItems: mockMenuItems.filter(
      (item) => item.restaurantId === restaurantId
    ),
    tables: mockTables.filter((table) => table.restaurantId === restaurantId),
    orders: mockOrders.filter((order) => order.restaurantId === restaurantId),
  };
}

// Helper function to get restaurant by code
export function getRestaurantByCode(code: string) {
  return mockRestaurants.find((r) => r.code === code);
}

// Helper function to generate a random image URL from Lorem Picsum
export function getRandomImageUrl(seed?: string) {
  const randomSeed = seed || Math.random().toString(36).substring(7);
  return `https://picsum.photos/seed/${randomSeed}/300/200`;
}
