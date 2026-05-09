import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentService } from '@/services/comments';

export const useComments = (postId: string) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => commentService.getByPostId(postId),
    enabled: !!postId,
  });
};

export const useCommentActions = (postId: string) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: { userId: string; username: string; contentId: string; comment: string }) => 
      commentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  return {
    addComment: createMutation.mutateAsync,
    isSubmitting: createMutation.isPending,
  };
};
