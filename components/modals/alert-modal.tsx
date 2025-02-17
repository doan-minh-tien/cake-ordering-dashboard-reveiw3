import React, { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BsPatchQuestion } from "react-icons/bs";
import { Modal } from "@/components/ui/modal";
interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
  description?: string;
  variant?: "warning" | "danger" | "success" | "info";
  confirmLabel?: string;
  cancelLabel?: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  title = "Xác nhận",
  description = "Bạn có chắc chắn muốn thực hiện hành động này?",
  variant = "warning",
  confirmLabel = "Tiếp tục",
  cancelLabel = "Hủy",
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: <XCircle className="w-12 h-12 text-red-500" />,
          confirmButtonClass: "bg-red-600 hover:bg-red-700 text-white",
        };
      case "success":
        return {
          icon: <CheckCircle2 className="w-12 h-12 text-green-500" />,
          confirmButtonClass: "bg-green-600 hover:bg-green-700 text-white",
        };
      default:
        return {
          icon: <AlertCircle className="w-12 h-12 text-amber-500" />,
          confirmButtonClass: "bg-amber-600 hover:bg-amber-700 text-white",
        };
      case "info":
        return {
          icon: <BsPatchQuestion className="w-12 h-12 text-blue-500" />,
          confirmButtonClass: "bg-blue-600 hover:bg-blue-700 text-white",
          modalBgClass: "bg-blue-100",
          modalTextClass: "text-blue-700",
        };
    }
  };

  const { icon, confirmButtonClass } = getVariantStyles();

  return (
    <Modal title="" description="" isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center p-6 text-center">
        {icon}
        <h2 className="mt-4 text-xl font-semibold ">{title}</h2>
        <p className="mt-2 text-sm ">{description}</p>

        <div className="mt-8 w-full space-x-3 flex items-center justify-center">
          <Button
            disabled={loading}
            variant="outline"
            onClick={onClose}
            className="min-w-[100px]"
          >
            {cancelLabel}
          </Button>
          <Button
            disabled={loading}
            onClick={onConfirm}
            className={`min-w-[100px] ${confirmButtonClass}`}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AlertModal;
