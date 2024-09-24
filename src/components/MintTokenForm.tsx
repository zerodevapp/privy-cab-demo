import { Button } from "@/components/ui/button";
import useMint6TestToken from "@/hooks/useMint6TestToken";
import type { CabClient } from "@/utils/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useCABBalance } from "@/hooks/useCabBalance";
import { CoinsIcon } from "lucide-react";

export default function MintTokenForm({
  cabClient,
  isChainAbstractionEnabled,
}: {
  cabClient: CabClient;
  isChainAbstractionEnabled: boolean;
}) {
  const { mint, isLoading: isMinting, error: mintError } = useMint6TestToken();
  const { refetch: fetchBalance } = useCABBalance(cabClient, isChainAbstractionEnabled);
  const handleMint = async () => {
    if (!cabClient?.account.address) {
      console.error("No account address available");
      return;
    }

    try {
      const amountToMint = BigInt(10 * 10 ** 6);
      const txHash = await mint(cabClient.account.address, amountToMint);
      console.log(`Minted 10 6TEST tokens. Transaction hash: ${txHash}`);

      // Update the balance
      await fetchBalance();
    } catch (error) {
      console.error("Error minting tokens:", error);
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Deposit Tokens</CardTitle>
        <CardDescription>Mint test tokens to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          Click the button below to mint 10 6TEST erc20 tokens to your account.
          The mint will happen on base sepolia but the tokens will be available
          on all supported chains.
        </p>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleMint}
          className="w-full bg-green-500 hover:bg-green-600 text-white"
          disabled={isMinting || !isChainAbstractionEnabled}
        >
          {isMinting ? (
            "Minting..."
          ) : (
            <>
              <CoinsIcon className="mr-2 h-4 w-4" /> Mint 10 6TEST Tokens
            </>
          )}
        </Button>
      </CardFooter>
      {mintError && (
        <p className="text-red-500 text-sm mt-2">Error: {mintError}</p>
      )}
    </Card>
  );
}
