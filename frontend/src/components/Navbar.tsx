import React, { useState } from 'react';
import { Shield, ShieldAlert, BarChart3, HelpCircle, Menu, X, ArrowUpRight } from 'lucide-react';
import { BrandMark } from './BrandMark';

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <button
          onClick={() => handleNavClick('analyze')}
          className="brand-button"
          aria-label="HireShield Home"
        >
          <BrandMark className="brand-mark-header" />
          <span className="brand-wordmark">
            Hire<span>Shield</span>
            <small>CAREER SAFETY, LEVELLED UP</small>
          </span>
        </button>

        {/* Desktop Nav Items */}
        <nav className="desktop-navigation" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`navigation-link${isActive ? ' is-active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="navigation-icon" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div className="desktop-actions">
          <button
            onClick={() => handleNavClick('auth')}
            className={`sign-in-link${currentTab === 'auth' ? ' is-active' : ''}`}
          >
            Sign in
          </button>
          <button
            onClick={onCheckOfferClick}
            className="primary-button nav-cta"
          >
            <span>Check an offer</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-menu-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`mobile-navigation-link${isActive ? ' is-active' : ''}`}
              >
                <Icon className="navigation-icon" />
                {item.label}
              </button>
            );
          })}
          <button
            onClick={() => handleNavClick('auth')}
            className="mobile-navigation-link"
          >
            Sign in
          </button>
          <div className="pt-2">
            <button
              onClick={() => {
                onCheckOfferClick();
                setMobileMenuOpen(false);
              }}
              className="primary-button mobile-cta"
            >
              Check an offer
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
