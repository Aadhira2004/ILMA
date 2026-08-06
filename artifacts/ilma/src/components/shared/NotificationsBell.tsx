import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/react';
import { Bell } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import {
  useListNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  getListNotificationsQueryKey,
} from '@workspace/api-client-react';

export function NotificationsBell() {
  const { isSignedIn } = useUser();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [open, setOpen] = useState(false);

  const { data: notifications, isLoading } = useListNotifications({
    query: {
      enabled: !!isSignedIn,
      queryKey: getListNotificationsQueryKey(),
    },
  });

  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  if (!isSignedIn) return null;

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  const handleMarkAllRead = () => {
    markAllRead.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getListNotificationsQueryKey(),
        });
      },
    });
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markRead.mutate(
        { id: notification.id },
        {
          onSuccess: () => {
            queryClient.setQueryData(
              getListNotificationsQueryKey(),
              (old: any) => {
                if (!old) return old;
                return old.map((n: any) =>
                  n.id === notification.id ? { ...n, read: true } : n
                );
              }
            );
          },
        }
      );
    }

    if (notification.link) {
      setOpen(false);
      setLocation(notification.link);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          data-testid="button-notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground"></span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="font-semibold text-sm">Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              className="h-auto p-0 text-xs text-muted-foreground"
              data-testid="button-mark-all-read"
            >
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-80">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading...
            </div>
          ) : !notifications?.length ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    'flex flex-col gap-1 p-4 border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer',
                    !n.read && 'bg-muted/20'
                  )}
                  onClick={() => handleNotificationClick(n)}
                  data-testid={`notification-item-${n.id}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={cn(
                        'text-sm font-medium',
                        !n.read && 'text-foreground'
                      )}
                    >
                      {n.title}
                    </span>
                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {n.body}
                  </p>
                  <span className="text-[10px] text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(n.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
