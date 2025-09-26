import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Users, GraduationCap } from "lucide-react";

interface SignupFormData {
  role: 'student' | 'alumni' | '';
  fullName: string;
  email: string;
  branch: string;
  yearOfPassing?: string;
  placementDone?: boolean;
  companyName?: string;
  roleDescription?: string;
}

export const SignupForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<SignupFormData>({
    role: '',
    fullName: '',
    email: '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.role || !formData.fullName || !formData.email || !formData.branch) {
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

    // Save to localStorage (mock backend)
    const users = JSON.parse(localStorage.getItem('alumniConnect_users') || '[]');
    const newUser = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('alumniConnect_users', JSON.stringify(users));
    localStorage.setItem('alumniConnect_currentUser', JSON.stringify(newUser));

    toast({
      title: "Account Created!",
      description: "Welcome to Alumni Connect. Redirecting to dashboard...",
    });

    // Redirect to dashboard after 1.5 seconds
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1500);
  };

  const handleInputChange = (field: keyof SignupFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md card-elevated">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">Join Alumni Connect</CardTitle>
          <CardDescription>Connect with your college network</CardDescription>
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
                <Label htmlFor="email">Gmail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="input-professional"
                />
              </div>

              <div>
                <Label htmlFor="branch">Branch *</Label>
                <Select value={formData.branch} onValueChange={(value) => handleInputChange('branch', value)}>
                  <SelectTrigger className="input-professional">
                    <SelectValue placeholder="Select your branch" />
                  </SelectTrigger>
                  <SelectContent>
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

            <Button type="submit" className="w-full btn-primary">
              Create Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};