import {
    arbitrumSepolia,
    baseSepolia,
    optimismSepolia,
    polygonAmoy,
} from "viem/chains"
import type { Address } from "viem";

export const tokenAddresses: {
    [chainId: number]: { [token: string]: Address }
} = {
    11155420: {
        // OP Sepolia
        "6TEST": "0x3870419ba2bbf0127060bcb37f69a1b1c090992b"
    },
    80002: {
        // Amoy
        "6TEST": "0x3870419Ba2BBf0127060bCB37f69A1b1C090992B"
    },
    421614: {
        // Arbitrum Sepolia
        "6TEST": "0x3870419ba2bbf0127060bcb37f69a1b1c090992b"
    },
    84532: {
        // Base Sepolia
        "6TEST": "0x3870419ba2bbf0127060bcb37f69a1b1c090992b"
    }
}

export const supportedChains = [
    {
        id: polygonAmoy.id,
        chain: polygonAmoy,
        publicRpc: polygonAmoy.rpcUrls.default.http[0],
        bundlerRpc:
            `https://rpc.zerodev.app/api/v2/bundler/${import.meta.env.VITE_POLYGON_AMOY_PROJECT_ID}`,
        paymasterRpc:
            `https://rpc.zerodev.app/api/v2/paymaster/${import.meta.env.VITE_POLYGON_AMOY_PROJECT_ID}`,
        tokens: tokenAddresses[polygonAmoy.id]
    },
    {
        id: arbitrumSepolia.id,
        chain: arbitrumSepolia,
        publicRpc: arbitrumSepolia.rpcUrls.default.http[0],
        bundlerRpc:
            `https://rpc.zerodev.app/api/v2/bundler/${import.meta.env.VITE_ARBITRUM_SEPOLIA_PROJECT_ID}`,
        paymasterRpc:
            `https://rpc.zerodev.app/api/v2/paymaster/${import.meta.env.VITE_ARBITRUM_SEPOLIA_PROJECT_ID}`,
        tokens: tokenAddresses[arbitrumSepolia.id]
    },
    {
        id: optimismSepolia.id,
        chain: optimismSepolia,
        publicRpc: optimismSepolia.rpcUrls.default.http[0],
        bundlerRpc:
            `https://rpc.zerodev.app/api/v2/bundler/${import.meta.env.VITE_OPTIMISM_SEPOLIA_PROJECT_ID}`,
        paymasterRpc:
            `https://rpc.zerodev.app/api/v2/paymaster/${import.meta.env.VITE_OPTIMISM_SEPOLIA_PROJECT_ID}`,
        tokens: tokenAddresses[optimismSepolia.id]
    },
    {
        id: baseSepolia.id,
        chain: baseSepolia,
        publicRpc: baseSepolia.rpcUrls.default.http[0],
        isMainnet: false,
        bundlerRpc:
            `https://rpc.zerodev.app/api/v2/bundler/${import.meta.env.VITE_BASE_SEPOLIA_PROJECT_ID}`,
        paymasterRpc:
            `https://rpc.zerodev.app/api/v2/paymaster/${import.meta.env.VITE_BASE_SEPOLIA_PROJECT_ID}`,
        tokens: tokenAddresses[baseSepolia.id]
    },
];

export const getBundlerRpc = (chainId: number) => {
    const defaultBundler = supportedChains.find((chain) => chain.id === chainId)
    if (defaultBundler) {
        return defaultBundler.bundlerRpc
    }

    throw new Error("Unsupported chain")
}

export const getChain = (chainId: number) => {
    const chain = supportedChains.find((chain) => chain.id === chainId)
    if (!chain) {
        throw new Error("Unsupported chain")
    }
    return chain
}

export const getPublicRpc = (chainId: number) => {
    const chain = supportedChains.find((chain) => chain.id === chainId)
    if (!chain) {
        throw new Error("Unsupported chain")
    }
    return chain.publicRpc
}