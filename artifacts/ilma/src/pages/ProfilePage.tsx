import { Link } from 'wouter';
import { useAuth, useUser, useClerk } from '@clerk/react';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { useGetMe, getGetMeQueryKey } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { LogOut, User, Mail, Shield, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ProfilePage() {
  useDocumentMeta('Profile');
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();

  const { data: me, isLoading: meLoading } = useGetMe({
    query: {
      enabled: !!isSignedIn,
      queryKey: getGetMeQueryKey()
    }
  });

  if (!isLoaded || meLoading) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!isSignedIn || !user) {
    return (
      <Layout>
        <div className="container px-4 md:px-6 py-24 flex flex-col items-center justify-center text-center min-h-[70vh]">
          <User className="w-16 h-16 text-muted-foreground mb-6" />
          <h1 className="text-3xl font-bold mb-4">Please Sign In</h1>
          <p className="text-muted-foreground mb-8">You need to be signed in to view your profile.</p>
          <Button asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container px-4 md:px-6 py-12 max-w-3xl">
        <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/5" />
          <div className="px-6 md:px-10 pb-10">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-end -mt-16 mb-8">
              <Avatar className="w-32 h-32 border-4 border-card bg-background shadow-sm">
                <AvatarImage src={user.imageUrl} alt={user.fullName || 'User'} />
                <AvatarFallback className="text-4xl font-bold bg-primary text-primary-foreground">
                  {user.firstName?.charAt(0) || user.emailAddresses[0].emailAddress.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left mb-2 md:mb-0">
                <h1 className="text-3xl font-bold tracking-tight text-foreground" data-testid="text-profile-name">
                  {user.fullName || 'Student'}
                </h1>
                <p className="text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
              
              <Button 
                variant="destructive" 
                onClick={() => signOut({ redirectUrl: import.meta.env.BASE_URL || '/' })}
                className="shrink-0 rounded-full px-6 md:mb-2"
                data-testid="button-sign-out"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="p-6 rounded-2xl bg-accent border border-border shadow-sm">
                <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> Account Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">User ID</p>
                    <p className="font-mono text-xs break-all bg-background p-2.5 rounded-lg mt-1.5 border border-border text-foreground/80">
                      {user.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1.5">Account Role</p>
                    {me?.isAdmin ? (
                      <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground">Administrator</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-background border-border text-foreground/80">Student</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col">
                <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" /> Security
                </h2>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Your account is securely managed via Clerk. You can update your password and other security settings directly.
                </p>
                
                <div className="text-xs text-muted-foreground mt-auto pt-4 border-t border-border/50 flex justify-between items-center">
                  <span>Last signed in:</span>
                  <span className="font-medium text-foreground/70">{new Date(user.lastSignInAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </Layout>
  );
}
