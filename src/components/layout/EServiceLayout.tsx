import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { EServiceSidebar } from './EServiceSidebar';

export function EServiceLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <EServiceSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
