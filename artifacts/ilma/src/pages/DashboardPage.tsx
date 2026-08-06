import { useEffect, useMemo } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@clerk/react';
import { Layout } from '@/components/layout/Layout';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import { 
  useListBookmarks, 
  useListProgress, 
  useListRecent, 
  useListNotifications,
  useMarkNotificationRead,
  useGetMe,
  getListBookmarksQueryKey,
  getListProgressQueryKey,
  getListRecentQueryKey,
  getListNotificationsQueryKey,
  getGetMeQueryKey
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import roadmapsData from '@/data/roadmaps.json';
import { Roadmap } from '@/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Clock, CheckCircle2, Bell, BookOpen, ChevronRight, Map, ExternalLink } from 'lucide-react';

export default function DashboardPage() {
  useDocumentMeta('Dashboard');
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const queryClient = useQueryClient();

  const { data: me, isLoading: meLoading } = useGetMe({
    query: {
      enabled: !!isSignedIn,
      queryKey: getGetMeQueryKey()
    }
  });

  const { data: bookmarks, isLoading: bookmarksLoading } = useListBookmarks({
    query: { enabled: !!isSignedIn, queryKey: getListBookmarksQueryKey() }
  });

  const { data: progress, isLoading: progressLoading } = useListProgress({
    query: { enabled: !!isSignedIn, queryKey: getListProgressQueryKey() }
  });

  const { data: recent, isLoading: recentLoading } = useListRecent({
    query: { enabled: !!isSignedIn, queryKey: getListRecentQueryKey() }
  });

  const { data: notifications, isLoading: notificationsLoading } = useListNotifications({
    query: { enabled: !!isSignedIn, queryKey: getListNotificationsQueryKey() }
  });

  const markRead = useMarkNotificationRead({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
      }
    }
  });

  const roadmapStats = useMemo(() => {
    if (!progress) return [];
    
    // Group by roadmapId
    const roadmapGroups: Record<string, number> = {};
    progress.forEach(p => {
      roadmapGroups[p.roadmapId] = (roadmapGroups[p.roadmapId] || 0) + 1;
    });

    return Object.entries(roadmapGroups).map(([id, completedCount]) => {
      const roadmap = (roadmapsData as Roadmap[]).find(r => r.id === id);
      if (!roadmap) return null;
      
      const totalTopics = roadmap.beginner.topics.length + roadmap.intermediate.topics.length + roadmap.advanced.topics.length;
      const percentage = Math.round((completedCount / totalTopics) * 100);
      
      return {
        roadmap,
        percentage,
        completedCount,
        totalTopics
      };
    }).filter(Boolean);
  }, [progress]);

  const unreadNotifications = notifications?.filter(n => !n.read) || [];

  if (!authLoaded) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!isSignedIn) {
    return (
      <Layout>
        <div className="container px-4 md:px-6 py-24 flex flex-col items-center justify-center text-center min-h-[70vh]">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Your Biomedical Journey</h1>
          <p className="text-lg text-muted-foreground max-w-xl mb-8">
            Sign in to track your learning roadmaps, save your favorite careers, and view your personalized dashboard.
          </p>
          <Button asChild size="lg" className="rounded-full px-8" data-testid="button-sign-in">
            <Link href="/sign-in">Sign In to Dashboard</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const isLoading = meLoading || bookmarksLoading || progressLoading || recentLoading || notificationsLoading;

  if (isLoading) {
    return (
      <Layout>
        <div className="container px-4 py-8 max-w-6xl space-y-8 animate-pulse">
          <div className="h-12 bg-muted rounded-lg w-1/3" />
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="h-48 bg-muted rounded-2xl" />
              <div className="h-48 bg-muted rounded-2xl" />
            </div>
            <div className="space-y-6">
              <div className="h-64 bg-muted rounded-2xl" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-card border-b border-border py-8">
        <div className="container px-4 md:px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight" data-testid="text-dashboard-welcome">Welcome back, {me?.name || 'Student'}</h1>
              <p className="text-muted-foreground mt-1">Here is an overview of your progress and saved items.</p>
            </div>
            <Button variant="outline" asChild className="shrink-0 rounded-full">
              <Link href="/profile">View Profile</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container px-4 md:px-6 py-8 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-8">
            
            {/* Active Roadmaps */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Map className="w-5 h-5 text-primary" />
                  Your Roadmaps
                </h2>
                <Link href="/roadmaps" className="text-sm font-medium text-primary hover:underline">
                  Browse all
                </Link>
              </div>
              
              {roadmapStats.length > 0 ? (
                <div className="space-y-4">
                  {roadmapStats.map((stat: any) => (
                    <div key={stat.roadmap.id} className="p-5 rounded-2xl bg-card border border-border flex flex-col sm:flex-row gap-5 items-start sm:items-center shadow-sm">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${stat.roadmap.color}15`, color: stat.roadmap.color }}
                      >
                        <Map className="w-6 h-6" />
                      </div>
                      <div className="flex-1 w-full">
                        <Link href={`/roadmaps/${stat.roadmap.id}`} className="font-bold text-lg hover:text-primary transition-colors block mb-1">
                          {stat.roadmap.title}
                        </Link>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                          <span>{stat.completedCount} / {stat.totalTopics} topics</span>
                          <span className="font-semibold text-foreground">{stat.percentage}%</span>
                        </div>
                        <Progress value={stat.percentage} className="h-2" />
                      </div>
                      <Button variant="ghost" size="icon" asChild className="shrink-0 mt-2 sm:mt-0">
                        <Link href={`/roadmaps/${stat.roadmap.id}`}>
                          <ChevronRight className="w-5 h-5" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-accent rounded-2xl border border-primary/10">
                  <p className="text-muted-foreground mb-4">You haven't started any roadmaps yet.</p>
                  <Button asChild variant="outline">
                    <Link href="/roadmaps">Explore Roadmaps</Link>
                  </Button>
                </div>
              )}
            </section>

            {/* Bookmarks */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-primary" />
                  Saved Items
                </h2>
              </div>
              
              {bookmarks && bookmarks.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {bookmarks.map((bookmark) => (
                    <Link 
                      key={bookmark.id} 
                      href={`/${bookmark.itemType}s/${bookmark.itemId}`}
                      className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors group flex items-start gap-3 shadow-sm"
                    >
                      <div className="p-2 rounded-lg bg-accent text-primary mt-0.5 shrink-0">
                        <Bookmark className="w-4 h-4" />
                      </div>
                      <div>
                        <Badge variant="secondary" className="mb-2 text-[10px] uppercase tracking-wider bg-background border-border">
                          {bookmark.itemType}
                        </Badge>
                        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {bookmark.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-accent rounded-2xl border border-primary/10">
                  <p className="text-muted-foreground mb-4">You have no saved items.</p>
                  <Button asChild variant="outline">
                    <Link href="/careers">Explore Careers</Link>
                  </Button>
                </div>
              )}
            </section>

          </div>

          <div className="space-y-8">
            
            {/* Notifications */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notifications
                {unreadNotifications.length > 0 && (
                  <Badge className="ml-2 bg-red-500 hover:bg-red-600 border-0">{unreadNotifications.length}</Badge>
                )}
              </h2>
              
              <div className="space-y-3">
                {unreadNotifications.length > 0 ? (
                  unreadNotifications.map(notification => (
                    <div key={notification.id} className="p-4 rounded-xl bg-card border border-border shadow-sm relative overflow-hidden group">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{notification.title}</h3>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-muted-foreground hover:text-primary shrink-0 -mt-1 -mr-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => markRead.mutate({ id: notification.id })}
                          title="Mark as read"
                          data-testid={`button-read-notification-${notification.id}`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                        {notification.body}
                      </p>
                      {notification.link && (
                        <a href={notification.link} className="text-xs font-medium text-primary hover:underline flex items-center gap-1 w-fit">
                          View details <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center border border-border border-dashed rounded-xl bg-card">
                    <p className="text-sm text-muted-foreground">You're all caught up!</p>
                  </div>
                )}
              </div>
            </section>

            {/* Recently Viewed */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Recently Viewed
              </h2>
              
              {recent && recent.length > 0 ? (
                <div className="space-y-2">
                  {recent.slice(0, 5).map((item, i) => (
                    <Link 
                      key={`${item.itemType}-${item.itemId}-${i}`} 
                      href={`/${item.itemType}s/${item.itemId}`}
                      className="flex items-center justify-between p-3 rounded-xl bg-card hover:bg-accent transition-colors border border-border hover:border-primary/20 shadow-sm group"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center shrink-0 text-muted-foreground group-hover:text-primary group-hover:border-primary/30 transition-colors">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{item.title}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{item.itemType}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 ml-2 transition-colors" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center border border-border border-dashed rounded-xl bg-card">
                  <p className="text-sm text-muted-foreground">No recent activity.</p>
                </div>
              )}
            </section>
          </div>

        </div>
      </div>
    </Layout>
  );
}
