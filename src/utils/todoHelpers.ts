/**
 * Todo-specific helper functions
 */
import type { Todo } from "@/types";
import { isPast, getDaysDifference, toDateOnly } from "./dateUtils";


export const isOverdue = (todo: Todo): boolean => {
  if (!todo.deadline || todo.completed) return false;
  return isPast(todo.deadline);
};

export const deadlineLabel = (
  deadline?: string,
  completed?: boolean,
): string => {
  if (!deadline) return "";
  if (completed) return "Đã hoàn thành";

  const diff = getDaysDifference(new Date(), deadline);

  if (diff < 0) return "Quá hạn";
  if (diff === 0) return "Hôm nay";
  if (diff === 1) return "Ngày mai";
  if (diff <= 7) return `${diff} ngày nữa`;
  return new Date(deadline).toLocaleDateString("vi-VN");
};


export const getDeadlineColor = (todo: Todo): string => {
  if (!todo.deadline) return "gray";
  if (todo.completed) return "green";
  if (isOverdue(todo)) return "red";

  const diff = getDaysDifference(new Date(), todo.deadline);
  if (diff === 0) return "orange";
  if (diff <= 2) return "yellow";

  return "blue";
};


export const needsAttention = (todo: Todo): boolean => {
  if (todo.completed) return false;
  if (isOverdue(todo)) return true;
  if (todo.deadline) {
    return (
      toDateOnly(todo.deadline).getTime() === toDateOnly(new Date()).getTime()
    );
  }
  return false;
};
