import React, { useState } from 'react';
import { CollectlyProvider, useCollectly } from './context/CollectlyContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';

// Screens
import { DashboardScreen } from './components/screens/DashboardScreen';
import { AllSavesScreen } from './components/screens/AllSavesScreen';
import { ReelsScreen } from './components/screens/ReelsScreen';
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
import { BiometricScanModal } from './components/auth/BiometricScanModal';
import { AppleToastContainer } from './components/ui/AppleToastContainer';
import { ScreenId } from './types';
import { clsx } from 'clsx';

const MainAppContent: React.FC = () => {
  const { activeScreen, setActiveScreen } = useCollectly();
  // Default to collapsed vertical rail dock (68px) to match Creative Cloud Desktop layout!
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Swipe gesture state for Instagram-style horizontal page transitions
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const swipeScreens: ScreenId[] = ['dashboard', 'all-saves', 'reels', 'settings'];

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.touch-pan-x, input, textarea, select, nav')) return;
    if (e.touches.length === 1) {
      setTouchStartX(e.touches[0].clientX);
      setTouchStartY(e.touches[0].clientY);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = endX - touchStartX;
    const diffY = endY - touchStartY;

    // Must be predominantly horizontal gesture (> 45px)
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.3) {
      const currentIndex = swipeScreens.indexOf(activeScreen);
      if (currentIndex !== -1) {
        if (diffX < 0 && currentIndex < swipeScreens.length - 1) {
          // Swipe left -> Next screen
          setSwipeDirection('left');
          setActiveScreen(swipeScreens[currentIndex + 1]);
        } else if (diffX > 0 && currentIndex > 0) {
          // Swipe right -> Previous screen
          setSwipeDirection('right');
          setActiveScreen(swipeScreens[currentIndex - 1]);
        }
      }
    }

    setTouchStartX(null);
    setTouchStartY(null);
  };

  // Render current screen component
  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'all-saves':
        return <AllSavesScreen />;
      case 'reels':
        return <ReelsScreen />;
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
    <div className="relative min-h-screen bg-[var(--app-bg)] text-[var(--text-primary)] flex flex-col font-sans transition-colors duration-200">
      {/* Dynamic Instagram Liquid Ambient Glow Mesh */}
      <div className="insta-ambient-mesh" />

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
          "relative z-10 flex-1 flex flex-col min-w-0 transition-all duration-200",
          isSidebarCollapsed ? "md:pl-[68px]" : "md:pl-[220px]",
          "pb-24 md:pb-6" // Padding for floating mobile dock
        )}
      >
        {/* Header Toolbar (Window title bar, centered search pill, window controls) */}
        <Header 
          onToggleMobileNav={() => setIsMobileNavOpen(true)}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Dynamic Screen View with Instagram Swipe Left / Right Navigation */}
        <main 
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          key={activeScreen}
          className={clsx(
            "flex-1 p-3 sm:p-5 lg:p-6 overflow-y-auto",
            swipeDirection === 'left' && "animate-in slide-in-from-right-4 fade-in duration-200",
            swipeDirection === 'right' && "animate-in slide-in-from-left-4 fade-in duration-200"
          )}
        >
          {renderScreen()}
        </main>
      </div>

      {/* Mobile Floating Glass Pill Dock (Pixel-perfect to user reference screenshots) */}
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

      {/* Biometric Fingerprint Sensor Scan Modal */}
      <BiometricScanModal />
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
