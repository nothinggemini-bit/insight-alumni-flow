import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Navigation } from "@/components/ui/navigation";
import { PostCard } from "@/components/posts/post-card";
import { Globe, Users, MessageCircle, UserPlus, Plus, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
}

interface Post {
  id: string;
  authorId: string;
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
  branch?: string;
  type: 'global' | 'branch' | 'doubt';
}

export const Dashboard = () => {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ title: '', body: '' });
  const [activeTab, setActiveTab] = useState('global');

  useEffect(() => {
    // Load current user
    const user = localStorage.getItem('alumniConnect_currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }

    // Load all users
    const allUsers = localStorage.getItem('alumniConnect_users');
    if (allUsers) {
      setUsers(JSON.parse(allUsers));
    }

    // Load posts or create sample data
    const savedPosts = localStorage.getItem('alumniConnect_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      initializeSampleData();
    }
  }, []);

  const initializeSampleData = () => {
    const samplePosts: Post[] = [
      {
        id: '1',
        authorId: 'sample-1',
        content: {
          title: 'How to Ace Technical Interviews at Top Tech Companies',
          body: 'Having interviewed at Google, Microsoft, and Amazon, I\'ve learned some key strategies that can make a huge difference. Here are my top 5 tips that helped me land offers...'
        },
        votes: { upvotes: 156, downvotes: 8 },
        comments: 23,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'global'
      },
      {
        id: '2',
        authorId: 'sample-2',
        content: {
          title: 'Remote Work Tips for New Graduates',
          body: 'Starting your career remotely can be challenging. After working remotely for 3 years, here\'s what I wish I knew when I started...'
        },
        votes: { upvotes: 89, downvotes: 3 },
        comments: 15,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'global'
      },
      {
        id: '3',
        authorId: 'sample-3',
        content: {
          body: 'Can anyone explain the difference between supervised and unsupervised learning in simple terms? I\'m preparing for my machine learning exam and getting confused with all the technical jargon.'
        },
        votes: { upvotes: 34, downvotes: 1 },
        comments: 12,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'doubt',
        branch: 'Computer Science Engineering'
      }
    ];

    // Add sample users for these posts
    const sampleUsers: User[] = [
      {
        id: 'sample-1',
        fullName: 'Sarah Johnson',
        email: 'sarah.johnson@gmail.com',
        role: 'alumni',
        branch: 'Computer Science Engineering',
        yearOfPassing: '2019',
        companyName: 'Google',
        roleDescription: 'Senior Software Engineer working on Search Infrastructure',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'sample-2',
        fullName: 'Raj Patel',
        email: 'raj.patel@gmail.com',
        role: 'alumni',
        branch: 'Information Technology',
        yearOfPassing: '2018',
        companyName: 'Microsoft',
        roleDescription: 'Product Manager for Azure Cloud Services',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'sample-3',
        fullName: 'Priya Singh',
        email: 'priya.singh@gmail.com',
        role: 'student',
        branch: 'Computer Science Engineering',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const existingUsers = JSON.parse(localStorage.getItem('alumniConnect_users') || '[]');
    const allUsers = [...existingUsers, ...sampleUsers];
    
    setUsers(allUsers);
    setPosts(samplePosts);
    
    localStorage.setItem('alumniConnect_users', JSON.stringify(allUsers));
    localStorage.setItem('alumniConnect_posts', JSON.stringify(samplePosts));
  };

  const getUserById = (id: string) => {
    return users.find(user => user.id === id);
  };

  const handleCreatePost = (type: 'global' | 'branch' | 'doubt') => {
    if (!currentUser) {
      toast({
        title: "Please Sign In",
        description: "You need to be signed in to create posts.",
        variant: "destructive"
      });
      return;
    }

    if (!newPost.body.trim()) {
      toast({
        title: "Missing Content", 
        description: "Please add some content to your post.",
        variant: "destructive"
      });
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      authorId: currentUser.id,
      content: {
        title: newPost.title.trim() || undefined,
        body: newPost.body.trim()
      },
      votes: { upvotes: 0, downvotes: 0 },
      comments: 0,
      createdAt: new Date().toISOString(),
      type,
      branch: type === 'branch' ? currentUser.branch : undefined
    };

    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('alumniConnect_posts', JSON.stringify(updatedPosts));
    
    setNewPost({ title: '', body: '' });
    
    toast({
      title: "Post Created!",
      description: "Your post has been shared with the community.",
    });
  };

  const handleVote = (postId: string, voteType: 'up' | 'down') => {
    // Mock voting - in real app this would update backend
    console.log(`Voted ${voteType} on post ${postId}`);
  };

  const handleComment = (postId: string) => {
    // Mock comment - in real app this would open comment interface
    console.log(`Opening comments for post ${postId}`);
  };

  const getFilteredPosts = () => {
    switch (activeTab) {
      case 'global':
        return posts.filter(post => post.type === 'global');
      case 'branch':
        return posts.filter(post => 
          post.type === 'branch' || 
          (post.branch === currentUser?.branch)
        );
      case 'doubts':
        return posts.filter(post => post.type === 'doubt');
      default:
        return posts;
    }
  };

  const getSuggestedAlumni = () => {
    return users.filter(user => 
      user.role === 'alumni' && 
      user.id !== currentUser?.id &&
      user.branch === currentUser?.branch
    ).slice(0, 3);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md card-elevated">
          <CardHeader className="text-center">
            <CardTitle>Welcome to Alumni Connect</CardTitle>
            <CardDescription>Please sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Button className="btn-primary" onClick={() => window.location.href = '/signup'}>
              Sign Up
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList className="grid w-full max-w-md grid-cols-4">
                  <TabsTrigger value="global" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Global
                  </TabsTrigger>
                  <TabsTrigger value="branch" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Branch
                  </TabsTrigger>
                  <TabsTrigger value="messages" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Messages
                  </TabsTrigger>
                  <TabsTrigger value="doubts" className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Doubts
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>

              <TabsContent value="global" className="space-y-6">
                {/* Create Post */}
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle className="text-lg">Share with Global Community</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Post title (optional)"
                      value={newPost.title}
                      onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                      className="input-professional"
                    />
                    <Textarea
                      placeholder="What's on your mind? Share your experiences, insights, or ask questions..."
                      value={newPost.body}
                      onChange={(e) => setNewPost(prev => ({ ...prev, body: e.target.value }))}
                      className="input-professional resize-none"
                      rows={3}
                    />
                    <Button 
                      className="btn-primary"
                      onClick={() => handleCreatePost('global')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Share Post
                    </Button>
                  </CardContent>
                </Card>

                {/* Posts Feed */}
                <div className="space-y-4">
                  {getFilteredPosts().map((post) => {
                    const author = getUserById(post.authorId);
                    if (!author) return null;

                    return (
                      <PostCard
                        key={post.id}
                        id={post.id}
                        author={{
                          name: author.fullName,
                          role: author.role,
                          branch: author.branch,
                          yearOfPassing: author.yearOfPassing,
                          company: author.companyName
                        }}
                        content={post.content}
                        votes={post.votes}
                        comments={post.comments}
                        createdAt={post.createdAt}
                        onVote={handleVote}
                        onComment={handleComment}
                      />
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="branch" className="space-y-6">
                {/* Branch-specific content similar to global */}
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle className="text-lg">Share with {currentUser.branch}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Post title (optional)"
                      value={newPost.title}
                      onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                      className="input-professional"
                    />
                    <Textarea
                      placeholder="Share something specific to your branch..."
                      value={newPost.body}
                      onChange={(e) => setNewPost(prev => ({ ...prev, body: e.target.value }))}
                      className="input-professional resize-none"
                      rows={3}
                    />
                    <Button 
                      className="btn-accent"
                      onClick={() => handleCreatePost('branch')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Share to Branch
                    </Button>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {getFilteredPosts().map((post) => {
                    const author = getUserById(post.authorId);
                    if (!author) return null;

                    return (
                      <PostCard
                        key={post.id}
                        id={post.id}
                        author={{
                          name: author.fullName,
                          role: author.role,
                          branch: author.branch,
                          yearOfPassing: author.yearOfPassing,
                          company: author.companyName
                        }}
                        content={post.content}
                        votes={post.votes}
                        comments={post.comments}
                        createdAt={post.createdAt}
                        onVote={handleVote}
                        onComment={handleComment}
                      />
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="messages" className="space-y-6">
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle>Messages</CardTitle>
                    <CardDescription>Connect directly with alumni and students</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No messages yet. Start a conversation!</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="doubts" className="space-y-6">
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle className="text-lg">Ask a Question</CardTitle>
                    <CardDescription>Get help from the community</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Question title"
                      value={newPost.title}
                      onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                      className="input-professional"
                    />
                    <Textarea
                      placeholder="Describe your question or doubt in detail..."
                      value={newPost.body}
                      onChange={(e) => setNewPost(prev => ({ ...prev, body: e.target.value }))}
                      className="input-professional resize-none"
                      rows={4}
                    />
                    <Button 
                      className="btn-accent"
                      onClick={() => handleCreatePost('doubt')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Post Question
                    </Button>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {getFilteredPosts().map((post) => {
                    const author = getUserById(post.authorId);
                    if (!author) return null;

                    return (
                      <PostCard
                        key={post.id}
                        id={post.id}
                        author={{
                          name: author.fullName,
                          role: author.role,
                          branch: author.branch,
                          yearOfPassing: author.yearOfPassing,
                          company: author.companyName
                        }}
                        content={post.content}
                        votes={post.votes}
                        comments={post.comments}
                        createdAt={post.createdAt}
                        onVote={handleVote}
                        onComment={handleComment}
                      />
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Profile Card */}
            <Card className="card-elevated">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-accent text-accent-foreground text-lg font-semibold">
                      {getInitials(currentUser.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-primary">{currentUser.fullName}</h3>
                    <Badge variant={currentUser.role === 'alumni' ? 'default' : 'secondary'}>
                      {currentUser.role === 'alumni' ? 'Alumni' : 'Student'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-2">{currentUser.branch}</p>
                {currentUser.role === 'alumni' && currentUser.companyName && (
                  <p className="text-sm text-muted-foreground">{currentUser.companyName}</p>
                )}
              </CardContent>
            </Card>

            {/* Suggested Alumni */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-lg">Suggested Alumni</CardTitle>
                <CardDescription>From your branch</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {getSuggestedAlumni().map((alumni) => (
                  <div key={alumni.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent-light transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-accent text-accent-foreground text-xs font-medium">
                        {getInitials(alumni.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-primary truncate">{alumni.fullName}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {alumni.companyName || 'Alumni'}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs">
                      Connect
                    </Button>
                  </div>
                ))}
                
                {getSuggestedAlumni().length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No alumni from your branch yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;