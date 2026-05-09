import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { churchService } from '@/services/church';

export const useHierarchy = () => {
  return useQuery({
    queryKey: ['hierarchy'],
    queryFn: churchService.getHierarchy,
  });
};

export const useHierarchyActions = () => {
  const queryClient = useQueryClient();

  const addSectionMutation = useMutation({
    mutationFn: (name: string) => churchService.addSection(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hierarchy'] }),
  });

  const deleteSectionMutation = useMutation({
    mutationFn: (id: string) => churchService.deleteSection(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hierarchy'] }),
  });

  const addMemberMutation = useMutation({
    mutationFn: (formData: FormData) => churchService.addMember(formData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hierarchy'] }),
  });

  const deleteMemberMutation = useMutation({
    mutationFn: (id: string) => churchService.deleteMember(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hierarchy'] }),
  });

  return {
    addSection: addSectionMutation.mutateAsync,
    deleteSection: deleteSectionMutation.mutateAsync,
    addMember: addMemberMutation.mutateAsync,
    deleteMember: deleteMemberMutation.mutateAsync,
    isProcessing: addSectionMutation.isPending || addMemberMutation.isPending || deleteSectionMutation.isPending || deleteMemberMutation.isPending
  };
};
