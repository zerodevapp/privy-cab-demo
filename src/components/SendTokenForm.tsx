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
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const { sendToken, isLoading: isSending } = useSendCabToken();

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
      console.log(
        `Sent ${amount} 6TEST tokens to ${recipient}. Transaction hash: ${txHash}`
      );

      // Update the balance
      await fetchBalance();

      // Clear the form
      setRecipient("");
      setAmount("");
    } catch (error) {
      console.error("Error sending tokens:", error);
    }
  };

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
            onChange={(e) => setRecipient(e.target.value)}
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
          <Select onValueChange={(value) => setChain(Number(value))}>
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
      <CardFooter>
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
      </CardFooter>
    </Card>
  );
}
