import { useQuery } from '@tanstack/react-query';
import { formatUnits } from 'viem';
import type { KernelCABClient } from '@zerodev/cab';
import type { KernelSmartAccount } from '@zerodev/sdk';
import type { EntryPoint } from 'permissionless/types';
import type { Chain, Transport } from 'viem';

export function useCABBalance(
  cabClient: KernelCABClient<EntryPoint, Transport, Chain, KernelSmartAccount<EntryPoint, Transport, Chain>>,
  isChainAbstractionEnabled: boolean
) {
  const fetchBalance = async () => {
    if (!cabClient || !isChainAbstractionEnabled) {
      return null;
    }

    const balanceResult = await cabClient.getCabBalance({
      token: '6TEST',
      address: cabClient.account.address,
    });
    return balanceResult;
  };

  const { data: balance, error, isLoading, refetch } = useQuery({
    queryKey: ['cabBalance', cabClient?.account.address, isChainAbstractionEnabled],
    queryFn: fetchBalance,
    enabled: !!cabClient && isChainAbstractionEnabled,
    refetchInterval: 3000,
  });

  const formatBalance = (value: bigint | null | undefined) => {
    if (value == null) {
      return '0.00';
    }
    return Number.parseFloat(formatUnits(value, 6)).toFixed(2);
  };

  return { balance, formatBalance, refetch, error, isLoading };
}