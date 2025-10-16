"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardNav } from "@/components/DashboardNav";
import { useAuth } from "@/lib/AuthContext";
import {
  getRestaurantData,
  type MenuItem,
  getRandomImageUrl,
} from "@/lib/mock-data";
import { Edit, Plus, Trash2, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";

type MenuItemFormValues = {
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
};

export default function MenuPage() {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isNewCategoryAdd, setIsNewCategoryAdd] = useState(false);
  const [isNewCategoryEdit, setIsNewCategoryEdit] = useState(false);

  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    control: controlAdd,
    reset: resetAdd,
    setValue: setValueAdd,
    watch: watchAdd,
    formState: { errors: errorsAdd, isSubmitting: isSubmittingAdd },
  } = useForm<MenuItemFormValues>({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      image: getRandomImageUrl(),
    },
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    control: controlEdit,
    reset: resetEdit,
    setValue: setValueEdit,
    watch: watchEdit,
    formState: { errors: errorsEdit, isSubmitting: isSubmittingEdit },
  } = useForm<MenuItemFormValues>();

  // Watch image fields for preview
  const addImageValue = watchAdd("image");
  const editImageValue = watchEdit("image");
  const addCategoryValue = watchAdd("category");
  const editCategoryValue = watchEdit("category");

  // Watch for category changes to show/hide new category input
  useEffect(() => {
    setIsNewCategoryAdd(addCategoryValue === "new");
  }, [addCategoryValue]);

  useEffect(() => {
    setIsNewCategoryEdit(editCategoryValue === "new");
  }, [editCategoryValue]);

  useEffect(() => {
    setImagePreview(addImageValue || "");
  }, [addImageValue]);

  useEffect(() => {
    if (isEditDialogOpen) {
      setImagePreview(editImageValue || "");
    }
  }, [editImageValue, isEditDialogOpen]);

  useEffect(() => {
    if (user) {
      const data = getRestaurantData(user.restaurantId);
      setMenuItems(data.menuItems);

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(data.menuItems.map((item) => item.category))
      );
      setCategories(uniqueCategories);
    }
  }, [user]);

  const generateNewImage = () => {
    const newImageUrl = getRandomImageUrl();
    setValueAdd("image", newImageUrl);
    setImagePreview(newImageUrl);
  };

  const generateNewImageForEdit = () => {
    const newImageUrl = getRandomImageUrl();
    setValueEdit("image", newImageUrl);
    setImagePreview(newImageUrl);
  };

  const onAddSubmit = (data: MenuItemFormValues) => {
    if (!user) return;

    const newItem: MenuItem = {
      id: `item${Date.now()}`,
      restaurantId: user.restaurantId,
      name: data.name,
      description: data.description,
      price: Number.parseFloat(data.price),
      category: data.category,
      image: data.image,
    };

    setMenuItems((prev) => [...prev, newItem]);

    // Add new category if it doesn't exist
    if (!categories.includes(data.category)) {
      setCategories((prev) => [...prev, data.category]);
    }

    // Reset form
    resetAdd({
      name: "",
      description: "",
      price: "",
      category: "",
      image: getRandomImageUrl(),
    });
    setIsAddDialogOpen(false);
    setIsNewCategoryAdd(false);
  };

  const onEditSubmit = (data: MenuItemFormValues) => {
    if (!currentItem) return;

    const updatedItems = menuItems.map((item) =>
      item.id === currentItem.id
        ? {
            ...item,
            name: data.name,
            description: data.description,
            price: Number.parseFloat(data.price),
            category: data.category,
            image: data.image,
          }
        : item
    );

    setMenuItems(updatedItems);

    // Add new category if it doesn't exist
    if (!categories.includes(data.category)) {
      setCategories((prev) => [...prev, data.category]);
    }

    setIsEditDialogOpen(false);
    setIsNewCategoryEdit(false);
  };

  const handleDeleteItem = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const openEditDialog = (item: MenuItem) => {
    setCurrentItem(item);
    resetEdit({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image,
    });
    setImagePreview(item.image);
    setIsEditDialogOpen(true);
  };

  const filteredItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardNav />
      <div className="container mx-auto p-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Menu Management
          </h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto dark:border-gray-700 dark:bg-gray-800">
              <DialogHeader>
                <DialogTitle className="dark:text-white">
                  Add Menu Item
                </DialogTitle>
                <DialogDescription className="dark:text-gray-400">
                  Add a new item to your restaurant menu.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitAdd(onAddSubmit)}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="dark:text-white">
                      Item Name
                    </Label>
                    <Input
                      id="name"
                      className="dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      {...registerAdd("name", {
                        required: "Name is required",
                      })}
                    />
                    {errorsAdd.name && (
                      <p className="text-sm text-red-500">
                        {errorsAdd.name.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description" className="dark:text-white">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      className="dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      {...registerAdd("description", {
                        required: "Description is required",
                      })}
                    />
                    {errorsAdd.description && (
                      <p className="text-sm text-red-500">
                        {errorsAdd.description.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price" className="dark:text-white">
                      Price ($)
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      className="dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      {...registerAdd("price", {
                        required: "Price is required",
                        min: {
                          value: 0.01,
                          message: "Price must be greater than 0",
                        },
                        pattern: {
                          value: /^\d+(\.\d{1,2})?$/,
                          message:
                            "Price must be a valid number with up to 2 decimal places",
                        },
                      })}
                    />
                    {errorsAdd.price && (
                      <p className="text-sm text-red-500">
                        {errorsAdd.price.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category" className="dark:text-white">
                      Category
                    </Label>
                    <Controller
                      name="category"
                      control={controlAdd}
                      rules={{ required: "Category is required" }}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent className="dark:border-gray-700 dark:bg-gray-800">
                            {categories.map((category) => (
                              <SelectItem
                                key={category}
                                value={category}
                                className="dark:text-white"
                              >
                                {category}
                              </SelectItem>
                            ))}
                            <SelectItem value="new" className="dark:text-white">
                              + Add New Category
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errorsAdd.category && (
                      <p className="text-sm text-red-500">
                        {errorsAdd.category.message}
                      </p>
                    )}
                    {isNewCategoryAdd && (
                      <Input
                        placeholder="New category name"
                        className="mt-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        {...registerAdd("category", {
                          required: "Category name is required",
                        })}
                      />
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="image" className="dark:text-white">
                      Item Image
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="image"
                        className="flex-1 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        {...registerAdd("image", {
                          required: "Image URL is required",
                        })}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={generateNewImage}
                        className="flex items-center gap-1 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>Random</span>
                      </Button>
                    </div>
                    {errorsAdd.image && (
                      <p className="text-sm text-red-500">
                        {errorsAdd.image.message}
                      </p>
                    )}
                    {imagePreview && (
                      <div className="mt-2 rounded-md border p-2 dark:border-gray-700">
                        <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                          Image Preview:
                        </p>
                        <div className="aspect-video w-full overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700">
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Preview"
                            className="h-full w-full object-cover"
                            onError={() =>
                              setImagePreview(
                                "/placeholder.svg?height=200&width=300"
                              )
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      setIsNewCategoryAdd(false);
                    }}
                    className="dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-orange-500 hover:bg-orange-600"
                    type="submit"
                    disabled={isSubmittingAdd}
                  >
                    {isSubmittingAdd ? "Adding..." : "Add Item"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs
          defaultValue="all"
          value={activeCategory}
          onValueChange={setActiveCategory}
        >
          <TabsList className="mb-4 dark:bg-gray-800">
            <TabsTrigger
              value="all"
              className="dark:data-[state=active]:bg-gray-700"
            >
              All
            </TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="dark:data-[state=active]:bg-gray-700"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="dark:border-gray-700 dark:bg-gray-800"
                >
                  <CardContent className="p-0">
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={
                          item.image || "/placeholder.svg?height=200&width=300"
                        }
                        alt={item.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg?height=200&width=300";
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-semibold dark:text-white">
                          {item.name}
                        </h3>
                        <span className="font-medium text-orange-500">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
                        {item.description}
                      </p>
                      <div className="mb-3">
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs dark:bg-gray-700 dark:text-gray-300">
                          {item.category}
                        </span>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-600 dark:border-gray-700 dark:bg-gray-800"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-500 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-800"
                          onClick={() => openEditDialog(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto dark:border-gray-700 dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle className="dark:text-white">
                Edit Menu Item
              </DialogTitle>
              <DialogDescription className="dark:text-gray-400">
                Update the details of this menu item.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitEdit(onEditSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name" className="dark:text-white">
                    Item Name
                  </Label>
                  <Input
                    id="edit-name"
                    className="dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    {...registerEdit("name", {
                      required: "Name is required",
                    })}
                  />
                  {errorsEdit.name && (
                    <p className="text-sm text-red-500">
                      {errorsEdit.name.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description" className="dark:text-white">
                    Description
                  </Label>
                  <Textarea
                    id="edit-description"
                    className="dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    {...registerEdit("description", {
                      required: "Description is required",
                    })}
                  />
                  {errorsEdit.description && (
                    <p className="text-sm text-red-500">
                      {errorsEdit.description.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-price" className="dark:text-white">
                    Price ($)
                  </Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    className="dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    {...registerEdit("price", {
                      required: "Price is required",
                      min: {
                        value: 0.01,
                        message: "Price must be greater than 0",
                      },
                      pattern: {
                        value: /^\d+(\.\d{1,2})?$/,
                        message:
                          "Price must be a valid number with up to 2 decimal places",
                      },
                    })}
                  />
                  {errorsEdit.price && (
                    <p className="text-sm text-red-500">
                      {errorsEdit.price.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-category" className="dark:text-white">
                    Category
                  </Label>
                  <Controller
                    name="category"
                    control={controlEdit}
                    rules={{ required: "Category is required" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="dark:border-gray-700 dark:bg-gray-800">
                          {categories.map((category) => (
                            <SelectItem
                              key={category}
                              value={category}
                              className="dark:text-white"
                            >
                              {category}
                            </SelectItem>
                          ))}
                          <SelectItem value="new" className="dark:text-white">
                            + Add New Category
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errorsEdit.category && (
                    <p className="text-sm text-red-500">
                      {errorsEdit.category.message}
                    </p>
                  )}
                  {isNewCategoryEdit && (
                    <Input
                      placeholder="New category name"
                      className="mt-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      {...registerEdit("category", {
                        required: "Category name is required",
                      })}
                    />
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-image" className="dark:text-white">
                    Item Image
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="edit-image"
                      className="flex-1 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      {...registerEdit("image", {
                        required: "Image URL is required",
                      })}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateNewImageForEdit}
                      className="flex items-center gap-1 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>Random</span>
                    </Button>
                  </div>
                  {errorsEdit.image && (
                    <p className="text-sm text-red-500">
                      {errorsEdit.image.message}
                    </p>
                  )}
                  {imagePreview && (
                    <div className="mt-2 rounded-md border p-2 dark:border-gray-700">
                      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                        Image Preview:
                      </p>
                      <div className="aspect-video w-full overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="h-full w-full object-cover"
                          onError={() =>
                            setImagePreview(
                              "/placeholder.svg?height=200&width=300"
                            )
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setIsNewCategoryEdit(false);
                  }}
                  className="dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-orange-500 hover:bg-orange-600"
                  type="submit"
                  disabled={isSubmittingEdit}
                >
                  {isSubmittingEdit ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
