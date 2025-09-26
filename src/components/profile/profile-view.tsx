import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Trophy, Zap, Edit, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'student' | 'alumni';
  branch: string;
  yearOfPassing?: string;
  companyName?: string;
  roleDescription?: string;
  createdAt: string;
  avatar?: string;
  stats?: {
    posts: number;
    votes: number;
    comments: number;
    messages: number;
  };
}

interface ProfileViewProps {
  user: User;
  onUpdateAvatar: (avatar: string) => void;
}

const AVATAR_OPTIONS = [
  "👨‍💼", "👩‍💼", "👨‍🎓", "👩‍🎓", "👨‍💻", "👩‍💻", 
  "👨‍🔬", "👩‍🔬", "👨‍🎨", "👩‍🎨", "🧑‍💼", "🧑‍🎓"
];

export const ProfileView = ({ user, onUpdateAvatar }: ProfileViewProps) => {
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar || "👨‍💼");

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getJoinedTime = () => {
    try {
      return formatDistanceToNow(new Date(user.createdAt), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  const getBadgeInfo = () => {
    const joinDate = new Date(user.createdAt);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff >= 365) return { badge: 'Platinum', color: 'text-purple-600', icon: '🏆' };
    if (daysDiff >= 180) return { badge: 'Gold', color: 'text-yellow-600', icon: '🥇' };
    if (daysDiff >= 30) return { badge: 'Silver', color: 'text-gray-600', icon: '🥈' };
    if (daysDiff >= 7) return { badge: 'Bronze', color: 'text-orange-600', icon: '🥉' };
    return { badge: 'New Member', color: 'text-blue-600', icon: '⭐' };
  };

  const getAuraScore = () => {
    const stats = user.stats || { posts: 0, votes: 0, comments: 0, messages: 0 };
    return stats.posts * 10 + stats.votes * 2 + stats.comments * 5 + stats.messages * 3;
  };

  const badgeInfo = getBadgeInfo();
  const auraScore = getAuraScore();

  return (
    <Card className="card-elevated max-w-2xl mx-auto">
      <CardHeader className="text-center space-y-4 pb-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-accent text-accent-foreground text-2xl">
                {user.avatar ? (
                  <span className="text-4xl">{user.avatar}</span>
                ) : (
                  getInitials(user.fullName)
                )}
              </AvatarFallback>
            </Avatar>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Choose Your Avatar</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-6 gap-3 py-4">
                  {AVATAR_OPTIONS.map((avatar, index) => (
                    <Button
                      key={index}
                      variant={selectedAvatar === avatar ? "default" : "outline"}
                      className="h-12 w-12 text-2xl p-0"
                      onClick={() => {
                        setSelectedAvatar(avatar);
                        onUpdateAvatar(avatar);
                      }}
                    >
                      {avatar}
                    </Button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-primary">{user.fullName}</h2>
            <div className="flex items-center justify-center gap-2">
              <Badge variant={user.role === 'alumni' ? 'default' : 'secondary'}>
                {user.role === 'alumni' ? 'Alumni' : 'Student'}
              </Badge>
              <Badge variant="outline" className={badgeInfo.color}>
                {badgeInfo.icon} {badgeInfo.badge}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Aura Score */}
        <Card className="bg-gradient-to-r from-accent/10 to-primary/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Zap className="h-5 w-5 text-accent" />
                  <span className="text-sm font-medium text-muted-foreground">AURA</span>
                </div>
                <div className="text-3xl font-bold text-primary">{auraScore}</div>
                <div className="text-xs text-muted-foreground">Activity Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-accent" />
                <div>
                  <div className="font-medium">Joined</div>
                  <div className="text-sm text-muted-foreground">{getJoinedTime()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-accent" />
                <div>
                  <div className="font-medium">Branch</div>
                  <div className="text-sm text-muted-foreground">{user.branch}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alumni-specific info */}
        {user.role === 'alumni' && (
          <Card>
            <CardContent className="pt-6 space-y-3">
              {user.yearOfPassing && (
                <div>
                  <span className="font-medium">Class of: </span>
                  <span className="text-muted-foreground">{user.yearOfPassing}</span>
                </div>
              )}
              {user.companyName && (
                <div>
                  <span className="font-medium">Company: </span>
                  <span className="text-muted-foreground">{user.companyName}</span>
                </div>
              )}
              {user.roleDescription && (
                <div>
                  <span className="font-medium">Role: </span>
                  <span className="text-muted-foreground">{user.roleDescription}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Activity Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Activity Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{user.stats?.posts || 0}</div>
                <div className="text-sm text-muted-foreground">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{user.stats?.votes || 0}</div>
                <div className="text-sm text-muted-foreground">Votes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{user.stats?.comments || 0}</div>
                <div className="text-sm text-muted-foreground">Comments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{user.stats?.messages || 0}</div>
                <div className="text-sm text-muted-foreground">Messages</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};