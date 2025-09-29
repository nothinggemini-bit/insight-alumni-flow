import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on landing page
  if (location.pathname === "/") {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => navigate(-1)}
      className="rounded-full"
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
  );
};
