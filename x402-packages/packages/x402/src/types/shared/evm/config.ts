import { Address } from "viem";
import { Address as SolanaAddress } from "@solana/kit";

export type TokenConfig = {
  address: Address | SolanaAddress;
  name: string;
  symbol: "USDC" | "PYUSD";
};

export type ChainConfig = {
  // New multi-token support
  tokens?: TokenConfig[];
  // Legacy fields for backwards compatibility
  usdcAddress: Address | SolanaAddress;
  usdcName: string;
};

export const config: Record<string, ChainConfig> = {
  "84532": {
    usdcAddress: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    usdcName: "USDC",
  },
  "8453": {
    usdcAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    usdcName: "USD Coin",
  },
  "43113": {
    usdcAddress: "0x5425890298aed601595a70AB815c96711a31Bc65",
    usdcName: "USD Coin",
  },
  "43114": {
    usdcAddress: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    usdcName: "USD Coin",
  },
  "4689": {
    usdcAddress: "0xcdf79194c6c285077a58da47641d4dbe51f63542",
    usdcName: "Bridged USDC",
  },
  // solana devnet
  "103": {
    usdcAddress: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU" as SolanaAddress,
    usdcName: "USDC",
  },
  // solana mainnet
  "101": {
    usdcAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" as SolanaAddress,
    usdcName: "USDC",
  },
  "1328": {
    usdcAddress: "0x4fcf1784b31630811181f670aea7a7bef803eaed",
    usdcName: "USDC",
  },
  "1329": {
    usdcAddress: "0xe15fc38f6d8c56af07bbcbe3baf5708a2bf42392",
    usdcName: "USDC",
  },
  "137": {
    usdcAddress: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
    usdcName: "USD Coin",
  },
  "80002": {
    usdcAddress: "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582",
    usdcName: "USDC",
  },
  "3338": {
    usdcAddress: "0xbbA60da06c2c5424f03f7434542280FCAd453d10",
    usdcName: "USDC",
  },
  "1": {
    usdcAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    usdcName: "USDC",
  },
  "11155111": {
    usdcAddress: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    usdcName: "USDC",
    tokens: [
      {
        address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" as Address,
        name: "USDC",
        symbol: "USDC",
      },
      {
        address: "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9" as Address,
        name: "PayPal USD",
        symbol: "PYUSD",
      },
    ],
  },
  "42161": {
    usdcAddress: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    usdcName: "USDC",
  },
  "421614": {
    usdcAddress: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
    usdcName: "USDC",
    tokens: [
      {
        address: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d" as Address,
        name: "USDC",
        symbol: "USDC",
      },
      {
        address: "0x637A1259C6afd7E3AdF63993cA7E58BB438aB1B1" as Address,
        name: "PayPal USD",
        symbol: "PYUSD",
      },
    ],
  },
};
