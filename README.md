# 🔒 blind-redeem-zkp

A high-security, zero-dependency Node.js server built for blind cryptographic voucher validation using single-way SHA-256 validation matrices.

## 🧠 Architectural Design Blueprint
- **Zero Knowledge Data Storage**: The engine never keeps the original voucher codes in raw string layout inside memory. It strictly evaluates verification requests against one-way secure hashes.
- **Native Network Implementation**: Built entirely on top of the native Node.js `http` and `crypto` libraries to reduce external deployment overhead and package risk vectors.

## 🚀 Execution & Verification Track
1. **Fire Up the Application Instance**:
   ```bash
   node server.js
   ```
2. **Submit a Valid Claim Payload**:
   ```bash
   curl -X POST http://localhost:3000/api/verify \
     -H "Content-Type: application/json" \
     -d '{"proof": "REDEEM2026"}'
   ```
