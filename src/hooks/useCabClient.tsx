import { useWallets } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { KERNEL_V3_1 } from "@zerodev/sdk/constants";
import {
  providerToSmartAccountSigner,
  ENTRYPOINT_ADDRESS_V07,
} from "permissionless";
import { createPublicClient, http } from "viem";
import { createKernelCABClient } from "@zerodev/cab";
import { toMultiChainECDSAValidator } from "@zerodev/multi-chain-validator";
import { createKernelAccount, createKernelAccountClient } from "@zerodev/sdk";
import { getBundlerRpc, getChain, getPublicRpc } from "@/utils/chains";
import type { KernelSmartAccount } from "@zerodev/sdk";
import type { KernelCABClient } from "@zerodev/cab";
import type { Chain, Transport } from "viem";
import type { EntryPoint } from "permissionless/types";

const cabPaymasterUrl =
  "https://cab-paymaster-service.onrender.com/paymaster/api";

export default function useCabClient(chainId: number) {
  const { wallets } = useWallets();
  const [cabClient, setCabClient] = useState<KernelCABClient<
    EntryPoint,
    Transport,
    Chain,
    KernelSmartAccount<EntryPoint, Transport, Chain>
  > | null>(null);

  // Get the privy embedded wallet.
  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === "privy"
  );

  useEffect(() => {
    const getProvider = async () => {
      if (!embeddedWallet) return;
      await embeddedWallet.switchChain(chainId);
      // Get the provider for the embedded wallet
      const privyProvider = await embeddedWallet.getEthereumProvider();
      const smartAccountSigner = await providerToSmartAccountSigner(
        // @ts-expect-error - privyProvider is not typed the same way as EIP1193Provider
        privyProvider
      );

      const publicClient = createPublicClient({
        transport: http(getPublicRpc(chainId)),
      });

      const multiChainValidator = await toMultiChainECDSAValidator(
        publicClient,
        {
          signer: smartAccountSigner,
          entryPoint: ENTRYPOINT_ADDRESS_V07,
          kernelVersion: KERNEL_V3_1,
        }
      );

      const kernelAccount = await createKernelAccount(publicClient, {
        entryPoint: ENTRYPOINT_ADDRESS_V07,
        kernelVersion: KERNEL_V3_1,
        plugins: {
          sudo: multiChainValidator,
        },
      });

      const kernelClient = createKernelAccountClient({
        // @ts-expect-error - viem types are not compatible
        account: kernelAccount,
        chain: getChain(chainId).chain,
        entryPoint: ENTRYPOINT_ADDRESS_V07,
        bundlerTransport: http(getBundlerRpc(chainId)),
      });

      // @ts-expect-error - viem types are not compatible
      const cabClient = createKernelCABClient(kernelClient, {
        transport: http(cabPaymasterUrl, { timeout: 30000 }),
      }) as KernelCABClient<
        EntryPoint,
        Transport,
        Chain,
        KernelSmartAccount<EntryPoint, Transport, Chain>
      >;

      setCabClient(cabClient);
    };
    getProvider();
  }, [embeddedWallet, chainId]); // Add chainId to the dependency array

  return cabClient;
}
