import apiClient from './apiClient';

export interface InventoryItemDTO {
    id?: number | string;
    [key: string]: any;
}

export const inventoryItemService = {
    getAll: () => apiClient.get<InventoryItemDTO[]>('/inventoryitem'),
    getById: (id: number | string) => apiClient.get<InventoryItemDTO>(`/inventoryitem/${id}`),
    create: (data: InventoryItemDTO) => apiClient.post<InventoryItemDTO>('/inventoryitem', data),
    update: (id: number | string, data: InventoryItemDTO) => apiClient.put<InventoryItemDTO>(`/inventoryitem/${id}`, data),
    delete: (id: number | string) => apiClient.delete(`/inventoryitem/${id}`)
};
