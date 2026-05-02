const fs = require('fs');
const path = require('path');
const p = 'frontend/src/pages/client';
const files = ['ClientMenuPage.vue', 'ClientInvoicePage.vue', 'ClientInvoicesPage.vue', 'ClientInvoiceDetailPage.vue', 'ClientReservationsPage.vue', 'ClientReservePage.vue'];

files.forEach(f => {
    let content = fs.readFileSync(path.join(p, f), 'utf8');
    content = content.replace(/import \{.*\} from '.*\/useAll'/g, ''); 
    content = content.replace(/useCategory\(\)\.list\(\)/g, 'await categoryService.getAll()');
    content = content.replace(/useFb\(\)\.list\(\{ type: 'All' \}\)/g, 'await menuService.getFBMenu(true)');
    content = content.replace(/useFb\(\)\.list\(\)/g, 'await menuService.getFBMenu(false)');
    
    // Add imports at top
    content = "import { categoryService } from '@/services/category.service';\n" +
              "import { menuService } from '@/services/menu.service';\n" +
              "import { orderService } from '@/services/order.service';\n" +
              "import { reservationService } from '@/services/reservation.service';\n" +
              "import { invoiceService } from '@/services/invoice.service';\n" + content;
    fs.writeFileSync(path.join(p, f), content);
});
