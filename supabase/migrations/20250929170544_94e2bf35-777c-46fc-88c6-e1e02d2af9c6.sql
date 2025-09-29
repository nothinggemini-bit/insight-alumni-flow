-- Create connections table for user connection requests
CREATE TABLE public.connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(requester_id, recipient_id)
);

-- Create enhanced comments table with threading support
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL,
  author_id UUID NOT NULL,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create posts table 
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  post_type TEXT NOT NULL DEFAULT 'general' CHECK (post_type IN ('general', 'doubt', 'placement', 'internship')),
  upvotes INTEGER NOT NULL DEFAULT 0,
  downvotes INTEGER NOT NULL DEFAULT 0,
  comment_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create votes table to track user votes
CREATE TABLE public.votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  post_id UUID NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Create profiles table with enhanced fields
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'alumni')),
  college TEXT NOT NULL,
  branch TEXT,
  year_of_passing INTEGER,
  company_name TEXT,
  role_description TEXT,
  avatar TEXT DEFAULT 'default',
  aura_score INTEGER NOT NULL DEFAULT 0,
  username_last_changed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for connections
CREATE POLICY "Users can view their own connections" ON public.connections
FOR SELECT USING (requester_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can create connection requests" ON public.connections
FOR INSERT WITH CHECK (requester_id = auth.uid());

CREATE POLICY "Users can update their received connection requests" ON public.connections
FOR UPDATE USING (recipient_id = auth.uid());

-- Create RLS policies for comments
CREATE POLICY "Comments are viewable by everyone" ON public.comments
FOR SELECT USING (true);

CREATE POLICY "Users can create comments" ON public.comments
FOR INSERT WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can update their own comments" ON public.comments
FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "Users can delete their own comments" ON public.comments
FOR DELETE USING (author_id = auth.uid());

-- Create RLS policies for posts
CREATE POLICY "Posts are viewable by everyone" ON public.posts
FOR SELECT USING (true);

CREATE POLICY "Users can create posts" ON public.posts
FOR INSERT WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can update their own posts" ON public.posts
FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "Users can delete their own posts" ON public.posts
FOR DELETE USING (author_id = auth.uid());

-- Create RLS policies for votes
CREATE POLICY "Votes are viewable by everyone" ON public.votes
FOR SELECT USING (true);

CREATE POLICY "Users can manage their own votes" ON public.votes
FOR ALL USING (user_id = auth.uid());

-- Create RLS policies for profiles
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_connections_updated_at
BEFORE UPDATE ON public.connections
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
BEFORE UPDATE ON public.comments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, email, role, college, branch, year_of_passing, company_name, role_description)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'student'),
    COALESCE(NEW.raw_user_meta_data ->> 'college', ''),
    NEW.raw_user_meta_data ->> 'branch',
    (NEW.raw_user_meta_data ->> 'year_of_passing')::INTEGER,
    NEW.raw_user_meta_data ->> 'company_name',
    NEW.raw_user_meta_data ->> 'role_description'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;