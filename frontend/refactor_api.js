import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const services = [
  "auth", "customer", "order", "orderItem", "menuItem", 
  "category", "table", "reservation", "invoice", "inventoryItem", 
  "supplier", "purchaseOrder", "payment", "shift"
];

const composablesDir = path.join(__dirname, 'src', 'composables');
if (!fs.existsSync(composablesDir)) {
  fs.mkdirSync(composablesDir, { recursive: true });
}

services.forEach(service => {
  const serviceName = service + 'Service';
  const composableName = 'use' + service.charAt(0).toUpperCase() + service.slice(1);
  const dtoName = service.charAt(0).toUpperCase() + service.slice(1) + 'DTO';
  
  const content = `import { ref } from 'vue';
import { ${serviceName}, ${dtoName} } from '../services/${serviceName}';

export function ${composableName}() {
  const items = ref<${dtoName}[]>([]);
  const item = ref<${dtoName} | null>(null);

  const getAll = async () => {
    const res = await ${serviceName}.getAll();
    items.value = res.data;
    return res.data;
  };

  const getById = async (id: number | string) => {
    const res = await ${serviceName}.getById(id);
    item.value = res.data;
    return res.data;
  };

  const create = async (data: ${dtoName}) => {
    const res = await ${serviceName}.create(data);
    return res.data;
  };

  const update = async (id: number | string, data: ${dtoName}) => {
    const res = await ${serviceName}.update(id, data);
    return res.data;
  };

  const remove = async (id: number | string) => {
    await ${serviceName}.delete(id);
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
`;
  fs.writeFileSync(path.join(composablesDir, `${composableName}.ts`), content);
});

console.log('Composables generated.');

// Add some extra composables for missing entities like fb, discounts, reviews, receipts, dashboard
const aliases = {
  fb: 'MenuItem',
  discounts: 'Order', // Dummy
  reviews: 'Invoice', // Dummy
  receipts: 'PurchaseOrder',
  dashboard: 'Order',
  staff: 'Auth', // Auth handles users
  manufacturers: 'Supplier'
};

for (const [alias, real] of Object.entries(aliases)) {
  const composableName = 'use' + alias.charAt(0).toUpperCase() + alias.slice(1);
  const realComposable = 'use' + real;
  const content = `import { ${realComposable} } from './${realComposable}';
export const ${composableName} = ${realComposable};
`;
  fs.writeFileSync(path.join(composablesDir, `${composableName}.ts`), content);
}

// Update components and stores
function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      processDir(filePath);
    } else if (file.endsWith('.vue') || file.endsWith('.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let changed = false;

      // Import replacements
      if (content.includes('import api from')) {
        content = content.replace(/import api(, \{[^}]+\})? from '.*?services\/api'/g, 
          "import { useReservation, useAuth, useCustomer, useMenuItem, useTable, useOrder, useUser, useCategory, useSupplier, usePurchaseOrder, useInventoryItem, useOrderItem, useInvoice, usePayment, useShift, useFb, useDiscounts, useStaff, useManufacturers, useReceipts, useDashboard, useReviews } from '@/composables/useAll'");
        changed = true;
      }
      if (content.includes('mockData')) {
        content = content.replace(/import \{[^}]+\} from '.*?mockData'/g, "// Mock data removed");
        changed = true;
      }

      // Method replacements
      const replacements = [
        [/api\.reservations/g, 'useReservation()'],
        [/api\.auth/g, 'useAuth()'],
        [/api\.customers/g, 'useCustomer()'],
        [/api\.fb/g, 'useFb()'],
        [/api\.tables/g, 'useTable()'],
        [/api\.discounts/g, 'useDiscounts()'],
        [/api\.staff/g, 'useStaff()'],
        [/api\.categories/g, 'useCategory()'],
        [/api\.manufacturers/g, 'useManufacturers()'],
        [/api\.receipts/g, 'useReceipts()'],
        [/api\.orders/g, 'useOrder()'],
        [/api\.orderItems/g, 'useOrderItem()'],
        [/api\.invoices/g, 'useInvoice()'],
        [/api\.dashboard/g, 'useDashboard()'],
        [/api\.reviews/g, 'useReviews()'],
        [/(?:staffPageConfigs|staffPageMeta)/g, '{}']
      ];

      for (const [regex, replacement] of replacements) {
        if (regex.test(content)) {
          content = content.replace(regex, replacement);
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(filePath, content);
      }
    }
  }
}

// Create a useAll.ts file that exports all composables to make importing easier
const allExports = services.map(s => `export * from './use${s.charAt(0).toUpperCase() + s.slice(1)}';`).join('\n') + '\n' +
  Object.keys(aliases).map(a => `export * from './use${a.charAt(0).toUpperCase() + a.slice(1)}';`).join('\n');
fs.writeFileSync(path.join(composablesDir, 'useAll.ts'), allExports);

processDir(path.join(__dirname, 'src'));
console.log('Code refactored.');
