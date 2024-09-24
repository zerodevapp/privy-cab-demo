import { useQuery } from "@tanstack/react-query";
import { invoiceManagerAddress } from "@zerodev/cab";
import { cabPaymasterUrl } from "@/utils/constants";

type EnabledTokenInfo = {
  chainId: number;
  tokens: string[];
};

export function useIsCabEnabled(
  address: string | undefined,
  chainId: number,
  tokenName: string
) {
  const { data: enabledTokensData, isLoading } = useQuery({
    queryKey: ["cabEnabled", address, chainId, tokenName],
    queryFn: async () => {
      if (!address) return [];
      const response = await fetch(
        `${cabPaymasterUrl}/cab/${address}/${invoiceManagerAddress}`
      );
      const data = await response.json();
      return data.enabledTokens as EnabledTokenInfo[];
    },
    enabled: !!address,
  });

  const isEnabled = enabledTokensData
    ? enabledTokensData.some(
        (info) => info.chainId === chainId && info.tokens.includes(tokenName)
      )
    : false;

  return {
    isEnabled,
    isLoading,
    enabledTokensData,
  };
}
