import apiClient from './apiClient';

export interface CategoryDTO {
    id?: number | string;
    [key: string]: any;
}

export const categoryService = {
    getAll: () => apiClient.get<CategoryDTO[]>('/category'),
    getById: (id: number | string) => apiClient.get<CategoryDTO>(`/category/${id}`),
    create: (data: CategoryDTO) => apiClient.post<CategoryDTO>('/category', data),
    update: (id: number | string, data: CategoryDTO) => apiClient.put<CategoryDTO>(`/category/${id}`, data),
    delete: (id: number | string) => apiClient.delete(`/category/${id}`)
};
