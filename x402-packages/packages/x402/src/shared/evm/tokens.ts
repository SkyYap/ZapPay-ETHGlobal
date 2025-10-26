import { Address } from "viem";
import { config, TokenConfig } from "../../types/shared/evm/config";

/**
 * Gets all available tokens for a specific chain ID
 *
 * @param chainId - The chain ID to get tokens for
 * @returns Array of token configurations available on the chain
 */
export function getTokensForChain(chainId: number): TokenConfig[] {
  const chainConfig = config[chainId.toString()];
  if (!chainConfig) return [];

  // If tokens array exists, return it
  if (chainConfig.tokens && chainConfig.tokens.length > 0) {
    return chainConfig.tokens;
  }

  // Otherwise, create a single-token array from legacy fields for backwards compatibility
  return [
    {
      address: chainConfig.usdcAddress,
      name: chainConfig.usdcName,
      symbol: "USDC",
    },
  ];
}

/**
 * Gets a specific token by symbol for a chain
 *
 * @param chainId - The chain ID
 * @param symbol - The token symbol (e.g., "USDC", "PYUSD")
 * @returns The token configuration if found, undefined otherwise
 */
export function getTokenBySymbol(
  chainId: number,
  symbol: "USDC" | "PYUSD",
): TokenConfig | undefined {
  const tokens = getTokensForChain(chainId);
  return tokens.find((token) => token.symbol === symbol);
}

/**
 * Gets a specific token by address for a chain
 *
 * @param chainId - The chain ID
 * @param address - The token contract address
 * @returns The token configuration if found, undefined otherwise
 */
export function getTokenByAddress(
  chainId: number,
  address: Address | string,
): TokenConfig | undefined {
  const tokens = getTokensForChain(chainId);
  const normalizedAddress = address.toLowerCase();
  return tokens.find(
    (token) =>
      typeof token.address === "string" &&
      token.address.toLowerCase() === normalizedAddress,
  );
}
