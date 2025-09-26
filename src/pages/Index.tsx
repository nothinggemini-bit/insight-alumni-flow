// Legacy index page - now redirects to main landing page

import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    // Redirect to the main landing page
    window.location.replace('/');
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-primary">Alumni Connect</h1>
        <p className="text-xl text-muted-foreground">Redirecting to home page...</p>
      </div>
    </div>
  );
};

export default Index;
