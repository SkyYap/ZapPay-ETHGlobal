import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createWalletClient, custom, type WalletClient, type Chain } from 'viem';
import { baseSepolia, sepolia, arbitrumSepolia } from 'viem/chains';
import type { Hex } from 'viem';

// Extend Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Supported chains for testing USDC and PYUSD
export const SUPPORTED_CHAINS = {
  sepolia,
  arbitrumSepolia,
  baseSepolia,
} as const;

export type SupportedChainKey = keyof typeof SUPPORTED_CHAINS;

interface WalletContextType {
  isConnected: boolean;
  address: Hex | null;
  walletClient: WalletClient | null;
  error: string | null;
  isConnecting: boolean;
  currentChain: Chain;
  connectWallet: (chainKey?: SupportedChainKey) => Promise<void>;
  disconnectWallet: () => void;
  switchChain: (chainKey: SupportedChainKey) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode}) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<Hex | null>(null);
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentChain, setCurrentChain] = useState<Chain>(arbitrumSepolia); // Default to Arbitrum Sepolia for PYUSD testing

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts'
        }) as string[];

        if (accounts.length > 0) {
          // Get current chain ID from wallet
          const chainId = await window.ethereum.request({
            method: 'eth_chainId'
          }) as string;

          // Find matching chain from supported chains, default to sepolia
          let chain = sepolia;
          const chainIdDecimal = parseInt(chainId, 16);

          for (const [key, supportedChain] of Object.entries(SUPPORTED_CHAINS)) {
            if (supportedChain.id === chainIdDecimal) {
              chain = supportedChain;
              break;
            }
          }

          setCurrentChain(chain);

          const client = createWalletClient({
            account: accounts[0] as Hex,
            chain: chain,
            transport: custom(window.ethereum)
          });

          setWalletClient(client);
          setAddress(accounts[0] as Hex);
          setIsConnected(true);
        }
      } catch (err) {
        console.error('Failed to check wallet connection:', err);
      }
    }
  };

  const connectWallet = useCallback(async (chainKey: SupportedChainKey = 'arbitrumSepolia') => {
    setError(null);
    setIsConnecting(true);

    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask or another Ethereum wallet');
      }

      const selectedChain = SUPPORTED_CHAINS[chainKey];
      setCurrentChain(selectedChain);

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      }) as string[];

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Check if on correct network
      const chainId = await window.ethereum.request({
        method: 'eth_chainId'
      }) as string;

      const targetChainIdHex = `0x${selectedChain.id.toString(16)}`;

      if (chainId !== targetChainIdHex) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: targetChainIdHex }],
          });
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to browser wallet
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: targetChainIdHex,
                chainName: selectedChain.name,
                nativeCurrency: {
                  name: selectedChain.nativeCurrency.name,
                  symbol: selectedChain.nativeCurrency.symbol,
                  decimals: selectedChain.nativeCurrency.decimals,
                },
                rpcUrls: selectedChain.rpcUrls.default.http,
                blockExplorerUrls: selectedChain.blockExplorers?.default.url ? [selectedChain.blockExplorers.default.url] : undefined,
              }],
            });
          } else {
            throw switchError;
          }
        }
      }

      // Create viem wallet client
      const client = createWalletClient({
        account: accounts[0] as Hex,
        chain: selectedChain,
        transport: custom(window.ethereum)
      });

      setWalletClient(client);
      setAddress(accounts[0] as Hex);
      setIsConnected(true);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      console.error('Wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWalletClient(null);
    setAddress(null);
    setIsConnected(false);
    setError(null);
  }, []);

  const switchChain = useCallback(async (chainKey: SupportedChainKey) => {
    setError(null);

    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask or another Ethereum wallet');
      }

      const selectedChain = SUPPORTED_CHAINS[chainKey];
      const targetChainIdHex = `0x${selectedChain.id.toString(16)}`;

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: targetChainIdHex }],
        });
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to browser wallet
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: targetChainIdHex,
              chainName: selectedChain.name,
              nativeCurrency: {
                name: selectedChain.nativeCurrency.name,
                symbol: selectedChain.nativeCurrency.symbol,
                decimals: selectedChain.nativeCurrency.decimals,
              },
              rpcUrls: selectedChain.rpcUrls.default.http,
              blockExplorerUrls: selectedChain.blockExplorers?.default.url ? [selectedChain.blockExplorers.default.url] : undefined,
            }],
          });
        } else {
          throw switchError;
        }
      }

      // Update chain state
      setCurrentChain(selectedChain);

      // Update wallet client with new chain
      if (address) {
        const client = createWalletClient({
          account: address,
          chain: selectedChain,
          transport: custom(window.ethereum)
        });
        setWalletClient(client);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to switch chain');
      console.error('Chain switch error:', err);
    }
  }, [address]);

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== address) {
          // Re-connect with new account using current chain
          const client = createWalletClient({
            account: accounts[0] as Hex,
            chain: currentChain,
            transport: custom(window.ethereum)
          });

          setWalletClient(client);
          setAddress(accounts[0] as Hex);
          setIsConnected(true);
        }
      };

      const handleChainChanged = async (chainIdHex: string) => {
        // Update current chain when user switches network in wallet
        const chainIdDecimal = parseInt(chainIdHex, 16);

        let chain = sepolia; // Default fallback
        for (const [key, supportedChain] of Object.entries(SUPPORTED_CHAINS)) {
          if (supportedChain.id === chainIdDecimal) {
            chain = supportedChain;
            break;
          }
        }

        setCurrentChain(chain);

        // Update wallet client with new chain if connected
        if (address) {
          const client = createWalletClient({
            account: address,
            chain: chain,
            transport: custom(window.ethereum)
          });
          setWalletClient(client);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [address, currentChain, disconnectWallet]);

  const value: WalletContextType = {
    isConnected,
    address,
    walletClient,
    error,
    isConnecting,
    currentChain,
    connectWallet,
    disconnectWallet,
    switchChain,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
