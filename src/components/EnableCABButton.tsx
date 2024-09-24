import { Button } from "@/components/ui/button";
import { ShieldIcon } from "lucide-react";
import type { CabClient } from "@/utils/types";

export default function EnableCABButton({
  cabClient,
}: {
  cabClient: CabClient;
}) {
  const handleEnableChainAbstraction = () => {
    if (!cabClient) return;
    cabClient.enableCAB({
      tokens: [{ name: "6TEST" }],
    });
  };

  return (
    <Button
      onClick={handleEnableChainAbstraction}
      className="bg-green-500 hover:bg-green-600 text-white"
    >
      <ShieldIcon className="mr-2 h-4 w-4" /> Enable Chain Abstraction
    </Button>
  );
}
