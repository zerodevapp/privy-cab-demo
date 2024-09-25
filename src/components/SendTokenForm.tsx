import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import useSendCabToken from "@/hooks/useSendCabToken";
import { supportedChains } from "@/utils/chains";
import type { CabClient } from "@/utils/types";
import { SendIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCABBalance } from "@/hooks/useCabBalance";
import TransactionLink from "@/components/TransactionLink";
import { jiffyScanNetworkName } from "@/utils/chains";

export default function SendTokenForm({
  cabClient,
  setChain,
  isChainAbstractionEnabled,
}: {
  cabClient: CabClient;
  chain: number;
  setChain: (chain: number) => void;
  isChainAbstractionEnabled: boolean;
}) {
  const { refetch: fetchBalance } = useCABBalance(cabClient, isChainAbstractionEnabled);
  const [recipient, setRecipient] = useState(cabClient.account.address);
  const [amount, setAmount] = useState("");
  const { sendToken, isLoading: isSending } = useSendCabToken();
  const [transactionInfo, setTransactionInfo] = useState<{
    userOpHash: `0x${string}`;
    transactionUrl: string;
  } | null>(null);

  const handleSend = async () => {
    if (!cabClient || !recipient || !amount) {
      console.error("Missing required information for sending tokens");
      return;
    }

    try {
      const amountToSend = BigInt(Number.parseFloat(amount) * 10 ** 6); // Convert to 6 decimal places
      const txHash = await sendToken(
        cabClient,
        recipient as `0x${string}`,
        amountToSend
      );
      const networkName = jiffyScanNetworkName[cabClient.chain.id as keyof typeof jiffyScanNetworkName];
      setTransactionInfo({
        userOpHash: txHash,
        transactionUrl: `https://jiffyscan.xyz/userOpHash/${txHash}?network=${networkName}`,
      });
      console.log(
        `Sent ${amount} USDC tokens to ${recipient}. Transaction hash: ${txHash}`
      );

      // Update the balance
      await fetchBalance();

      // Clear the form
      setRecipient("0x");
      setAmount("");
    } catch (error) {
      console.error("Error sending tokens:", error);
    }
  };

  const handleCloseTransactionInfo = () => {
    setTransactionInfo(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Tokens</CardTitle>
        <CardDescription>
          Transfer tokens to another address on any chain
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recipient">Recipient Address</Label>
          <Input
            id="recipient"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value as `0x${string}`)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="chain">Destination Chain</Label>
          <Select 
            onValueChange={(value) => setChain(Number(value))}
            defaultValue={cabClient.chain.id.toString()}
          >
            <SelectTrigger id="chain">
              <SelectValue placeholder="Select chain" />
            </SelectTrigger>
            <SelectContent>
              {supportedChains.map((chain) => (
                <SelectItem key={chain.id} value={chain.id.toString()}>
                  {chain.chain.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          onClick={handleSend}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          disabled={!isChainAbstractionEnabled || isSending}
        >
          {isSending ? (
            "Sending..."
          ) : (
            <>
              <SendIcon className="mr-2 h-4 w-4" /> Send Tokens
            </>
          )}
        </Button>
        <TransactionLink transactionInfo={transactionInfo} onClose={handleCloseTransactionInfo} />
      </CardFooter>
    </Card>
  );
}
