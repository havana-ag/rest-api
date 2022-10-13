/*
 * Minimal Havana API quote and swap example
 */
import fetch from "cross-fetch";
import { Wallet } from "@project-serum/anchor";
import { Connection, Keypair, Transaction } from "@solana/web3.js";
import * as dotenv from "dotenv";
import bs58 from "bs58";
dotenv.config();

const API_ENDPOINT = "https://trade-api.havana.ag/v1";

const connection = new Connection("https://ssc-dao.genesysgo.net");
const wallet = new Wallet(
  Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_KEY || ""))
);

/*
 * QUOTE API
 */
// Swap 0.01 SOL to USDC with 0.5% slippage
const quoteParams = {
  // required
  inputMint: "So11111111111111111111111111111111111111112",
  outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  amount: 10000000,

  // optional
  direction: "InToOut", // one of { 'InToOut', 'OutToIn' }
  slippageBps: 50,
  onlyDirectRoutes: true,
};

const quote = await (
  await fetch(`${API_ENDPOINT}/quote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(quoteParams),
  })
).json();

console.log(JSON.stringify(quote));

/*
 * SWAP API
 */
const transactions = await (
  await fetch(`${API_ENDPOINT}/swap`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // route from /quote api
      bestPath: quote,
      publicKey: wallet.publicKey.toString(),
      useWSOL: true,
    }),
  })
).json();

const { setupTransaction, swapTransaction, cleanupTransaction } = transactions;

// Execute the transactions
for (let serializedTransaction of [
  setupTransaction,
  swapTransaction,
  cleanupTransaction,
].filter(Boolean)) {
  const transaction = Transaction.from(
    Buffer.from(serializedTransaction, "base64")
  );

  console.log("sending transaction...");
  const txid = await connection.sendTransaction(transaction, [wallet.payer], {
    skipPreflight: true,
  });

  console.log("confirming transaction...");
  await connection.confirmTransaction(txid);

  console.log(`https://solscan.io/tx/${txid}`);
}

