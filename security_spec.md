# Security Specification & Test Plan for WAKNOVA

## 1. Data Invariants
- Products: Publicly readable; only authenticated admins can create, update, or delete products.
- Orders: Any customer can create an order with valid contact info and line items. Customers can read their own order via tracking. Only admins can update status, paymentStatus, and priority.
- Special Orders: Customers can submit requests. Only admins can update status and admin replies.
- Reviews: Anyone can read reviews; users can submit reviews with valid ratings (1-5).
- Coupons, Payment Methods, Settings: Publicly readable; writable strictly by admins.
- Maintenance Requests: Customers can submit requests; admins can update status.
- Notifications: Only admins or recipient users can access.

## 2. The "Dirty Dozen" Payloads (Attacks that must be rejected with PERMISSION_DENIED)
1. **Unauthenticated Product Injection**: Anonymous user attempts to insert fake product into `/products/fake1`.
2. **Product Price Tampering**: Non-admin attempts to change product price from 25,000 to 100.
3. **Shadow Update on Order**: Customer attempts to update order status to "تم التسليم" without admin privileges.
4. **Order Total Manipulation**: Non-admin attempts to mutate total price of an existing order.
5. **Special Order Reply Spoof**: Customer attempts to overwrite `adminReply` field.
6. **Payment Method Hijacking**: Malicious user attempts to replace Al-Kuraimi wallet account number with personal IBAN.
7. **Coupon Creation Attack**: Unauthenticated user injects 99% off coupon code.
8. **Settings Destruction**: Non-admin attempts to overwrite store contact number and Instagram handle.
9. **Maintenance Status Forgery**: Non-admin marks uncompleted repair as "تم التسليم".
10. **Junk Character Path / Resource Exhaustion**: Injecting a 2MB payload into review comment or oversized string keys.
11. **Negative Review Rating**: Inserting a review with rating -10 or rating 999.
12. **Admin Claim Spoofing**: Attempting to create an admin entry in `/admins/attackerUid` without authorization.
