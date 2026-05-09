import api from './api';

export const userService = {
  getProfile: async (id: string) => {
    const response = await api.get(`/api/dbhandler?model=users&id=${id}`);
    return response.data;
  },

  updateProfile: async (id: string, data: any) => {
    const response = await api.put(`/api/dbhandler?model=users&id=${id}`, data);
    return response.data;
  }
};
