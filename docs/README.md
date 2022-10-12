# Havana API
Minimal demo of Havana REST API quote and swap functionality 

## Getting Started

1. Install dependencies
```
yarn add @solana/web3.js cross-fetch @project-serum/anchor bs58
```

2. For testing purposes, add `PRIVATE_KEY` environment variable to `.env`.
```
yarn add --dev dotenv
```
Then in `./.env`,
```
PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE
```
In production, you'll need to pass a private key to construct a `Wallet` [here]().

## Quote API
Get the best price and route given input quote params.

**Quote params**

`inputMint` (required): mint of input coin

`outputMint` (required): mint of output coin

`amount` (required): integer trade amount. Note you'll need to 
[look up the token decimals](https://www.npmjs.com/package/@solana/spl-token-registry).
For example, $1 USDC = 1 000 000 (6 decimals). 

`direction` (optional):  One of `'InToOut'` (default) or `'OutToIn'`. Sets the quote direction. 
For example, setting `{ direction: 'OutToIn', amount: 1000000, ... }`
on `SOL=>USDC` returns the amount of `SOL` needed to receive $1 `USDC`.

`slippageBps` (optional): max allowable slippage in bps

`onlyDirectRoutes` (optional): boolean. `false` by default. If `true`, returned route is a single AMM pool.

## Swap API
Constructs Solana transaction objects to be signed and executed locally.

**Swap params**
`bestPath` (required): best path object returned from `/quote` endpoint above

`publicKey` (required): wallet public key

`useWSOL`(optional): boolean. `true` by default. If `true`, auto wrap and unwrap sol
