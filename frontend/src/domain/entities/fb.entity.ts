import type { FBType } from '../enums'
export interface FB {
  fbId: number; name: string; price: number; type: FBType;
  categoryId: number; manufacturerId?: number; isVisible: boolean;
  unit?: string; description?: string;
}