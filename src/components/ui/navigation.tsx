import { ArrowLeft, ArrowRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./button";

export const Navigation = () => {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const goForward = () => {
    navigate(1);
  };

  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="flex items-center gap-2 p-3 bg-background border-b border-border">
      <Button
        variant="outline"
        size="sm"
        onClick={goBack}
        className="flex items-center gap-1"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={goForward}
        className="flex items-center gap-1"
      >
        Forward
        <ArrowRight className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={goHome}
        className="flex items-center gap-1 ml-2"
      >
        <Home className="h-4 w-4" />
        Home
      </Button>

      <div className="flex-1" />
      
      <div className="text-lg font-semibold text-primary">
        Alumni Connect
      </div>
    </div>
  );
};