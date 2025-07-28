import { ApiError } from "@/api/caller/apiCaller";
import { addToast } from "@heroui/toast";

export function showApiErrorToast(error: ApiError) {
  addToast({
    title: 'Error',
    description: error.message,
    color: 'danger',
  });
}