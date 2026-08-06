import { useState } from 'react';
import { useLocation } from 'wouter';
import { useUser } from '@clerk/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  Activity,
  BookOpen,
  Mail,
  Send,
  ShieldAlert,
  Trash,
  Users,
  Check,
  Edit,
} from 'lucide-react';

import { Layout } from '@/components/layout/Layout';
import {
  useGetMe,
  getGetMeQueryKey,
  useGetAdminStats,
  useListResources,
  useCreateResource,
  useUpdateResource,
  useDeleteResource,
  useListNews,
  useCreateNews,
  useUpdateNews,
  useDeleteNews,
  useCreateNotification,
  useListSubscribers,
  useListMessages,
  useMarkMessageRead,
  getListResourcesQueryKey,
  getListNewsQueryKey,
  getListSubscribersQueryKey,
  getListMessagesQueryKey,
  getGetAdminStatsQueryKey,
} from '@workspace/api-client-react';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

function OverviewTab() {
  const { data: stats, isLoading } = useGetAdminStats({
    query: { queryKey: getGetAdminStatsQueryKey() },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-users">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-page-views">{stats.pageViews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bookmarks</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-bookmarks">{stats.totalBookmarks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-subscribers">{stats.subscriberCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-unread-messages">{stats.unreadMessages}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Popular Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Item ID</TableHead>
                <TableHead className="text-right">Views</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.popularItems.map((item, idx) => (
                <TableRow key={`${item.itemType}-${item.itemId}-${idx}`}>
                  <TableCell className="capitalize">{item.itemType}</TableCell>
                  <TableCell className="font-mono">{item.itemId}</TableCell>
                  <TableCell className="text-right">{item.views}</TableCell>
                </TableRow>
              ))}
              {stats.popularItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

const resourceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  category: z.enum(['book', 'paper', 'dataset', 'software', 'youtube', 'website', 'mooc', 'tool']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'all']).optional(),
  topic: z.string().min(1, 'Topic is required'),
  url: z.string().url('Must be a valid URL'),
  featured: z.boolean().optional(),
});

function ResourcesTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingResource, setEditingResource] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: resources, isLoading } = useListResources(undefined, {
    query: { queryKey: getListResourcesQueryKey() },
  });

  const createResource = useCreateResource();
  const updateResource = useUpdateResource();
  const deleteResource = useDeleteResource();

  const form = useForm<z.infer<typeof resourceSchema>>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'website',
      difficulty: 'all',
      topic: '',
      url: '',
      featured: false,
    },
  });

  const onSubmit = (data: z.infer<typeof resourceSchema>) => {
    if (editingResource) {
      updateResource.mutate(
        { id: editingResource.id, data },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListResourcesQueryKey() });
            toast({ title: 'Resource updated successfully' });
            setIsDialogOpen(false);
          },
        }
      );
    } else {
      createResource.mutate(
        { data },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListResourcesQueryKey() });
            toast({ title: 'Resource created successfully' });
            setIsDialogOpen(false);
          },
        }
      );
    }
  };

  const handleEdit = (r: any) => {
    setEditingResource(r);
    form.reset({
      title: r.title,
      description: r.description || '',
      category: r.category as any,
      difficulty: r.difficulty as any,
      topic: r.topic,
      url: r.url,
      featured: r.featured || false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      deleteResource.mutate(
        { id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListResourcesQueryKey() });
            toast({ title: 'Resource deleted' });
          },
        }
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Manage Resources</h3>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (!open) setEditingResource(null);
            setIsDialogOpen(open);
          }}
        >
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingResource(null);
                form.reset({ title: '', description: '', category: 'website', difficulty: 'all', topic: '', url: '', featured: false });
              }}
              data-testid="button-add-resource"
            >
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingResource ? 'Edit Resource' : 'Add Resource'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-resource-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-resource-url" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-resource-category">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="book">Book</SelectItem>
                            <SelectItem value="paper">Paper</SelectItem>
                            <SelectItem value="dataset">Dataset</SelectItem>
                            <SelectItem value="software">Software</SelectItem>
                            <SelectItem value="youtube">YouTube</SelectItem>
                            <SelectItem value="website">Website</SelectItem>
                            <SelectItem value="mooc">MOOC</SelectItem>
                            <SelectItem value="tool">Tool</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-resource-difficulty">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                            <SelectItem value="all">All</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-resource-topic" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} data-testid="input-resource-description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Featured Resource</FormLabel>
                        <CardDescription>Highlight this resource prominently.</CardDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-resource-featured" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={createResource.isPending || updateResource.isPending} data-testid="button-submit-resource">
                  {editingResource ? 'Update' : 'Create'}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</TableCell>
              </TableRow>
            ) : resources?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No resources found.</TableCell>
              </TableRow>
            ) : (
              resources?.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.title}</TableCell>
                  <TableCell className="capitalize">{r.category}</TableCell>
                  <TableCell>{r.topic}</TableCell>
                  <TableCell>{r.featured ? <Badge variant="secondary">Featured</Badge> : null}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(r)} data-testid={`button-edit-resource-${r.id}`}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(r.id)} data-testid={`button-delete-resource-${r.id}`}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

const newsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  summary: z.string().min(1, 'Summary is required'),
  category: z.enum(['ai-healthcare', 'medical-devices', 'research', 'fda', 'who', 'healthtech']),
  sourceUrl: z.string().url().optional().or(z.literal('')),
  sourceName: z.string().optional().or(z.literal('')),
  trending: z.boolean().optional(),
});

function NewsTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingNews, setEditingNews] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: newsItems, isLoading } = useListNews(undefined, {
    query: { queryKey: getListNewsQueryKey() },
  });

  const createNews = useCreateNews();
  const updateNews = useUpdateNews();
  const deleteNews = useDeleteNews();

  const form = useForm<z.infer<typeof newsSchema>>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: '',
      summary: '',
      category: 'healthtech',
      sourceUrl: '',
      sourceName: '',
      trending: false,
    },
  });

  const onSubmit = (data: z.infer<typeof newsSchema>) => {
    // API typings fix: optional fields should be sent as undefined if empty
    const payload = {
      ...data,
      sourceUrl: data.sourceUrl || undefined,
      sourceName: data.sourceName || undefined,
    };

    if (editingNews) {
      updateNews.mutate(
        { id: editingNews.id, data: payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListNewsQueryKey() });
            toast({ title: 'News updated successfully' });
            setIsDialogOpen(false);
          },
        }
      );
    } else {
      createNews.mutate(
        { data: payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListNewsQueryKey() });
            toast({ title: 'News created successfully' });
            setIsDialogOpen(false);
          },
        }
      );
    }
  };

  const handleEdit = (n: any) => {
    setEditingNews(n);
    form.reset({
      title: n.title,
      summary: n.summary,
      category: n.category as any,
      sourceUrl: n.sourceUrl || '',
      sourceName: n.sourceName || '',
      trending: n.trending || false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this news item?')) {
      deleteNews.mutate(
        { id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListNewsQueryKey() });
            toast({ title: 'News deleted' });
          },
        }
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Manage News</h3>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (!open) setEditingNews(null);
            setIsDialogOpen(open);
          }}
        >
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingNews(null);
                form.reset({ title: '', summary: '', category: 'healthtech', sourceUrl: '', sourceName: '', trending: false });
              }}
              data-testid="button-add-news"
            >
              Add News
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingNews ? 'Edit News' : 'Add News'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-news-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-news-category">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ai-healthcare">AI Healthcare</SelectItem>
                          <SelectItem value="medical-devices">Medical Devices</SelectItem>
                          <SelectItem value="research">Research</SelectItem>
                          <SelectItem value="fda">FDA</SelectItem>
                          <SelectItem value="who">WHO</SelectItem>
                          <SelectItem value="healthtech">Healthtech</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Summary</FormLabel>
                      <FormControl>
                        <Textarea {...field} data-testid="input-news-summary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sourceName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source Name</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-news-source-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sourceUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source URL</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-news-source-url" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="trending"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Trending News</FormLabel>
                        <CardDescription>Feature this news in the trending section.</CardDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-news-trending" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={createNews.isPending || updateNews.isPending} data-testid="button-submit-news">
                  {editingNews ? 'Update' : 'Create'}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Trending</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</TableCell>
              </TableRow>
            ) : newsItems?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No news found.</TableCell>
              </TableRow>
            ) : (
              newsItems?.map((n) => (
                <TableRow key={n.id}>
                  <TableCell className="font-medium max-w-xs truncate">{n.title}</TableCell>
                  <TableCell className="capitalize">{n.category.replace('-', ' ')}</TableCell>
                  <TableCell>{format(new Date(n.publishedAt), 'MMM d, yyyy')}</TableCell>
                  <TableCell>{n.trending ? <Badge variant="secondary">Trending</Badge> : null}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(n)} data-testid={`button-edit-news-${n.id}`}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(n.id)} data-testid={`button-delete-news-${n.id}`}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

const notificationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Body is required'),
  category: z.enum(['roadmap', 'job', 'exam', 'news', 'general']),
  link: z.string().optional().or(z.literal('')),
});

function NotificationsTab() {
  const { toast } = useToast();
  const createNotification = useCreateNotification();

  const form = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: '',
      body: '',
      category: 'general',
      link: '',
    },
  });

  const onSubmit = (data: z.infer<typeof notificationSchema>) => {
    createNotification.mutate(
      { data: { ...data, link: data.link || undefined } },
      {
        onSuccess: () => {
          toast({ title: 'Notification sent to all users' });
          form.reset();
        },
      }
    );
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Send Global Notification</CardTitle>
        <CardDescription>Push a notification to all registered users. Use this sparingly.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="input-notification-title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Body</FormLabel>
                  <FormControl>
                    <Textarea {...field} data-testid="input-notification-body" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-notification-category">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="news">News</SelectItem>
                        <SelectItem value="roadmap">Roadmap</SelectItem>
                        <SelectItem value="job">Job</SelectItem>
                        <SelectItem value="exam">Exam</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>In-App Link (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="/news or /exams/gate" {...field} data-testid="input-notification-link" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" disabled={createNotification.isPending} data-testid="button-send-notification">
              <Send className="mr-2 h-4 w-4" /> Send Notification
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function SubscribersTab() {
  const { data: subscribers, isLoading } = useListSubscribers({
    query: { queryKey: getListSubscribersQueryKey() },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Newsletter Subscribers</h3>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Subscribed At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">Loading...</TableCell>
              </TableRow>
            ) : subscribers?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">No subscribers yet.</TableCell>
              </TableRow>
            ) : (
              subscribers?.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.email}</TableCell>
                  <TableCell>{format(new Date(sub.createdAt), 'MMM d, yyyy HH:mm')}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function MessagesTab() {
  const queryClient = useQueryClient();
  const { data: messages, isLoading } = useListMessages({
    query: { queryKey: getListMessagesQueryKey() },
  });
  const markRead = useMarkMessageRead();

  const handleMarkRead = (id: number) => {
    markRead.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Contact Messages</h3>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : messages?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border rounded-md">No messages yet.</div>
        ) : (
          messages?.map((msg) => (
            <Card key={msg.id} className={msg.read ? 'opacity-70 bg-muted/20' : 'border-primary/20 bg-primary/5'}>
              <CardHeader className="py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{msg.subject}</CardTitle>
                    <CardDescription>From: {msg.name} ({msg.email})</CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-muted-foreground">{format(new Date(msg.createdAt), 'MMM d, yyyy')}</span>
                    {!msg.read && (
                      <Button size="sm" variant="outline" onClick={() => handleMarkRead(msg.id)} disabled={markRead.isPending} data-testid={`button-mark-message-read-${msg.id}`}>
                        <Check className="mr-2 h-3 w-3" /> Mark Read
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="whitespace-pre-wrap">{msg.message}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const { isSignedIn, isLoaded } = useUser();

  const { data: me, isLoading: isLoadingMe } = useGetMe({
    query: {
      enabled: isLoaded && isSignedIn,
      queryKey: getGetMeQueryKey(),
    },
  });

  if (!isLoaded || isLoadingMe) {
    return (
      <Layout>
        <div className="container mx-auto py-12 flex justify-center">
          <Skeleton className="h-[400px] w-full max-w-4xl rounded-xl" />
        </div>
      </Layout>
    );
  }

  if (!isSignedIn) {
    setLocation('/sign-in');
    return null;
  }

  if (!me?.isAdmin) {
    return (
      <Layout>
        <div className="container mx-auto py-24 flex flex-col items-center justify-center text-center">
          <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
          <h1 className="text-3xl font-bold tracking-tight mb-2">Access Denied</h1>
          <p className="text-muted-foreground max-w-md">
            You do not have permission to view the admin console. If you believe this is an error, please contact support.
          </p>
          <Button variant="outline" className="mt-6" onClick={() => setLocation('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-12 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Admin Console</h1>
          <p className="text-muted-foreground">Manage platform content, users, and settings.</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-8 w-full justify-start overflow-x-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>
          <TabsContent value="resources">
            <ResourcesTab />
          </TabsContent>
          <TabsContent value="news">
            <NewsTab />
          </TabsContent>
          <TabsContent value="notifications">
            <NotificationsTab />
          </TabsContent>
          <TabsContent value="subscribers">
            <SubscribersTab />
          </TabsContent>
          <TabsContent value="messages">
            <MessagesTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
