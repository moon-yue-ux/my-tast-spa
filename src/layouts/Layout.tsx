import Header from '@/components/common/Header';
import { memo } from 'react';
import { Outlet } from 'react-router-dom';
import { WalletProvider } from '@/hooks/useWallet'

const MainLayout = () => {
  return (
    <WalletProvider>
      <Header />
      <main className="mx-auto px-4">
        <Outlet />
      </main>
    </WalletProvider>
  );
};
// MainLayout.whyDidYouRender = true;
export default memo(MainLayout);
