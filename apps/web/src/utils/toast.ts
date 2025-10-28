import { toast } from "sonner";

export const successToast = (message: string) => {
  toast.success(message, {
    style: {
      backgroundColor: "var(--color-main-100)",
      color: "var(--color-main-900)",
    },
  });
};

export const infoToast = (message: string) => {
  toast.info(message, {
    style: {
      backgroundColor: "var(--color-orange-100)",
      color: "var(--color-orange-700)",
    },
  });
};

export const errorToast = (message: string) => {
  toast.error(message, {
    style: {
      backgroundColor: "var(--color-red-100)",
      color: "var(--color-red-900)",
    },
  });
};
