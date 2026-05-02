const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('steps.txt', 'utf-8');

function extractAndWrite(pattern, filepath) {
    const match = content.match(pattern);
    if (match && match[1]) {
        const fullPath = path.join('RestaurantMS/src', filepath) // wait, frontend is in root/frontend
        const realPath = path.join('frontend', filepath.replace('frontend/', ''));
        fs.mkdirSync(path.dirname(realPath), { recursive: true });
        fs.writeFileSync(realPath, match[1].trim());
        console.log('Wrote ' + realPath);
    }
}

// Write enums
extractAndWrite(/frontend\/src\/domain\/enums\/index\.ts\n(.*?)(?=\n\/\/ frontend|\n===)/s, 'src/domain/enums/index.ts');

// Write entities
extractAndWrite(/frontend\/src\/domain\/entities\/fb\.entity\.ts\n(.*?)(?=\n\/\/ frontend|\n===)/s, 'src/domain/entities/fb.entity.ts');
extractAndWrite(/frontend\/src\/domain\/entities\/order\.entity\.ts\n(.*?)(?=\n\/\/ frontend|\n===)/s, 'src/domain/entities/order.entity.ts');
extractAndWrite(/frontend\/src\/domain\/entities\/order-item\.entity\.ts\n(.*?)(?=\n\/\/ frontend|\n===)/s, 'src/domain/entities/order-item.entity.ts');
extractAndWrite(/frontend\/src\/domain\/entities\/invoice\.entity\.ts\n(.*?)(?=\n\/\/ frontend|\n===)/s, 'src/domain/entities/invoice.entity.ts');
extractAndWrite(/frontend\/src\/domain\/entities\/table-reservation\.entity\.ts\n(.*?)(?=\n\/\/ frontend|\n===)/s, 'src/domain/entities/table-reservation.entity.ts');

// Write rules
extractAndWrite(/frontend\/src\/domain\/rules\/fb\.rules\.ts.*?import(.*?)(?=\n\/\/ frontend|\n===)/s, 'src/domain/rules/fb.rules.ts');
extractAndWrite(/frontend\/src\/domain\/rules\/order\.rules\.ts\n(.*?)(?=\n\/\/ frontend|\n===)/s, 'src/domain/rules/order.rules.ts');
extractAndWrite(/frontend\/src\/domain\/rules\/invoice\.rules\.ts\n(.*?)(?=\n\/\/ frontend|\n===)/s, 'src/domain/rules/invoice.rules.ts');
extractAndWrite(/frontend\/src\/domain\/rules\/reservation\.rules\.ts\n(.*?)(?=\n\/\/ frontend|\n===)/s, 'src/domain/rules/reservation.rules.ts');

// Write services
extractAndWrite(/frontend\/src\/services\/api\.client\.ts\n(.*?)(?=\n\/\/ frontend|\n===)/s, 'src/services/api.client.ts');
extractAndWrite(/frontend\/src\/services\/auth\.service\.ts\n(.*?)(?=\n\/\/ frontend|\n===)/s, 'src/services/auth.service.ts');
extractAndWrite(/frontend\/src\/services\/order\.service\.ts\n(.*?)(?=\n\/\/ frontend|\n===)/s, 'src/services/order.service.ts');

// Write stores
extractAndWrite(/frontend\/src\/stores\/auth\.store\.ts\n(.*?)(?=\n\/\/ frontend|\n===)/s, 'src/stores/auth.store.ts');
extractAndWrite(/frontend\/src\/stores\/notification\.store\.ts\n(.*?)(?=\n\/\/ frontend|\n===)/s, 'src/stores/notification.store.ts');

// Write composables
extractAndWrite(/frontend\/src\/composables\/useOrder\.ts\n(.*?)(?=\n\/\/ frontend|\n===)/s, 'src/composables/useOrder.ts');

// Write router guards
extractAndWrite(/frontend\/src\/router\/guards\.ts\n(.*?)(?=\n\/\/ frontend|\n===)/s, 'src/router/guards.ts');
extractAndWrite(/frontend\/src\/pages\/client\/ClientOrderPage\.vue\n.*?AFTER.*?:\n(.*?)`\n\n===/s, 'src/pages/client/ClientOrderPage.vue');
extractAndWrite(/frontend\/src\/pages\/client\/ClientLoginPage\.vue\n.*?AFTER:\n(.*?)(?=\n\/\/ frontend|\n===)/s, 'src/pages/client/ClientLoginPage.vue');
extractAndWrite(/frontend\/src\/components\/features\/ReviewForm\.vue\n(.*?)(?=\n\/\/ frontend|\n===)/s, 'src/components/features/ReviewForm.vue');

// Special fix for fb.rules.ts since the match might miss "import"
const fbRulesMatch = content.match(/frontend\/src\/domain\/rules\/fb\.rules\.ts.*?(\nimport.*?(?=\n\/\/ frontend|\n===))/s);
if (fbRulesMatch && fbRulesMatch[1]) {
    fs.writeFileSync('frontend/src/domain/rules/fb.rules.ts', fbRulesMatch[1].trim());
}

// Special fix for ClientOrderPage.vue
const orderPageMatch = content.match(/<script setup lang="ts">.*?<\/script>/s);
if (orderPageMatch) {
    fs.writeFileSync('frontend/src/pages/client/ClientOrderPage.vue', orderPageMatch[0].trim());
}
