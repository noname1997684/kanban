import { toaster } from "@/components/ui/toaster";

const useShowToast = () => {
  const showToast = (message: string, type: string) => {
    toaster.create({
      title: message,
      type: type,
    });
  };
  return { showToast };
};
export default useShowToast;
