import { MoreVertical, Eye, UserPlus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PostActionsMenuProps {
  isOwnPost: boolean;
  onViewProfile: () => void;
  onSendConnectionRequest: () => void;
  onEditPost?: () => void;
  onDeletePost?: () => void;
}

export const PostActionsMenu = ({
  isOwnPost,
  onViewProfile,
  onSendConnectionRequest,
  onEditPost,
  onDeletePost,
}: PostActionsMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-card">
        {isOwnPost ? (
          <>
            <DropdownMenuItem onClick={onEditPost}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Post
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDeletePost} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Post
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={onViewProfile}>
              <Eye className="mr-2 h-4 w-4" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSendConnectionRequest}>
              <UserPlus className="mr-2 h-4 w-4" />
              Send Connection Request
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
