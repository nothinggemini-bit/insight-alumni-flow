import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ConnectionButtonProps {
  targetUserId: string;
  currentUserId: string;
}

export const ConnectionButton = ({ targetUserId, currentUserId }: ConnectionButtonProps) => {
  const [connectionStatus, setConnectionStatus] = useState<"none" | "pending" | "accepted">("none");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkConnectionStatus();
  }, [targetUserId, currentUserId]);

  const checkConnectionStatus = async () => {
    const { data } = await supabase
      .from("connections")
      .select("status")
      .or(`and(requester_id.eq.${currentUserId},recipient_id.eq.${targetUserId}),and(requester_id.eq.${targetUserId},recipient_id.eq.${currentUserId})`)
      .single();

    if (data && data.status) {
      setConnectionStatus(data.status as "none" | "pending" | "accepted");
    }
  };

  const handleSendRequest = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("connections")
        .insert({
          requester_id: currentUserId,
          recipient_id: targetUserId,
          status: "pending",
        });

      if (error) throw error;

      setConnectionStatus("pending");
      toast({
        title: "Connection request sent",
        description: "Your request has been sent successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send connection request.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (currentUserId === targetUserId) {
    return null;
  }

  if (connectionStatus === "accepted") {
    return (
      <Button variant="secondary" size="sm" disabled>
        <UserCheck className="h-4 w-4 mr-2" />
        Connected
      </Button>
    );
  }

  if (connectionStatus === "pending") {
    return (
      <Button variant="secondary" size="sm" disabled>
        <Clock className="h-4 w-4 mr-2" />
        Pending
      </Button>
    );
  }

  return (
    <Button onClick={handleSendRequest} disabled={loading} size="sm">
      <UserPlus className="h-4 w-4 mr-2" />
      Connect
    </Button>
  );
};
