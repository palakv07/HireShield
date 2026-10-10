import React, { useState } from 'react';
import { Shield, ShieldAlert, BarChart3, HelpCircle, Menu, X, ArrowUpRight } from 'lucide-react';

export type AppTab = 'analyze' | 'how-it-works' | 'report' | 'trends' | 'auth';

interface NavbarProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  onCheckOfferClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onCheckOfferClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: AppTab; label: string; icon: typeof Shield }[] = [
    { id: 'analyze', label: 'Analyze', icon: Shield },
    { id: 'how-it-works', label: 'How it works', icon: HelpCircle },
    { id: 'report', label: 'Report a scam', icon: ShieldAlert },
    { id: 'trends', label: 'Trends', icon: BarChart3 },
  ];

  const handleNavClick = (tabId: AppTab) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E6ECF3] transition-colors">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('analyze')}
          className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A896] rounded-lg p-1"
          aria-label="HireShield Home"
        >
          <div>
            <span className="text-[19px] font-bold tracking-tight text-[#0B1F3A] flex items-center gap-1.5">
              HireShield
            </span>
          </div>
        </button>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                  isActive
                    ? 'text-[#0B1F3A] bg-[#F6F8FB] font-semibold'
                    : 'text-[#5B6678] hover:text-[#0B1F3A] hover:bg-[#F6F8FB]/60'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#00A896]' : 'text-[#8A94A6]'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => handleNavClick('auth')}
            className={`px-3 py-2 text-sm font-semibold transition-colors ${
              currentTab === 'auth' ? 'text-[#00A896]' : 'text-[#5B6678] hover:text-[#0B1F3A]'
            }`}
          >
            Sign in
          </button>
          <button
            onClick={onCheckOfferClick}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#00A896] hover:bg-[#007F73] text-white text-sm font-semibold rounded-lg shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A896] focus-visible:ring-offset-2 active:scale-[0.98]"
          >
            <span>Check an offer</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#5B6678] hover:text-[#0B1F3A] hover:bg-[#F6F8FB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A896]"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E6ECF3] bg-white px-4 pt-2 pb-4 space-y-1 shadow-md">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg ${
                  isActive
                    ? 'text-[#0B1F3A] bg-[#F6F8FB] font-semibold'
                    : 'text-[#5B6678] hover:bg-[#F6F8FB]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#00A896]' : 'text-[#8A94A6]'}`} />
                {item.label}
              </button>
            );
          })}
          <button
            onClick={() => handleNavClick('auth')}
            className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-[#0B1F3A] hover:bg-[#F6F8FB]"
          >
            Sign in
          </button>
          <div className="pt-2">
            <button
              onClick={() => {
                onCheckOfferClick();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#00A896] text-white text-sm font-semibold rounded-lg"
            >
              Check an offer
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
