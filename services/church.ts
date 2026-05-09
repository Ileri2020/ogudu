import api from './api';

export const churchService = {
  getHierarchy: async () => {
    const response = await api.get('/api/dbhandler?model=churchsections');
    return response.data;
  },

  addSection: async (name: string) => {
    const response = await api.post('/api/dbhandler?model=churchsections', { name });
    return response.data;
  },

  deleteSection: async (id: string) => {
    const response = await api.delete(`/api/dbhandler?model=churchsections&id=${id}`);
    return response.data;
  },

  addMember: async (formData: FormData) => {
    const response = await api.post('/api/dbhandler?model=churchmembers', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteMember: async (id: string) => {
    const response = await api.delete(`/api/dbhandler?model=churchmembers&id=${id}`);
    return response.data;
  }
};
