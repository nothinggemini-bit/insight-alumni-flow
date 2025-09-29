import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Send, X, Reply, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  author_id: string;
  content: string;
  created_at: string;
  parent_comment_id: string | null;
  author: {
    display_name: string;
    role: string;
  };
  replies?: Comment[];
}

interface EnhancedCommentSectionProps {
  postId: string;
  onClose: () => void;
  currentUserId: string | null;
}

export const EnhancedCommentSection = ({ postId, onClose, currentUserId }: EnhancedCommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
    
    // Set up real-time subscription
    const channel = supabase
      .channel(`comments-${postId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`,
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        author:profiles!comments_author_id_fkey(display_name, role)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (data && !error) {
      // Organize comments into threaded structure
      const commentMap = new Map<string, Comment>();
      const rootComments: Comment[] = [];

      data.forEach((comment: any) => {
        const commentWithReplies = { ...comment, replies: [] };
        commentMap.set(comment.id, commentWithReplies);
        
        if (!comment.parent_comment_id) {
          rootComments.push(commentWithReplies);
        }
      });

      // Link replies to parent comments
      data.forEach((comment: any) => {
        if (comment.parent_comment_id) {
          const parent = commentMap.get(comment.parent_comment_id);
          if (parent && parent.replies) {
            parent.replies.push(commentMap.get(comment.id)!);
          }
        }
      });

      setComments(rootComments);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !currentUserId) return;

    const { error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        author_id: currentUserId,
        content: newComment.trim(),
        parent_comment_id: null,
      });

    if (!error) {
      setNewComment('');
      // Update comment count on post
      const { data: post } = await supabase
        .from('posts')
        .select('comment_count')
        .eq('id', postId)
        .single();
      
      if (post) {
        await supabase
          .from('posts')
          .update({ comment_count: post.comment_count + 1 })
          .eq('id', postId);
      }
      
      toast({
        title: "Comment posted",
        description: "Your comment has been added successfully.",
      });
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim() || !currentUserId) return;

    const { error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        author_id: currentUserId,
        content: replyContent.trim(),
        parent_comment_id: parentId,
      });

    if (!error) {
      setReplyContent('');
      setReplyingTo(null);
      toast({
        title: "Reply posted",
        description: "Your reply has been added successfully.",
      });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (!error) {
      toast({
        title: "Comment deleted",
        description: "Your comment has been removed.",
      });
    }
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

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`space-y-3 ${isReply ? 'ml-8' : ''}`}>
      <div className="flex gap-3 p-3 bg-muted/50 rounded-lg">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-accent text-accent-foreground text-xs">
            {getInitials(comment.author.display_name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{comment.author.display_name}</span>
            <Badge 
              variant={comment.author.role === 'alumni' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {comment.author.role === 'alumni' ? 'Alumni' : 'Student'}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatTimeAgo(comment.created_at)}
            </span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{comment.content}</p>
          <div className="flex gap-2">
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(comment.id)}
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>
            )}
            {currentUserId === comment.author_id && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteComment(comment.id)}
                className="text-destructive"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>

      {replyingTo === comment.id && (
        <div className="ml-8 space-y-2">
          <Textarea
            placeholder="Write a reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="resize-none"
            rows={2}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleSubmitReply(comment.id)}>
              <Send className="h-3 w-3 mr-1" />
              Reply
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setReplyingTo(null)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

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
        {currentUserId && (
          <div className="space-y-3 p-4 bg-muted rounded-lg">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="resize-none"
              rows={3}
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmitComment} 
                disabled={!newComment.trim()}
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
            comments.map((comment) => renderComment(comment))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
