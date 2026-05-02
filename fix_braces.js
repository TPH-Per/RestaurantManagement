const fs = require('fs');
const path = require('path');

const filesToFix = [
    'FBRepository.cs', 'OrderItemRepository.cs', 'ReceiptDetailRepository.cs',
    'RestaurantOrderRepository.cs', 'TableReservationRepository.cs', 'WarehouseRepository.cs'
];

const reposDir = 'RestaurantMS/src/RestaurantMS.Infrastructure/Repositories';

filesToFix.forEach(repoFile => {
    const repoPath = path.join(reposDir, repoFile);
    let rContent = fs.readFileSync(repoPath, 'utf-8');
    
    // Only add a single closing brace at the end of the file
    rContent += '\n}\n';
    
    fs.writeFileSync(repoPath, rContent);
});
