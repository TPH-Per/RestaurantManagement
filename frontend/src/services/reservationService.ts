import apiClient from './apiClient';

export interface ReservationDTO {
    id?: number | string;
    [key: string]: any;
}

export const reservationService = {
    getAll: () => apiClient.get<ReservationDTO[]>('/TableReservation'),
    getById: (id: number | string) => apiClient.get<ReservationDTO>(`/TableReservation/${id}`),
    create: (data: ReservationDTO) => apiClient.post<ReservationDTO>('/TableReservation', data),
    update: (id: number | string, data: ReservationDTO) => apiClient.put<ReservationDTO>(`/TableReservation/${id}`, data),
    delete: (id: number | string) => apiClient.delete(`/TableReservation/${id}`)
};
