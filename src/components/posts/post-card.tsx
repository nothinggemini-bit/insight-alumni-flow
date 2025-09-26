import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, ChevronDown, MessageCircle, Share, MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  id: string;
  author: {
    name: string;
    role: 'student' | 'alumni';
    branch: string;
    yearOfPassing?: string;
    company?: string;
  };
  content: {
    title?: string;
    body: string;
    image?: string;
  };
  votes: {
    upvotes: number;
    downvotes: number;
    userVote?: 'up' | 'down' | null;
  };
  comments: number;
  createdAt: string;
  onVote: (postId: string, voteType: 'up' | 'down') => void;
  onComment: (postId: string) => void;
}

export const PostCard = ({ 
  id, 
  author, 
  content, 
  votes, 
  comments, 
  createdAt, 
  onVote, 
  onComment 
}: PostCardProps) => {
  const [currentVote, setCurrentVote] = useState<'up' | 'down' | null>(votes.userVote || null);
  const [voteCount, setVoteCount] = useState(votes.upvotes - votes.downvotes);

  const handleVote = (voteType: 'up' | 'down') => {
    let newVoteCount = voteCount;
    
    // Remove previous vote if exists
    if (currentVote === 'up') newVoteCount--;
    if (currentVote === 'down') newVoteCount++;
    
    // Apply new vote if different from current
    if (currentVote !== voteType) {
      if (voteType === 'up') newVoteCount++;
      if (voteType === 'down') newVoteCount--;
      setCurrentVote(voteType);
    } else {
      setCurrentVote(null);
    }
    
    setVoteCount(newVoteCount);
    onVote(id, voteType);
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
    <Card className="card-elevated hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-accent text-accent-foreground text-sm font-medium">
                {getInitials(author.name)}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-primary">{author.name}</h4>
                <Badge 
                  variant={author.role === 'alumni' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {author.role === 'alumni' ? 'Alumni' : 'Student'}
                </Badge>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {author.branch}
                {author.role === 'alumni' && author.yearOfPassing && ` • Class of ${author.yearOfPassing}`}
                {author.company && ` • ${author.company}`}
              </div>
              
              <div className="text-xs text-muted-foreground mt-1">
                {formatTimeAgo(createdAt)}
              </div>
            </div>
          </div>
          
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {content.title && (
          <h3 className="font-semibold text-lg text-primary mb-2 leading-tight">
            {content.title}
          </h3>
        )}
        
        <p className="text-foreground mb-3 leading-relaxed">
          {content.body}
        </p>
        
        {content.image && (
          <div className="mb-3">
            <img 
              src={content.image} 
              alt="Post content"
              className="w-full rounded-lg max-h-80 object-cover"
            />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center">
            {/* Voting */}
            <div className="flex items-center bg-muted rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 ${
                  currentVote === 'up' 
                    ? 'bg-accent text-accent-foreground' 
                    : 'hover:bg-accent/50'
                }`}
                onClick={() => handleVote('up')}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              
              <span className={`px-2 text-sm font-medium min-w-[2rem] text-center ${
                voteCount > 0 
                  ? 'text-accent' 
                  : voteCount < 0 
                    ? 'text-destructive' 
                    : 'text-muted-foreground'
              }`}>
                {voteCount}
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 ${
                  currentVote === 'down' 
                    ? 'bg-destructive text-destructive-foreground' 
                    : 'hover:bg-destructive/10'
                }`}
                onClick={() => handleVote('down')}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="ml-2 flex items-center gap-2 text-muted-foreground hover:text-foreground"
              onClick={() => onComment(id)}
            >
              <MessageCircle className="h-4 w-4" />
              <span>{comments}</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <Share className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};