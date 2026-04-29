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

const servicesDir = path.join(__dirname, 'src', 'services');

if (!fs.existsSync(servicesDir)) {
  fs.mkdirSync(servicesDir, { recursive: true });
}

services.forEach(service => {
  const className = service.charAt(0).toUpperCase() + service.slice(1);
  const endpointName = service === 'auth' ? 'user' : service.toLowerCase();
  
  const content = `import apiClient from './apiClient';

export interface ${className}DTO {
    id?: number | string;
    [key: string]: any;
}

export const ${service}Service = {
    getAll: () => apiClient.get<${className}DTO[]>('/${endpointName}'),
    getById: (id: number | string) => apiClient.get<${className}DTO>(\`/${endpointName}/\${id}\`),
    create: (data: ${className}DTO) => apiClient.post<${className}DTO>('/${endpointName}', data),
    update: (id: number | string, data: ${className}DTO) => apiClient.put<${className}DTO>(\`/${endpointName}/\${id}\`, data),
    delete: (id: number | string) => apiClient.delete(\`/${endpointName}/\${id}\`)
};
`;

  fs.writeFileSync(path.join(servicesDir, `${service}Service.ts`), content);
});

console.log('Services generated.');

// Update .vue files
function updateVueFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      updateVueFiles(filePath);
    } else if (file.endsWith('.vue')) {
      let content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('<script setup>')) {
        content = content.replace('<script setup>', '<script setup lang="ts">');
        fs.writeFileSync(filePath, content);
      }
    }
  }
}

updateVueFiles(path.join(__dirname, 'src'));
console.log('Vue files updated.');
