import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Send, X } from "lucide-react";

interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: 'student' | 'alumni';
  content: string;
  createdAt: string;
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onAddComment: (postId: string, content: string) => void;
  onClose: () => void;
  currentUser: {
    id: string;
    name: string;
    role: 'student' | 'alumni';
  } | null;
}

export const CommentSection = ({ 
  postId, 
  comments, 
  onAddComment, 
  onClose, 
  currentUser 
}: CommentSectionProps) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = () => {
    if (!newComment.trim() || !currentUser) return;
    
    onAddComment(postId, newComment.trim());
    setNewComment('');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  return (
    <Card className="card-elevated mt-4">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comments ({comments.length})
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Comment */}
        {currentUser && (
          <div className="space-y-3 p-4 bg-muted rounded-lg">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="input-professional resize-none"
              rows={3}
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmit} 
                disabled={!newComment.trim()}
                className="btn-accent"
                size="sm"
              >
                <Send className="h-4 w-4 mr-2" />
                Comment
              </Button>
            </div>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-accent text-accent-foreground text-xs">
                    {getInitials(comment.authorName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{comment.authorName}</span>
                    <Badge 
                      variant={comment.authorRole === 'alumni' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {comment.authorRole === 'alumni' ? 'Alumni' : 'Student'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};