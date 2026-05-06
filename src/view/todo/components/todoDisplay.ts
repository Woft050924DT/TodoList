import type { CategoryName, Priority } from "@/types";

export const priorityOptions: Array<{
  value: Priority;
  label: string;
  activeClass: string;
}> = [
  {
    value: "Thấp",
    label: "Thấp",
    activeClass: "border-green-400 bg-green-50 text-green-700",
  },
  {
    value: "Vừa",
    label: "Vừa",
    activeClass: "border-amber-400 bg-amber-50 text-amber-700",
  },
  {
    value: "Cao",
    label: "Cao",
    activeClass: "border-red-400 bg-red-50 text-red-700",
  },
];

export const priorityBadgeColors: Record<string, string> = {
  Cao: "bg-red-100 text-red-600",
  Vừa: "bg-amber-100 text-amber-600",
  Thấp: "bg-gray-100 text-gray-500",
};

export const prioritySelectColors: Record<string, string> = {
  Cao: "bg-red-50 text-red-600 border-red-200",
  Vừa: "bg-amber-50 text-amber-600 border-amber-200",
  Thấp: "bg-gray-50 text-gray-500",
};

export const categoryBadgeColors: Record<CategoryName, string> = {
  "Công việc": "bg-blue-100 text-blue-700",
  "Cá nhân": "bg-purple-100 text-purple-700",
  "Học tập": "bg-orange-100 text-orange-700",
  "Mua sắm": "bg-green-100 text-green-700",
};

export function getCategoryIcon(categoryName: string): string {
  const icons: Record<string, string> = {
    "Công việc": "ðŸ’¼",
    "Cá nhân": "ðŸ‘¤",
    "Học tập": "ðŸ“š",
    "Mua sắm": "ðŸ›’",
  };

  return icons[categoryName] || "ðŸ“";
}
