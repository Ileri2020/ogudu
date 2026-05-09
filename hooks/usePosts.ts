import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '@/services/posts';

export const usePosts = (filters?: any) => {
  return useInfiniteQuery({
    queryKey: ['posts', filters],
    queryFn: ({ pageParam = 1 }) => postService.getAll({ page: pageParam, limit: 10, ...filters }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length + 1 : undefined;
    },
  });
};

export const usePostActions = () => {
  const queryClient = useQueryClient();

  const verifyMutation = useMutation({
    mutationFn: (id: string) => postService.verify(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => postService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  });

  const likeMutation = useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) => postService.like(postId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.postId] });
    },
  });

  return {
    verify: verifyMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    like: likeMutation.mutateAsync,
    isVerifying: verifyMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
