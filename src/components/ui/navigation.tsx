import { ArrowLeft, ArrowRight, Home, User } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ProfileView } from "@/components/profile/profile-view";
import { useNavigate } from "react-router-dom";
import { Button } from "./button";
export const Navigation = () => {
  const navigate = useNavigate();

  // Get current user for profile view
  const getCurrentUser = () => {
    const user = localStorage.getItem('alumniConnect_currentUser');
    return user ? JSON.parse(user) : null;
  };
  const handleUpdateAvatar = (avatar: string) => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        avatar
      };
      localStorage.setItem('alumniConnect_currentUser', JSON.stringify(updatedUser));
    }
  };
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
  const currentUser = getCurrentUser();
  return <div className="flex items-center gap-2 p-3 bg-background border-b border-border">
      {/* Profile View Button - Only show if user is logged in */}
      {currentUser && <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <ProfileView user={currentUser} onUpdateAvatar={handleUpdateAvatar} />
          </DialogContent>
        </Dialog>}
      
      
      
      <Button variant="outline" size="sm" onClick={goForward} className="flex items-center gap-1">
        Forward
        <ArrowRight className="h-4 w-4" />
      </Button>

      <Button variant="ghost" size="sm" onClick={goHome} className="flex items-center gap-1 ml-2">
        <Home className="h-4 w-4" />
        Home
      </Button>

      <div className="flex-1" />
      
      <div className="text-lg font-semibold text-primary">
        Alumni Connect
      </div>
    </div>;
};