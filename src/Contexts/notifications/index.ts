import { notification } from "antd";

export const showNotification = (
  type: "error" | "warn" | "success" | "info",
  message: string,
  description?: string
) => {
  notification[type]({
    message: message,
    description: description,
    duration: 5,
  });
};
