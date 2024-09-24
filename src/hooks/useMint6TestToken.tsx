import { useState, useCallback } from 'react';
import { createPublicClient, http, encodeFunctionData } from 'viem';
import { baseSepolia } from 'viem/chains';
import { createKernelAccountClient, createKernelAccount, createZeroDevPaymasterClient } from '@zerodev/sdk';
import { signerToEcdsaValidator } from '@zerodev/ecdsa-validator';
import { ENTRYPOINT_ADDRESS_V07 } from 'permissionless';
import { KERNEL_V3_1 } from '@zerodev/sdk/constants';
import { privateKeyToAccount } from "viem/accounts"
import type { Hex } from 'viem';

const TEST_ERC20Abi = [
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
const bundlerRpc = `https://rpc.zerodev.app/api/v2/bundler/${import.meta.env.VITE_BASE_SEPOLIA_PROJECT_ID}`
const paymasterRpc = `https://rpc.zerodev.app/api/v2/paymaster/${import.meta.env.VITE_BASE_SEPOLIA_PROJECT_ID}`

const useMint6TestToken = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mint = useCallback(async (toAddress: string, amount: bigint) => {
    setIsLoading(true);
    setError(null);

    try {
      const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http(bundlerRpc),
      });

      const signer = privateKeyToAccount(import.meta.env.VITE_PRIVATE_KEY as Hex)
      const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
        signer, 
        entryPoint: ENTRYPOINT_ADDRESS_V07,
        kernelVersion: KERNEL_V3_1,
      });

      const kernelAccount = await createKernelAccount(publicClient, {
        entryPoint: ENTRYPOINT_ADDRESS_V07,
        plugins: {
          sudo: ecdsaValidator,
        },
        kernelVersion: KERNEL_V3_1,
      });

      const kernelClient = await createKernelAccountClient({
        account: kernelAccount,
        chain: baseSepolia,
        bundlerTransport: http(bundlerRpc),
        middleware: {
          sponsorUserOperation: async ({ userOperation }) => {
            const zeroDevPaymaster = createZeroDevPaymasterClient({
              chain: baseSepolia,
              transport: http(paymasterRpc),
              entryPoint: ENTRYPOINT_ADDRESS_V07,
            });
            return zeroDevPaymaster.sponsorUserOperation({
              userOperation,
              entryPoint: ENTRYPOINT_ADDRESS_V07,
            });
          },
        },
        entryPoint: ENTRYPOINT_ADDRESS_V07,
      });

      const TEST_ERC20Address = '0x3870419Ba2BBf0127060bCB37f69A1b1C090992B'; 

      const mintData = encodeFunctionData({
        abi: TEST_ERC20Abi,
        functionName: 'mint',
        args: [toAddress, amount],
      });

      const mintTransactionHash = await kernelClient.sendTransaction({
        to: TEST_ERC20Address,
        data: mintData,
      });

      setIsLoading(false);
      return mintTransactionHash;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsLoading(false);
      throw err;
    }
  }, []);

  return { mint, isLoading, error };
};

export default useMint6TestToken;