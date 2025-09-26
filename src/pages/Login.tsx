import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Chrome } from "lucide-react";

export const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Mock login - check localStorage for existing users
    const users = JSON.parse(localStorage.getItem('alumniConnect_users') || '[]');
    const user = users.find((u: any) => u.email === formData.email);

    if (!user) {
      toast({
        title: "Account Not Found",
        description: "No account found with this email address.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // In a real app, you'd verify the password hash here
    // For now, we'll just log them in

    // Set as current user
    localStorage.setItem('alumniConnect_currentUser', JSON.stringify(user));

    toast({
      title: "Welcome back!",
      description: "You have successfully logged in.",
    });

    // Redirect to dashboard
    navigate('/dashboard');
    setIsLoading(false);
  };

  const handleGoogleLogin = () => {
    toast({
      title: "Google Login",
      description: "Google login integration requires backend setup.",
      variant: "default"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-light to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md card-elevated">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-primary">Welcome Back</CardTitle>
          <CardDescription>Sign in to your Alumni Connect account</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className="input-professional"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-professional pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleGoogleLogin}
          >
            <Chrome className="h-4 w-4 mr-2" />
            Continue with Google
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Button 
              variant="link" 
              className="p-0 h-auto text-primary hover:underline"
              onClick={() => navigate('/signup')}
            >
              Sign up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};