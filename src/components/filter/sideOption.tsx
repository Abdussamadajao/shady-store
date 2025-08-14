import React from "react";
import {
  Apple,
  Beef,
  Coffee,
  PawPrint,
  SprayCan,
  Milk,
  ChefHat,
  PieChart,
  Wine,
  Heart,
} from "lucide-react";

interface SideOptionItem {
  category: string;
  icon: React.ReactNode;
}

export const data: SideOptionItem[] = [
  {
    category: "Fruits & Vegetables",
    icon: <Apple className="h-8 w-8 text-green-600" />,
  },
  {
    category: "Meat & Fish",
    icon: <Beef className="h-8 w-8 text-red-600" />,
  },
  {
    category: "Snack",
    icon: <Coffee className="h-8 w-8 text-yellow-600" />,
  },
  {
    category: "PetCare",
    icon: <PawPrint className="h-8 w-8 text-purple-600" />,
  },
  {
    category: "Home & Cleaning",
    icon: <SprayCan className="h-8 w-8 text-blue-600" />,
  },
  {
    category: "Dairy",
    icon: <Milk className="h-8 w-8 text-blue-500" />,
  },
  {
    category: "Cooking",
    icon: <ChefHat className="h-8 w-8 text-orange-600" />,
  },
  {
    category: "Breakfast",
    icon: <PieChart className="h-8 w-8 text-pink-600" />,
  },
  {
    category: "Beverage",
    icon: <Wine className="h-8 w-8 text-red-500" />,
  },
  {
    category: "Beauty & Health",
    icon: <Heart className="h-8 w-8 text-pink-500" />,
  },
];
