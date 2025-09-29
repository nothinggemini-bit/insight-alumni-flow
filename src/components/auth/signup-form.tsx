import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Users, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const COLLEGES = [
  "IIT Madras", "IIT Delhi", "IIT Bombay", "IIT Kanpur", "IIT Kharagpur",
  "IIT Roorkee", "IIT Hyderabad", "IIT Guwahati", "NIT Tiruchirappalli (Trichy)",
  "IIT (BHU) Varanasi", "BITS Pilani", "IIT Indore", "NIT Rourkela",
  "SRM Institute of Science and Technology, Chennai", "IIT (ISM) Dhanbad",
  "VIT Vellore", "NIT Karnataka, Surathkal", "Jadavpur University",
  "IIT Patna", "Anna University, Chennai", "NIT Calicut",
  "Siksha 'O' Anusandhan, Bhubaneswar", "Jamia Millia Islamia, New Delhi",
  "IIT Gandhinagar", "IIT Mandi", "IIT Jodhpur", "NIT Warangal",
  "Thapar Institute of Engineering and Technology, Patiala",
  "Delhi Technological University (DTU-DCE)",
  "Netaji Subhash Chandra Bose (NSIT - NSUT)", "Chandigarh University",
  "IIT Ropar", "AMU", "KIIT", "Amity Noida", "IIIT Hyderabad", "IIT Bhubaneswar"
];

interface SignupFormData {
  role: 'student' | 'alumni' | '';
  fullName: string;
  email: string;
  password: string;
  college: string;
  branch: string;
  yearOfPassing?: string;
  placementDone?: boolean;
  companyName?: string;
  roleDescription?: string;
}

export const SignupForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    role: '',
    fullName: '',
    email: '',
    password: '',
    college: '',
    branch: '',
  });

  const branches = [
    'Computer Science Engineering',
    'Mechanical Engineering', 
    'Electrical Engineering',
    'Civil Engineering',
    'Electronics & Communication',
    'Information Technology',
    'Chemical Engineering',
    'Biotechnology'
  ];

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.role || !formData.fullName || !formData.email || !formData.password || !formData.college || !formData.branch) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (formData.role === 'alumni' && !formData.yearOfPassing) {
      toast({
        title: "Missing Information", 
        description: "Year of passing is required for alumni.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            display_name: formData.fullName,
            role: formData.role,
            college: formData.college,
            branch: formData.branch,
            year_of_passing: formData.yearOfPassing ? parseInt(formData.yearOfPassing) : null,
            company_name: formData.companyName || null,
            role_description: formData.roleDescription || null,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast({
            title: "Email Already Registered",
            description: "This email is already in use. Please use a different email or try logging in.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Account Created!",
        description: "Welcome to Alumni Connect. Please check your email to verify your account.",
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof SignupFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg card-elevated">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">Create Account</CardTitle>
          <CardDescription>Join the Alumni Connect community</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">I am a:</Label>
              <RadioGroup 
                value={formData.role} 
                onValueChange={(value) => handleInputChange('role', value)}
              >
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent-light transition-colors">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student" className="flex items-center gap-2 cursor-pointer">
                    <GraduationCap className="h-4 w-4" />
                    Student
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent-light transition-colors">
                  <RadioGroupItem value="alumni" id="alumni" />
                  <Label htmlFor="alumni" className="flex items-center gap-2 cursor-pointer">
                    <Users className="h-4 w-4" />
                    Alumni
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Basic Information */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  className="input-professional"
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className="input-professional"
                />
              </div>

              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Create a secure password"
                  className="input-professional"
                />
              </div>

              <div>
                <Label htmlFor="college">College/Institution *</Label>
                <Select value={formData.college} onValueChange={(value) => handleInputChange('college', value)}>
                  <SelectTrigger className="input-professional">
                    <SelectValue placeholder="Select your college" />
                  </SelectTrigger>
                  <SelectContent className="bg-card max-h-60">
                    {COLLEGES.map((college) => (
                      <SelectItem key={college} value={college}>
                        {college}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="branch">Branch *</Label>
                <Select value={formData.branch} onValueChange={(value) => handleInputChange('branch', value)}>
                  <SelectTrigger className="input-professional">
                    <SelectValue placeholder="Select your branch" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    {branches.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Alumni-specific fields */}
            {formData.role === 'alumni' && (
              <div className="space-y-3 p-4 bg-accent-light rounded-lg">
                <h4 className="font-medium text-primary">Alumni Information</h4>
                
                <div>
                  <Label htmlFor="yearOfPassing">Year of Passing *</Label>
                  <Input
                    id="yearOfPassing"
                    type="number"
                    min="1990"
                    max="2024"
                    value={formData.yearOfPassing || ''}
                    onChange={(e) => handleInputChange('yearOfPassing', e.target.value)}
                    placeholder="e.g. 2020"
                    className="input-professional"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Placement Status</Label>
                  <RadioGroup 
                    value={formData.placementDone ? 'yes' : 'no'}
                    onValueChange={(value) => handleInputChange('placementDone', value === 'yes')}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="placed" />
                      <Label htmlFor="placed">Yes, I got placed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="not-placed" />
                      <Label htmlFor="not-placed">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.placementDone && (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName || ''}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        placeholder="e.g. Google, Microsoft"
                        className="input-professional"
                      />
                    </div>
                    <div>
                      <Label htmlFor="roleDescription">Role / Description</Label>
                      <Textarea
                        id="roleDescription"
                        value={formData.roleDescription || ''}
                        onChange={(e) => handleInputChange('roleDescription', e.target.value)}
                        placeholder="Describe your role and responsibilities..."
                        className="input-professional resize-none"
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <Button type="submit" className="w-full btn-primary" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign up with Google
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto"
                onClick={() => navigate("/login")}
              >
                Sign in
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
