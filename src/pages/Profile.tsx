import { useEffect, useMemo, useState } from 'react';
import { useWallet } from '@/hooks/useWallet'
import { useReadContract, useSignMessage } from 'wagmi';
import { formatUnits } from 'viem';
import { MOON_COIN_ABI, MOON_ADDRESS } from '@/abi/moonCoin';


export default function Profile() {
  const { walletState } = useWallet();


  // 读取 MOON 余额
  const { data: moonBalData, isFetching: fetchingMoon } = useReadContract({
    address: MOON_ADDRESS as `0x${string}`,
    abi: MOON_COIN_ABI,
    functionName: 'balanceOf',
    args: walletState.address ? [walletState.address as `0x${string}`] : undefined,
    query: { enabled: !!walletState.address },
  });
  const moonBalance = useMemo(() => {
    try { return moonBalData ? Number(formatUnits(moonBalData as bigint, 18)).toFixed(6) : '-'; }
    catch { return '-'; }
  }, [moonBalData]);


  const addressShort = useMemo(() => {
    const a = walletState.address || '';
    return a ? `${a.slice(0,6)}…${a.slice(-4)}` : '未连接';
  }, [walletState.address]);

  return (
    <section>
      <h1 className="text-3xl font-bold tracking-tight mb-6">个人中心</h1>

      {/* 顶部钱包信息 */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-6">
        <div className="text-sm text-slate-500">地址</div>
        <div className="font-mono break-all mb-4 text-slate-800">{walletState.address ?? '未连接'}</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
            <div className="text-xs text-slate-500">ChainId</div>
            <div className="font-semibold">{walletState.chainId ?? '-'}</div>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
            <div className="text-xs text-slate-500">ETH 余额</div>
            <div className="font-semibold">{walletState.balance ?? '-'}</div>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
            <div className="text-xs text-slate-500">MOON 余额</div>
            <div className="font-semibold">{fetchingMoon ? '读取中…' : moonBalance}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
