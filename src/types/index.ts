

// 网络类型定义
export interface Network {
  id: number
  name: string
  rpcUrl: string
  explorer: string
  currency: string
}

// 钱包连接状态
export interface WalletState {
  isConnected: boolean
  address?: string
  ensName?: string
  chainId?: number
  balance?: string
}


