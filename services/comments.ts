import api from './api';

export const commentService = {
  getByPostId: async (postId: string) => {
    const response = await api.get(`/api/dbhandler?model=comments&id=${postId}`);
    return response.data;
  },

  create: async (data: { userId: string; username: string; contentId: string; comment: string }) => {
    const response = await api.post('/api/dbhandler?model=comments', data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/api/dbhandler?model=comments&id=${id}`);
    return response.data;
  }
};
