import { useCABBalance } from "@/hooks/useCabBalance";
import type { CabClient } from "@/utils/types";
import { Label } from "@/components/ui/label";

export default function BalanceDisplay({
  cabClient,
  isChainAbstractionEnabled,
}: {
  cabClient: CabClient;
  isChainAbstractionEnabled: boolean;
}) {
  const { balance, formatBalance } = useCABBalance(
    cabClient,
    isChainAbstractionEnabled
  );

  return (
    <>
      <Label className="text-sm font-medium text-gray-500">
        Chain-Abstracted Balance
      </Label>
      <div className="text-2xl font-bold text-blue-600">
        {balance !== null ? `${formatBalance(balance)} USDC` : "Loading..."}
      </div>
    </>
  );
}
