const jwt = require('jsonwebtoken');

const SECRET = "SuperSecretKeyForJWTAuthThatIsVeryLongAndSecure12345!";
const BASE_URL = "http://localhost:5084/api";

function generateToken(role, id = "1") {
    const claims = {
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": id,
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": `test@${role.toLowerCase()}.com`,
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": role,
        "FullName": `Test ${role}`
    };
    return jwt.sign(claims, SECRET, { expiresIn: '1h', issuer: 'RestaurantSystem', audience: 'RestaurantFrontend' });
}

const tokens = {
    MANAGER: generateToken('MANAGER'),
    ADMIN: generateToken('ADMIN'),
    CUSTOMER: generateToken('CUSTOMER', "1"),
    ANON: null
};

async function runTest(name, method, endpoint, role, body) {
    await runTestAndReturn(name, method, endpoint, role, body);
}

// Helper: returns parsed response data
async function runTestAndReturn(name, method, endpoint, role, body) {
    const url = `${BASE_URL}${endpoint}`;
    const token = tokens[role];
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    try {
        const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : null });
        const data = await res.json().catch(() => null);
        const ok = res.ok;
        console.log(`${ok ? '✅' : '❌'} [${name}] ${res.status} ${ok ? '' : JSON.stringify(data)}`);
        return { success: ok, data };
    } catch (err) {
        console.log(`❌ [${name}] ERROR: ${err.message}`);
        return { success: false };
    }
}

async function start() {
    console.log("=== INTEGRATION TEST — BUSINESS FLOW ===");
    await new Promise(r => setTimeout(r, 2000));

    // ── Auth ────────────────────────────────────────────────────────
    await runTest("1. Staff Login",     "POST", "/auth/staff/login",
        "ANON", { email: "manager@test.com", password: "password123" });

    await runTest("2. Customer Login",  "POST", "/auth/customer/login",
        "ANON", { phone: "0901234567", password: "password123" });

    // ── Read endpoints ──────────────────────────────────────────────
    await runTest("3. Get Menu",         "GET",  "/fb",                  "ANON");
    await runTest("4. Get Categories",   "GET",  "/categories",          "ANON");
    await runTest("5. Get Tables",       "GET",  "/tables",              "ADMIN");
    await runTest("6. Get Manufacturers","GET",  "/manufacturers",       "ADMIN");
    await runTest("7. Warehouse Report", "GET",  "/warehouse/report",    "ADMIN");
    await runTest("8. Get Staff",        "GET",  "/staff",               "MANAGER");
    await runTest("9. Get Discount Codes","GET", "/discount-codes",      "ADMIN");
    await runTest("10. Validate Code",   "GET",  "/discount-codes/validate/PROMO10", "ADMIN");

    // ── Order → Invoice → Review flow (requires seeded data) ───────────
    // Step A: create order for seeded table_id=1
    const orderRes = await runTestAndReturn("11. Create Order", "POST", "/orders",
        "ADMIN", { tableId: 1 });

    if (orderRes?.success && orderRes.data?.orderId) {
        const orderId = orderRes.data.orderId;

        // Step B: add item (seeded fb_id=1)
        await runTest("12. Add Order Item", "POST", `/orders/${orderId}/items`,
            "ADMIN", { fbId: 1, quantity: 1 });

        // Step B2: start serving the order
        await runTest("12b. Start Serving", "PUT", `/orders/${orderId}/start-serving`, "ADMIN");

        // Step C: complete the order
        await runTest("13. Complete Order", "PUT", `/orders/${orderId}/complete`, "ADMIN");

        // Step D: create invoice
        const invRes = await runTestAndReturn("14. Create Invoice", "POST", "/invoices",
            "ADMIN", { orderId });

        if (invRes?.success && invRes.data?.invoiceId) {
            const invoiceId = invRes.data.invoiceId;

            // Step E: pay invoice
            await runTest("15. Pay Invoice", "POST", `/invoices/${invoiceId}/pay`,
                "ADMIN", { method: "CASH", cashierId: 1 });

            // Step F: review (CUSTOMER token — seeded customer must exist)
            await runTest("16. Submit Review", "POST", "/reviews",
                "CUSTOMER", { invoiceId, stars: 5, content: "Excellent service!" });
        }
    }

    // ── Reservation flow ───────────────────────────────────────────────
    await runTest("17. Create Reservation", "POST", "/reservations",
        "CUSTOMER", { tableId: 1, reservedAt: new Date(Date.now() + 86400000), guestCount: 2 });

    // ── Manager only ───────────────────────────────────────────────────
    await runTest("18. Create Receipt", "POST", "/receipts",
        "MANAGER", { manufacturerId: 1, items: [{ fbId: 1, quantity: 10, unitPrice: 5000 }] });

    console.log("\n=== TESTS FINISHED ===");
}

start();
