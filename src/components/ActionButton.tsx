
import { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}

const ActionButton = ({ icon: Icon, label, onClick }: ActionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-8 h-8 bg-ubs-red rounded-full hover:bg-ubs-red-dark transition-colors duration-200 group"
      title={label}
    >
      <Icon className="h-4 w-4 text-white" />
    </button>
  );
};

export default ActionButton;
