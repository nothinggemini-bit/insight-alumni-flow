import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Navigation } from "@/components/ui/navigation";
import { Users, MessageCircle, TrendingUp, GraduationCap, Building2, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Landing = () => {
  const navigate = useNavigate();

  // Mock data for featured content
  const featuredAlumni = [
    {
      id: '1',
      name: 'Sarah Johnson',
      company: 'Google',
      role: 'Software Engineer',
      branch: 'Computer Science',
      year: '2019',
      rating: 4.9,
      location: 'Mountain View, CA'
    },
    {
      id: '2', 
      name: 'Raj Patel',
      company: 'Microsoft',
      role: 'Product Manager',
      branch: 'Electronics & Communication',
      year: '2018',
      rating: 4.8,
      location: 'Seattle, WA'
    },
    {
      id: '3',
      name: 'Priya Sharma',
      company: 'Tesla',
      role: 'Mechanical Engineer',
      branch: 'Mechanical Engineering',
      year: '2020',
      rating: 4.9,
      location: 'Austin, TX'
    }
  ];

  const topPosts = [
    {
      id: '1',
      title: 'Tips for Cracking Technical Interviews at FAANG',
      author: 'Sarah Johnson',
      branch: 'Computer Science',
      upvotes: 156,
      comments: 23,
      timeAgo: '2 days ago'
    },
    {
      id: '2',
      title: 'How I Transitioned from ECE to Product Management',
      author: 'Raj Patel',
      branch: 'Electronics & Communication', 
      upvotes: 134,
      comments: 18,
      timeAgo: '3 days ago'
    },
    {
      id: '3',
      title: 'Remote Work Culture at Tesla - My Experience',
      author: 'Priya Sharma',
      branch: 'Mechanical Engineering',
      upvotes: 98,
      comments: 15,
      timeAgo: '1 week ago'
    }
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-hover to-accent text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Connect. Learn. Grow.
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            Bridge the gap between students and alumni. Share experiences, get guidance, and build your professional network.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold px-8"
              onClick={() => navigate('/signup')}
            >
              <Users className="h-5 w-5 mr-2" />
              Join Alumni Connect
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary font-semibold px-8"
              onClick={() => navigate('/login')}
            >
              Sign in with Google
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Network Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2">Network</h2>
              <p className="text-muted-foreground">
                Connect with top-rated alumni for guidance and mentorship
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              View All Alumni
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredAlumni.map((alumni) => (
              <Card key={alumni.id} className="card-elevated hover:shadow-lg transition-all cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-accent text-accent-foreground font-semibold">
                        {getInitials(alumni.name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary">{alumni.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {alumni.role} at {alumni.company}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {alumni.location}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm font-medium text-accent">
                        ⭐ {alumni.rating}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {alumni.branch}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Class of {alumni.year}
                    </span>
                  </div>
                  
                  <Button 
                    className="w-full mt-3 btn-accent" 
                    size="sm"
                    onClick={() => navigate('/dashboard')}
                  >
                    Connect
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Learn Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2">Learn</h2>
              <p className="text-muted-foreground">
                Discover insights and experiences from the community
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              View All Posts
            </Button>
          </div>

          <div className="space-y-4">
            {topPosts.map((post) => (
              <Card key={post.id} className="card-elevated hover:shadow-lg transition-all cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary mb-2 hover:text-accent transition-colors">
                        {post.title}
                      </h3>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" />
                          {post.author}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {post.branch}
                        </Badge>
                        <span>{post.timeAgo}</span>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-accent" />
                          {post.upvotes} upvotes
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          {post.comments} comments
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-accent-light to-secondary rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Ready to Join the Network?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with thousands of alumni, share your journey, and help shape the future of your college community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="btn-primary"
              onClick={() => navigate('/signup')}
            >
              Get Started Today
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Explore as Guest
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Landing;