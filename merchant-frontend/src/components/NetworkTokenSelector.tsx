import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { SupportedChainKey } from '@/contexts/WalletContext';

export type TokenSymbol = 'USDC' | 'PYUSD';

interface NetworkOption {
  key: SupportedChainKey;
  name: string;
  chainId: number;
  tokens: TokenSymbol[];
}

const NETWORK_OPTIONS: NetworkOption[] = [
  {
    key: 'sepolia',
    name: 'Ethereum Sepolia',
    chainId: 11155111,
    tokens: ['USDC', 'PYUSD'],
  },
  {
    key: 'arbitrumSepolia',
    name: 'Arbitrum Sepolia',
    chainId: 421614,
    tokens: ['USDC', 'PYUSD'],
  },
  {
    key: 'baseSepolia',
    name: 'Base Sepolia',
    chainId: 84532,
    tokens: ['USDC'],
  },
];

interface NetworkTokenSelectorProps {
  selectedNetwork: SupportedChainKey;
  selectedToken: TokenSymbol;
  onNetworkSelect: (network: SupportedChainKey) => void;
  onTokenSelect: (token: TokenSymbol) => void;
}

export function NetworkTokenSelector({
  selectedNetwork,
  selectedToken,
  onNetworkSelect,
  onTokenSelect,
}: NetworkTokenSelectorProps) {
  const currentNetworkOption = NETWORK_OPTIONS.find((n) => n.key === selectedNetwork);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Select Network</CardTitle>
          <CardDescription>Choose the network you want to pay on</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {NETWORK_OPTIONS.map((network) => (
            <Button
              key={network.key}
              variant={selectedNetwork === network.key ? 'default' : 'outline'}
              className="w-full justify-between"
              onClick={() => onNetworkSelect(network.key)}
            >
              <span>{network.name}</span>
              <Badge variant="secondary" className="ml-2">
                {network.chainId}
              </Badge>
            </Button>
          ))}
        </CardContent>
      </Card>

      {currentNetworkOption && (
        <Card>
          <CardHeader>
            <CardTitle>Select Token</CardTitle>
            <CardDescription>Choose which stablecoin to use for payment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {currentNetworkOption.tokens.map((token) => (
              <Button
                key={token}
                variant={selectedToken === token ? 'default' : 'outline'}
                className="w-full justify-between"
                onClick={() => onTokenSelect(token)}
              >
                <span className="font-semibold">{token}</span>
                <span className="text-sm text-muted-foreground">
                  {token === 'USDC' ? 'USD Coin' : 'PayPal USD'}
                </span>
              </Button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
