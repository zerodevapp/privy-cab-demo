import type { KernelCABClient } from "@zerodev/cab";
import type { KernelSmartAccount } from "@zerodev/sdk";
import type { EntryPoint } from "permissionless/types";
import type { Chain, Transport } from "viem";

export type CabClient = KernelCABClient<EntryPoint, Transport, Chain, KernelSmartAccount<EntryPoint, Transport, Chain>>;
