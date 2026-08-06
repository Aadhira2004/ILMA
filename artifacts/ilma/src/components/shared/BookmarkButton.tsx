import { useAuth } from '@clerk/react';
import { useLocation } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useListBookmarks, useToggleBookmark, getListBookmarksQueryKey } from '@workspace/api-client-react';

interface BookmarkButtonProps {
  itemType: 'career' | 'domain' | 'exam' | 'roadmap' | 'resource' | 'news' | 'company' | string;
  itemId: string;
  title: string;
}

export function BookmarkButton({ itemType, itemId, title }: BookmarkButtonProps) {
  const { isSignedIn } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const { data: bookmarks } = useListBookmarks({
    query: {
      enabled: !!isSignedIn,
      queryKey: getListBookmarksQueryKey(),
    }
  });

  const toggleBookmark = useToggleBookmark({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListBookmarksQueryKey() });
      }
    }
  });

  const isBookmarked = bookmarks?.some(b => b.itemType === itemType && b.itemId === itemId) ?? false;

  const handleClick = () => {
    if (!isSignedIn) {
      setLocation('/sign-in');
      return;
    }
    toggleBookmark.mutate({
      data: {
        itemType: itemType as any,
        itemId,
        title
      }
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleClick}
      disabled={toggleBookmark.isPending}
      className={isBookmarked ? "text-primary border-primary bg-primary/10 hover:bg-primary/20 hover:text-primary shrink-0" : "text-muted-foreground shrink-0"}
      data-testid={`button-bookmark-${itemType}-${itemId}`}
      title={isBookmarked ? "Remove Bookmark" : "Bookmark this"}
    >
      {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
    </Button>
  );
}
