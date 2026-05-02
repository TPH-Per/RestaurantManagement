const jwt = require('jsonwebtoken');

const SECRET = "SuperSecretKeyForJWTAuthThatIsVeryLongAndSecure12345!";
const BASE_URL = "http://localhost:5084/api";

function generateToken(role) {
    const claims = {
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": "1",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": `test@${role.toLowerCase()}.com`,
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": role,
        "FullName": `Test ${role}`
    };
    return jwt.sign(claims, SECRET, { expiresIn: '1h', issuer: 'RestaurantSystem', audience: 'RestaurantFrontend' });
}

const managerToken = generateToken('MANAGER');
const adminToken = generateToken('ADMIN');
const customerToken = generateToken('CUSTOMER');
const waiterToken = generateToken('WAITER'); 

async function test(name, method, endpoint, token, body, expectedStatus) {
    try {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            method: method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: body ? JSON.stringify(body) : undefined
        });
        const text = await res.text();
        if (res.status === expectedStatus) {
            console.log(`✅ [${name}] Passed. (Status ${res.status})`);
        } else {
            console.error(`❌ [${name}] Failed. Expected ${expectedStatus}, got ${res.status}. Response: ${text}`);
        }
    } catch (e) {
        console.error(`❌ [${name}] Error: ${e.message}`);
    }
}

async function run() {
    console.log("Starting Smoke Tests...");

    // Wait for server to start if running via a script
    await new Promise(r => setTimeout(r, 2000));

    // 1. Auth flow verification
    await test("MANAGER access receipts (200 expected)", 'POST', '/receipts', managerToken, { manufacturerId: 1, items: [] }, 200);
    await test("ADMIN access receipts (403 expected)", 'POST', '/receipts', adminToken, { manufacturerId: 1, items: [] }, 403);
    await test("CUSTOMER access receipts (403 expected)", 'POST', '/receipts', customerToken, { manufacturerId: 1, items: [] }, 403);
    await test("WAITER access orders (403 expected)", 'DELETE', '/orders/1', waiterToken, undefined, 403);
    
    // 2. The 5 critical business rule endpoints
    await test("Add a FRESH_RAW item to an order (expect 422)", 'POST', '/orders/1/items', managerToken, { fbId: 1, quantity: 1 }, 422);
    await test("Deduct REGULAR stock below zero (expect 422)", 'POST', '/orders/1/items', managerToken, { fbId: 2, quantity: 10 }, 422);
    await test("Import an INHOUSE item via receipt (expect 422)", 'POST', '/receipts', managerToken, { manufacturerId: 1, items: [{ fbId: 3, quantity: 10, unitPrice: 5 }] }, 422);
    await test("Create an invoice on a non-COMPLETED order (expect 422)", 'POST', '/invoices', managerToken, { orderId: 3 }, 422);
    await test("Submit a review on an UNPAID invoice (expect 422)", 'POST', '/reviews', customerToken, { invoiceId: 1, stars: 5, content: "Nice" }, 422);

    console.log("Finished.");
}

run();
