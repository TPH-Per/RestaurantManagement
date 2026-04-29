import apiClient from './apiClient';

export interface MenuItemDTO {
    id?: number | string;
    [key: string]: any;
}

export const menuItemService = {
    getAll: () => apiClient.get<MenuItemDTO[]>('/menuitem'),
    getById: (id: number | string) => apiClient.get<MenuItemDTO>(`/menuitem/${id}`),
    create: (data: MenuItemDTO) => apiClient.post<MenuItemDTO>('/menuitem', data),
    update: (id: number | string, data: MenuItemDTO) => apiClient.put<MenuItemDTO>(`/menuitem/${id}`, data),
    delete: (id: number | string) => apiClient.delete(`/menuitem/${id}`)
};
