const http = require('http');
const crypto = require('crypto');

// SHA-256 hashes of the valid voucher strings: 'REDEEM2026', 'CRYPTO_DEV', 'BETA_PERK'
const CRYTPO_LEDGER = new Map([
    ['f4bf17482f64a13f707b1ad7f0e6988ad9d08940e53a067ffebbf2464190c74f', { value: 50, spent: false }],
    ['e29851722e038827fa6d3761dfa92917765103fa720e6f3df7f2944b20468305', { value: 100, spent: false }],
    ['509176378e6bfbbec6877995e0cbbf9146dfd81373507d620579e2c608e063ba', { value: 25, spent: false }]
]);

const server = http.createServer((req, res) => {
    // Dynamic routing matrix constraints
    if (req.method === 'POST' && req.url === '/api/verify') {
        let incomingBytes = '';
        req.on('data', chunk => { incomingBytes += chunk; });
        req.on('end', () => {
            try {
                const { proof } = JSON.parse(incomingBytes);
                if (!proof || typeof proof !== 'string') throw new Error();

                // 1. Instantly hash the client input to look up the secure registration signature
                const standardizedInput = proof.trim().toUpperCase();
                const computedHash = crypto.createHash('sha256').update(standardizedInput).digest('hex');

                res.writeHead(computedHash ? 200 : 400, { 'Content-Type': 'application/json' });
                
                if (!CRYTPO_LEDGER.has(computedHash)) {
                    return res.end(JSON.stringify({ success: false, reason: 'Voucher fingerprint mismatch' }));
                }

                const entry = CRYTPO_LEDGER.get(computedHash);
                if (entry.spent) {
                    res.writeHead(410); // Semantic Resource Gone State
                    return res.end(JSON.stringify({ success: false, reason: 'Cryptographic ticket already drained' }));
                }

                // 2. Perform isolated validation state mutation
                entry.spent = true;
                return res.end(JSON.stringify({ success: true, balanceAllocated: entry.value }));

            } catch {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ success: false, reason: 'Malformed payload configuration' }));
            }
        });
    } else {
        res.writeHead(404).end();
    }
});

server.listen(3000, () => console.log('🚀 blind-redeem-zkp engine active on port 3000'));


