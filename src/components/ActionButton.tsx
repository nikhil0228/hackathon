import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}

const ActionButton = ({ icon: Icon, label, onClick }: ActionButtonProps) => {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      size="icon"
      aria-label={label}
      className="w-8 h-8 bg-ubs-red rounded-full hover:bg-ubs-red-dark transition-colors duration-200 group"
    >
      <Icon className="h-4 w-4 text-white" />
    </Button>
  );
};

export default ActionButton;
