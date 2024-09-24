import { useState, useCallback } from "react";
import { encodeFunctionData, erc20Abi } from "viem";
import type { KernelCABClient } from "@zerodev/cab";
import type { KernelSmartAccount } from "@zerodev/sdk";
import type { EntryPoint } from "permissionless/types";
import type { Chain, Transport } from "viem";

const useSendCabToken = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendToken = useCallback(
    async (
      cabClient: KernelCABClient<
        EntryPoint,
        Transport,
        Chain,
        KernelSmartAccount<EntryPoint, Transport, Chain>
      >,
      recipientAddress: `0x${string}`,
      amount: bigint
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const TEST_ERC20Address = "0x3870419Ba2BBf0127060bCB37f69A1b1C090992B";
        const calls = [
          {
            to: TEST_ERC20Address as `0x${string}`,
            data: encodeFunctionData({
              abi: erc20Abi,
              functionName: "transfer",
              args: [recipientAddress, amount],
            }),
            value: BigInt(0),
          },
        ];

        const { userOperation } =
          await cabClient.prepareUserOperationRequestCAB({
            calls: calls,
            repayTokens: ["6TEST"],
          });

        const userOpHash = await cabClient.sendUserOperationCAB({
          userOperation,
        });

        setIsLoading(false);
        return userOpHash;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  return { sendToken, isLoading, error };
};

export default useSendCabToken;
