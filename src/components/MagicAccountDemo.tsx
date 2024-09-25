import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import LoginButton from "./LoginButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePrivy } from "@privy-io/react-auth";
import useCabClient from "@/hooks/useCabClient";
import { useIsCabEnabled } from "@/hooks/useIsCabEnabled";
import { supportedChains } from "@/utils/chains";
import { CopyIcon, ShieldIcon, Loader2Icon } from "lucide-react";
import BalanceDisplay from "./BalanceDisplay";
import EnableCABButton from "./EnableCABButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import SendTokenForm from "./SendTokenForm";
import MintTokenForm from "./MintTokenForm";

export default function MagicAccountDemo() {
  const { authenticated } = usePrivy();
  const [chain, setChain] = useState<number>(supportedChains[0].id);
  const cabClient = useCabClient(chain);
  const [isCopied, setIsCopied] = useState(false);
  const { isEnabled: isChainAbstractionEnabled } = useIsCabEnabled(
    cabClient?.account.address,
    chain,
    "6TEST"
  );

  const handleCopyAddress = () => {
    if (!cabClient?.account.address) {
      return;
    }
    navigator.clipboard.writeText(cabClient?.account.address);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-blue-600">
            Magic Account + Privy Demo
          </CardTitle>
          <CardDescription>
            Mint some test tokens, then spend them on any chain, without
            bridging.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!authenticated ? (
            <LoginButton />
          ) : !cabClient ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2Icon className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-sm text-gray-500">
                Loading your account details...
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-500">
                    Your Address
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={cabClient ? cabClient.account.address : ""}
                      readOnly
                      className="bg-gray-100 font-mono"
                    />
                    <TooltipProvider>
                      <Tooltip open={isCopied}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={handleCopyAddress}
                          >
                            <CopyIcon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copied!</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <div className="text-right">
                  {isChainAbstractionEnabled ? (
                    <BalanceDisplay
                      // biome-ignore lint/style/noNonNullAssertion: <explanation>
                      cabClient={cabClient!}
                      isChainAbstractionEnabled={isChainAbstractionEnabled}
                    />
                  ) : (
                    // biome-ignore lint/style/noNonNullAssertion: <explanation>
                    <EnableCABButton cabClient={cabClient!} />
                  )}
                </div>
              </div>

              {!isChainAbstractionEnabled && (
                <Alert className="bg-yellow-50 border-yellow-200">
                  <ShieldIcon className="h-4 w-4" />
                  <AlertTitle>Chain Abstraction Not Enabled</AlertTitle>
                  <AlertDescription>
                    Enable chain abstraction to view your aggregated balance and
                    send tokens across chains.
                  </AlertDescription>
                </Alert>
              )}

              <Tabs defaultValue="deposit" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="deposit">Deposit</TabsTrigger>
                  <TabsTrigger value="send">Send</TabsTrigger>
                </TabsList>
                <TabsContent value="send">
                  <SendTokenForm
                    // biome-ignore lint/style/noNonNullAssertion: <explanation>
                    cabClient={cabClient!}
                    chain={chain}
                    setChain={setChain}
                    isChainAbstractionEnabled={isChainAbstractionEnabled}
                  />
                </TabsContent>
                <TabsContent value="deposit">
                  <MintTokenForm
                    // biome-ignore lint/style/noNonNullAssertion: <explanation>
                    cabClient={cabClient!}
                    isChainAbstractionEnabled={isChainAbstractionEnabled}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
