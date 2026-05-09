import api from './api';
import { PostData } from '@/components/shared/Post';

export const postService = {
  getAll: async (params: any) => {
    const response = await api.get('/api/dbhandler', { params: { model: 'posts', ...params } });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/api/dbhandler?model=posts&id=${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/api/dbhandler?model=posts', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/api/dbhandler?model=posts&id=${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/api/dbhandler?model=posts&id=${id}`);
    return response.data;
  },

  verify: async (id: string) => {
    const response = await api.put(`/api/dbhandler?model=posts&id=${id}`, { isVerified: true });
    return response.data;
  },

  like: async (postId: string, userId: string) => {
    const response = await api.post('/api/dbhandler?model=likes', { contentId: postId, userId });
    return response.data;
  },

  unlike: async (likeId: string) => {
    const response = await api.delete(`/api/dbhandler?model=likes&id=${likeId}`);
    return response.data;
  }
};
