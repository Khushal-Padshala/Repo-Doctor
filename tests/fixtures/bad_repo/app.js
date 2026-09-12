"""
app.js — Intentionally bloated JavaScript module for fixture testing.

This file is kept over 600 lines to trigger the LOC code-smell check.
It also contains an exposed Stripe live secret key and multiple TODO/FIXME
comments to exercise all three code-quality penalty categories.
"""

// TODO: Refactor this entire module — it's way too large
// FIXME: Split into smaller controllers
// TODO: Add input validation everywhere

const express = require('express');
const router = express.Router();

// DANGER: Leaked secret key
const api_key = "4f8b2c1d9e0a3f7b5c8d1e2a3b4c5d6e7f8a9b0c";

// TODO: Move to environment variable
const DB_HOST = "localhost";
const DB_PORT = 5432;

// ── User Routes ──────────────────────────────────────────────────────────────

router.get('/users', async (req, res) => {
  // TODO: Add pagination
  // FIXME: This query is N+1
  try {
    const users = await db.query('SELECT * FROM users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/users', async (req, res) => {
  // TODO: Add rate limiting
  const { name, email, password } = req.body;
  // FIXME: Password is not hashed!
  try {
    const user = await db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, password]
    );
    res.status(201).json(user.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/users/:id', async (req, res) => {
  // TODO: Validate that user owns the resource
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const user = await db.query(
      'UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *',
      [name, email, id]
    );
    res.json(user.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  // FIXME: Soft-delete instead of hard-delete
  const { id } = req.params;
  try {
    await db.query('DELETE FROM users WHERE id=$1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── Product Routes ───────────────────────────────────────────────────────────

router.get('/products', async (req, res) => {
  // TODO: Add search/filter/sort
  try {
    const products = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(products.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await db.query('SELECT * FROM products WHERE id=$1', [id]);
    if (!product.rows.length) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/products', async (req, res) => {
  // TODO: Validate image upload
  const { name, price, description, stock } = req.body;
  try {
    const product = await db.query(
      'INSERT INTO products (name, price, description, stock) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, price, description, stock]
    );
    res.status(201).json(product.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── Order Routes ─────────────────────────────────────────────────────────────

router.get('/orders', async (req, res) => {
  // FIXME: Only return orders for authenticated user
  try {
    const orders = await db.query(
      'SELECT o.*, u.name as user_name FROM orders o JOIN users u ON o.user_id = u.id'
    );
    res.json(orders.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/orders', async (req, res) => {
  const { user_id, items } = req.body;
  // TODO: Wrap in transaction
  // TODO: Check stock before creating order
  try {
    const order = await db.query(
      'INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING *',
      [user_id, 'pending']
    );
    for (const item of items) {
      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1,$2,$3,$4)',
        [order.rows[0].id, item.product_id, item.quantity, item.price]
      );
    }
    res.status(201).json(order.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  // FIXME: Validate allowed status transitions
  const allowed = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  try {
    const order = await db.query(
      'UPDATE orders SET status=$1 WHERE id=$2 RETURNING *',
      [status, id]
    );
    res.json(order.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── Payment Routes ────────────────────────────────────────────────────────────

router.post('/payments/charge', async (req, res) => {
  // TODO: Switch to Stripe webhooks instead of direct charging
  const stripe = require('stripe')(STRIPE_SECRET);
  const { amount, currency, source, description } = req.body;
  try {
    const charge = await stripe.charges.create({
      amount,
      currency: currency || 'usd',
      source,
      description,
    });
    res.json(charge);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/payments/refund', async (req, res) => {
  // FIXME: Record refund in database
  const stripe = require('stripe')(STRIPE_SECRET);
  const { charge_id, amount } = req.body;
  try {
    const refund = await stripe.refunds.create({ charge: charge_id, amount });
    res.json(refund);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── Category Routes ───────────────────────────────────────────────────────────

router.get('/categories', async (req, res) => {
  try {
    const categories = await db.query('SELECT * FROM categories');
    res.json(categories.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/categories', async (req, res) => {
  const { name, slug } = req.body;
  // TODO: Validate slug uniqueness
  try {
    const cat = await db.query(
      'INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING *',
      [name, slug]
    );
    res.status(201).json(cat.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── Review Routes ─────────────────────────────────────────────────────────────

router.get('/products/:id/reviews', async (req, res) => {
  const { id } = req.params;
  try {
    const reviews = await db.query(
      'SELECT r.*, u.name FROM reviews r JOIN users u ON r.user_id = u.id WHERE product_id=$1',
      [id]
    );
    res.json(reviews.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/products/:id/reviews', async (req, res) => {
  // TODO: Ensure user purchased product before reviewing
  const { id } = req.params;
  const { user_id, rating, comment } = req.body;
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be 1-5' });
  }
  try {
    const review = await db.query(
      'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES ($1,$2,$3,$4) RETURNING *',
      [id, user_id, rating, comment]
    );
    res.status(201).json(review.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── Search Route ──────────────────────────────────────────────────────────────

router.get('/search', async (req, res) => {
  // FIXME: Use full-text search (e.g., Elasticsearch) instead of ILIKE
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Missing query param' });
  try {
    const results = await db.query(
      `SELECT 'product' as type, id, name FROM products WHERE name ILIKE $1
       UNION ALL
       SELECT 'category' as type, id, name FROM categories WHERE name ILIKE $1`,
      [`%${q}%`]
    );
    res.json(results.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Analytics ─────────────────────────────────────────────────────────────────

router.get('/analytics/revenue', async (req, res) => {
  // TODO: Add date range filtering
  try {
    const result = await db.query(
      `SELECT DATE_TRUNC('month', created_at) as month, SUM(total) as revenue
       FROM orders WHERE status='delivered'
       GROUP BY 1 ORDER BY 1`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/analytics/top-products', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT p.name, SUM(oi.quantity) as sold
       FROM order_items oi JOIN products p ON oi.product_id = p.id
       GROUP BY p.id ORDER BY sold DESC LIMIT 10`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Wishlist Routes ───────────────────────────────────────────────────────────

router.get('/users/:id/wishlist', async (req, res) => {
  const { id } = req.params;
  try {
    const wishlist = await db.query(
      'SELECT p.* FROM wishlist_items wi JOIN products p ON wi.product_id=p.id WHERE wi.user_id=$1',
      [id]
    );
    res.json(wishlist.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/users/:id/wishlist', async (req, res) => {
  const { id } = req.params;
  const { product_id } = req.body;
  try {
    await db.query(
      'INSERT INTO wishlist_items (user_id, product_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
      [id, product_id]
    );
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/users/:id/wishlist/:product_id', async (req, res) => {
  const { id, product_id } = req.params;
  try {
    await db.query('DELETE FROM wishlist_items WHERE user_id=$1 AND product_id=$2', [id, product_id]);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── Address Routes ────────────────────────────────────────────────────────────

router.get('/users/:id/addresses', async (req, res) => {
  const { id } = req.params;
  try {
    const addresses = await db.query('SELECT * FROM addresses WHERE user_id=$1', [id]);
    res.json(addresses.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/users/:id/addresses', async (req, res) => {
  const { id } = req.params;
  const { street, city, state, zip, country } = req.body;
  // TODO: Validate postal code format
  try {
    const addr = await db.query(
      'INSERT INTO addresses (user_id, street, city, state, zip, country) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [id, street, city, state, zip, country]
    );
    res.status(201).json(addr.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── Notification Routes ───────────────────────────────────────────────────────

router.get('/users/:id/notifications', async (req, res) => {
  // TODO: Implement WebSocket for real-time notifications
  const { id } = req.params;
  try {
    const notifs = await db.query(
      'SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC',
      [id]
    );
    res.json(notifs.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/users/:id/notifications/read-all', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('UPDATE notifications SET read=true WHERE user_id=$1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── Coupon Routes ─────────────────────────────────────────────────────────────

router.post('/coupons/validate', async (req, res) => {
  // FIXME: Check coupon expiry date
  const { code } = req.body;
  try {
    const coupon = await db.query('SELECT * FROM coupons WHERE code=$1 AND active=true', [code]);
    if (!coupon.rows.length) {
      return res.status(404).json({ error: 'Coupon not found or inactive' });
    }
    res.json(coupon.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/coupons/apply', async (req, res) => {
  const { order_id, code } = req.body;
  // TODO: Prevent duplicate coupon application
  try {
    const coupon = await db.query('SELECT * FROM coupons WHERE code=$1', [code]);
    if (!coupon.rows.length) {
      return res.status(404).json({ error: 'Coupon not found' });
    }
    const discount = coupon.rows[0].discount_percent;
    await db.query(
      'UPDATE orders SET discount=$1 WHERE id=$2',
      [discount, order_id]
    );
    res.json({ discount_applied: discount });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── Shipping Routes ───────────────────────────────────────────────────────────

router.post('/shipping/estimate', async (req, res) => {
  // TODO: Integrate with a real shipping API (FedEx, UPS, etc.)
  const { origin_zip, dest_zip, weight_oz } = req.body;
  const base_rate = 5.99;
  const per_oz = 0.15;
  const estimate = base_rate + (weight_oz * per_oz);
  res.json({ estimate: estimate.toFixed(2), currency: 'USD' });
});

router.post('/shipping/track', async (req, res) => {
  // FIXME: Actually call the carrier API
  const { tracking_number } = req.body;
  res.json({
    tracking_number,
    status: 'in_transit',
    eta: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  });
});

// ── Admin Routes ──────────────────────────────────────────────────────────────

router.get('/admin/stats', async (req, res) => {
  // TODO: Add authentication middleware
  try {
    const [users, products, orders] = await Promise.all([
      db.query('SELECT COUNT(*) FROM users'),
      db.query('SELECT COUNT(*) FROM products'),
      db.query('SELECT COUNT(*) FROM orders'),
    ]);
    res.json({
      total_users: parseInt(users.rows[0].count),
      total_products: parseInt(products.rows[0].count),
      total_orders: parseInt(orders.rows[0].count),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/admin/purge-abandoned-carts', async (req, res) => {
  // FIXME: This is dangerous — add confirmation flow
  try {
    const result = await db.query(
      `DELETE FROM carts WHERE updated_at < NOW() - INTERVAL '30 days'`
    );
    res.json({ deleted: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Export ────────────────────────────────────────────────────────────────────

module.exports = router;

// ── Padding to push file over 600 lines ──────────────────────────────────────
// The following stubs represent planned but unimplemented features.
// TODO: Implement inventory management module
// TODO: Implement supplier management module
// TODO: Implement loyalty points system
// TODO: Implement A/B testing hooks
// TODO: Add rate-limiting middleware
// TODO: Add request logging middleware
// TODO: Add response caching layer
// FIXME: All database connections need connection pooling review
// FIXME: Error messages leak internal DB schema details
// HACK: Some queries use raw interpolation — switch to parameterized queries
// XXX: The auth middleware is commented out on several routes — re-enable before prod

function stubInventoryCheck() { /* TODO */ }
function stubSupplierSync() { /* TODO */ }
function stubLoyaltyPoints() { /* TODO */ }
function stubABTest() { /* TODO */ }
function stubCachingLayer() { /* TODO */ }
function stubRequestLogger() { /* TODO */ }
function stubRateLimiter() { /* TODO */ }
function stubMetrics() { /* TODO */ }
function stubHealthCheck() { /* TODO */ }
function stubFeatureFlag() { /* TODO */ }
function stubUserSegmentation() { /* TODO */ }
function stubEmailCampaign() { /* TODO */ }
function stubSMSNotification() { /* TODO */ }
function stubPushNotification() { /* TODO */ }
function stubWebhookDispatch() { /* TODO */ }
function stubThirdPartySync() { /* TODO */ }
function stubDataExport() { /* TODO */ }
function stubAuditLog() { /* TODO */ }
function stubComplianceReport() { /* TODO */ }
function stubGDPRDelete() { /* TODO */ }
function stubDataRetention() { /* TODO */ }
function stubBackupRestore() { /* TODO */ }
function stubDisasterRecovery() { /* TODO */ }
function stubLoadBalancer() { /* TODO */ }
function stubCircuitBreaker() { /* TODO */ }
function stubRetryPolicy() { /* TODO */ }
function stubTimeoutHandler() { /* TODO */ }
function stubBulkheadPattern() { /* TODO */ }
function stubSagaOrchestrator() { /* TODO */ }
function stubEventSourcing() { /* TODO */ }
function stubCQRS() { /* TODO */ }
function stubGraphQLResolver() { /* TODO */ }
function stubRESTAdapter() { /* TODO */ }
function stubgRPCBridge() { /* TODO */ }
function stubMessageQueue() { /* TODO */ }
function stubDeadLetterQueue() { /* TODO */ }
function stubEventBus() { /* TODO */ }
function stubTaskScheduler() { /* TODO */ }
function stubCronJobRunner() { /* TODO */ }
function stubWorkerPool() { /* TODO */ }
function stubConnectionPool() { /* TODO */ }
function stubCacheInvalidation() { /* TODO */ }
function stubSessionStore() { /* TODO */ }
function stubTokenBlacklist() { /* TODO */ }
function stubCSRFProtection() { /* TODO */ }
function stubXSSFilter() { /* TODO */ }
function stubSQLInjectionGuard() { /* TODO */ }
function stubInputSanitizer() { /* TODO */ }
function stubOutputEncoder() { /* TODO */ }
function stubContentSecurityPolicy() { /* TODO */ }
function stubCORSHandler() { /* TODO */ }
function stubHTTPSRedirect() { /* TODO */ }
function stubHSTSHeader() { /* TODO */ }
function stubRateLimitStore() { /* TODO */ }
function stubIPWhitelist() { /* TODO */ }
function stubGeoBlocking() { /* TODO */ }
function stubFraudDetection() { /* TODO */ }
function stubAnomalyDetector() { /* TODO */ }
function stubPasswordPolicy() { /* TODO */ }
function stub2FAEnrollment() { /* TODO */ }
function stubSSOIntegration() { /* TODO */ }
function stubOAuthProvider() { /* TODO */ }
function stubSAMLProvider() { /* TODO */ }
function stubLDAPSync() { /* TODO */ }
function stubRBACEngine() { /* TODO */ }
function stubPermissionMatrix() { /* TODO */ }
function stubTenantIsolation() { /* TODO */ }
function stubDataMasking() { /* TODO */ }
function stubPIIScanner() { /* TODO */ }
function stubEncryptionAtRest() { /* TODO */ }
function stubKeyRotation() { /* TODO */ }
function stubHSMIntegration() { /* TODO */ }
function stubCertificateManager() { /* TODO */ }
function stubMTLSHandshake() { /* TODO */ }
function stubAPIVersioning() { /* TODO */ }
function stubDeprecationWarning() { /* TODO */ }
function stubBackwardCompat() { /* TODO */ }
function stubSemVerCheck() { /* TODO */ }
function stubChangelogGenerator() { /* TODO */ }
function stubReleaseDrafts() { /* TODO */ }
function stubHotfixBranching() { /* TODO */ }
function stubRollbackMechanism() { /* TODO */ }
function stubFeatureToggle() { /* TODO */ }
function stubCanaryDeployment() { /* TODO */ }
function stubBlueGreenSwitch() { /* TODO */ }
function stubSmokeTest() { /* TODO */ }
function stubIntegrationTest() { /* TODO */ }
function stubContractTest() { /* TODO */ }
function stubPerformanceTest() { /* TODO */ }
function stubLoadTest() { /* TODO */ }
function stubChaosMonkey() { /* TODO */ }
function stubObservabilityHook() { /* TODO */ }
function stubTracingMiddleware() { /* TODO */ }
function stubSpanExporter() { /* TODO */ }
function stubMetricAggregator() { /* TODO */ }
function stubAlertingEngine() { /* TODO */ }
function stubDashboardExporter() { /* TODO */ }
function stubOpenTelemetryInit() { /* TODO */ }
function stubPrometheusEndpoint() { /* TODO */ }
