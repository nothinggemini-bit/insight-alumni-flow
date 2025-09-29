import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ConnectionRequest {
  id: string;
  requester_id: string;
  requester_profile: {
    display_name: string;
    role: string;
    college: string;
  };
}

interface ConnectionRequestsProps {
  userId: string;
}

export const ConnectionRequests = ({ userId }: ConnectionRequestsProps) => {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, [userId]);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("connections")
      .select(`
        id,
        requester_id,
        requester_profile:profiles!connections_requester_id_fkey(display_name, role, college)
      `)
      .eq("recipient_id", userId)
      .eq("status", "pending");

    if (data && !error) {
      setRequests(data as any);
    }
  };

  const handleResponse = async (requestId: string, action: "accepted" | "declined") => {
    const { error } = await supabase
      .from("connections")
      .update({ status: action })
      .eq("id", requestId);

    if (!error) {
      setRequests(requests.filter(r => r.id !== requestId));
      toast({
        title: action === "accepted" ? "Request accepted" : "Request declined",
        description: `You have ${action} the connection request.`,
      });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (requests.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connection Requests</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {requests.map((request) => (
          <div key={request.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(request.requester_profile.display_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{request.requester_profile.display_name}</p>
              <Badge variant={request.requester_profile.role === 'alumni' ? 'default' : 'secondary'}>
                {request.requester_profile.role}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleResponse(request.id, "accepted")}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleResponse(request.id, "declined")}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
