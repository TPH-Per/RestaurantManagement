import { ref } from 'vue';
import { supplierService, SupplierDTO } from '../services/supplierService';

export function useSupplier() {
  const items = ref<SupplierDTO[]>([]);
  const item = ref<SupplierDTO | null>(null);

  const getAll = async () => {
    const res = await supplierService.getAll();
    items.value = res.data;
    return res.data;
  };

  const getById = async (id: number | string) => {
    const res = await supplierService.getById(id);
    item.value = res.data;
    return res.data;
  };

  const create = async (data: SupplierDTO) => {
    const res = await supplierService.create(data);
    return res.data;
  };

  const update = async (id: number | string, data: SupplierDTO) => {
    const res = await supplierService.update(id, data);
    return res.data;
  };

  const remove = async (id: number | string) => {
    await supplierService.delete(id);
  };

  // Aliases for refactored mock calls
  const list = getAll;
  const get = getById;
  const my = async (id: number | string) => getAll(); // Mock implementation
  const setStatus = async (id: number | string, status: string) => update(id, { status } as any);
  const pay = async (id: number | string, payload: any) => update(id, payload);
  const getByInvoice = async (id: number | string) => getById(id); // Mock implementation
  const register = create;
  const login = async (payload: any) => ({ token: 'mock-token', staff: { id: 1 } });
  const clientLogin = async (payload: any) => ({ token: 'mock-token', customer: { id: 1 } });
  const summary = async () => ({});

  return { items, item, getAll, getById, create, update, remove, list, get, my, setStatus, pay, getByInvoice, register, login, clientLogin, summary };
}
