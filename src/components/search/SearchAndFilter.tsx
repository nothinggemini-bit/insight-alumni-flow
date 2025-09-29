import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  role: string;
  aura_score: number;
  college: string;
  created_at: string;
}

interface SearchAndFilterProps {
  onFilterChange: (filter: string) => void;
  currentFilter: string;
}

export const SearchAndFilter = ({ onFilterChange, currentFilter }: SearchAndFilterProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const searchProfiles = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .ilike("display_name", `%${searchQuery}%`)
        .order("aura_score", { ascending: false })
        .limit(5);

      if (data && !error) {
        setSearchResults(data);
        setShowResults(true);
      }
    };

    const debounce = setTimeout(searchProfiles, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="flex gap-2 items-center w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, highest Aura, or badges..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchResults.length > 0 && setShowResults(true)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
            onClick={() => {
              setSearchQuery("");
              setSearchResults([]);
              setShowResults(false);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full mt-2 w-full bg-card border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
            {searchResults.map((profile) => (
              <div
                key={profile.id}
                className="p-3 hover:bg-accent cursor-pointer flex items-center gap-3 border-b last:border-b-0"
                onClick={() => {
                  // Navigate to profile or show profile modal
                  setShowResults(false);
                  setSearchQuery("");
                }}
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(profile.display_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{profile.display_name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant={profile.role === 'alumni' ? 'default' : 'secondary'}>
                      {profile.role}
                    </Badge>
                    <span>Aura: {profile.aura_score}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-card">
          <DropdownMenuLabel>Filter Posts</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onFilterChange("recent")}>
            Most Recent Posts
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange("top-rated")}>
            Top-Rated Posts
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange("recent-alumni")}>
            Recently Joined Alumni
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
