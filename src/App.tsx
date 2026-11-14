import React, { useState } from 'react';
import { CollectlyProvider, useCollectly } from './context/CollectlyContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';

// Screens
import { DashboardScreen } from './components/screens/DashboardScreen';
import { AllSavesScreen } from './components/screens/AllSavesScreen';
import { RecentlySavedScreen } from './components/screens/RecentlySavedScreen';
import { CollectionsScreen } from './components/screens/CollectionsScreen';
import { CollectionDetailScreen } from './components/screens/CollectionDetailScreen';
import { CategoryManagementScreen } from './components/screens/CategoryManagementScreen';
import { CategoryDetailScreen } from './components/screens/CategoryDetailScreen';
import { ArchiveScreen } from './components/screens/ArchiveScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';

// Overlays & Panels
import { ItemDetailsPanel } from './components/items/ItemDetailsPanel';
import { AddItemModal } from './components/screens/AddItemModal';
import { SearchOverlayModal } from './components/screens/SearchOverlayModal';
import { AuthConnectModal } from './components/screens/AuthConnectModal';
import { OnboardingModal } from './components/screens/OnboardingModal';
import { AppleToastContainer } from './components/ui/AppleToastContainer';
import { clsx } from 'clsx';

const MainAppContent: React.FC = () => {
  const { activeScreen } = useCollectly();
  // Default to collapsed vertical rail dock (68px) to match Creative Cloud Desktop layout!
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Render current screen component
  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'all-saves':
        return <AllSavesScreen />;
      case 'recently-saved':
        return <RecentlySavedScreen />;
      case 'collections':
        return <CollectionsScreen />;
      case 'collection-detail':
        return <CollectionDetailScreen />;
      case 'categories':
        return <CategoryManagementScreen />;
      case 'category-detail':
        return <CategoryDetailScreen />;
      case 'archive':
        return <ArchiveScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--text-primary)] flex flex-col font-sans transition-colors duration-200">
      {/* Toast notifications */}
      <AppleToastContainer />

      {/* Sidebar: Side navbar on tablet & desktop, hidden on mobile */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileNavOpen}
        setIsMobileOpen={setIsMobileNavOpen}
      />

      {/* Main Content Area */}
      <div 
        className={clsx(
          "flex-1 flex flex-col min-w-0 transition-all duration-200",
          isSidebarCollapsed ? "md:pl-[68px]" : "md:pl-[220px]",
          "pb-20 md:pb-6" // Padding for mobile bottom nav on mobile, standard on tablet/desktop
        )}
      >
        {/* Header Toolbar (Window title bar, centered search pill, window controls) */}
        <Header 
          onToggleMobileNav={() => setIsMobileNavOpen(true)}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Dynamic Screen View */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-y-auto">
          {renderScreen()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar: Visible ONLY on mobile (< md) */}
      <MobileNav />

      {/* Side Inspector Details Panel */}
      <ItemDetailsPanel />

      {/* Save / Capture Modal (with Mandatory Category Prompt & Instagram support) */}
      <AddItemModal />

      {/* Spotlight Natural Language AI Search */}
      <SearchOverlayModal />

      {/* Google ID & Instagram ID Connect & Sync Modal */}
      <AuthConnectModal />

      {/* Mobile & First-Time Onboarding Experience */}
      <OnboardingModal />
    </div>
  );
};

export function App() {
  return (
    <CollectlyProvider>
      <MainAppContent />
    </CollectlyProvider>
  );
}

export default App;
