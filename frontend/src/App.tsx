import React, { useState } from 'react';
import './App.css';
import { Navbar, type AppTab } from './components/Navbar';
import { AnalyzerView } from './pages/AnalyzerView';
import { ReportScamPage } from './pages/ReportScamPage';
import { TrendsPage } from './pages/TrendsPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AuthPage } from './pages/AuthPage';
import { ArrowUpRight, BookOpen, HeartHandshake, Mail } from 'lucide-react';
import { BrandMark } from './components/BrandMark';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<AppTab>('analyze');
  const [reportInitialText, setReportInitialText] = useState<string>('');

  const handleOpenReport = (textToReport: string) => {
    setReportInitialText(textToReport);
    setCurrentTab('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckOfferClick = () => {
    setCurrentTab('analyze');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFooterNavigation = (tab: AppTab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-shell">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onCheckOfferClick={handleCheckOfferClick}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'analyze' && (
          <AnalyzerView onOpenReportModal={handleOpenReport} />
        )}
        {currentTab === 'how-it-works' && <HowItWorksPage />}
        {currentTab === 'report' && (
          <ReportScamPage
            initialText={reportInitialText}
            onBackToAnalyzer={() => setCurrentTab('analyze')}
          />
        )}
        {currentTab === 'trends' && <TrendsPage />}
        {currentTab === 'auth' && <AuthPage />}
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand-column">
            <button
              className="brand-button footer-brand"
              onClick={() => handleFooterNavigation('analyze')}
              aria-label="HireShield Home"
            >
              <BrandMark className="brand-mark-footer" />
              <span className="brand-wordmark">Hire<span>Shield</span></span>
            </button>
            <p className="footer-intro">Your career is a big deal. Learn to spot sketchy offers, protect your information, and make your next move with confidence.</p>
            <div className="footer-community"><HeartHandshake size={17} /> Built for the next generation of job seekers</div>
          </div>
          <div className="footer-link-column">
            <h2>Explore</h2>
            <button onClick={() => handleFooterNavigation('analyze')}>Offer checker <ArrowUpRight size={14} /></button>
            <button onClick={() => handleFooterNavigation('how-it-works')}>How it works <BookOpen size={14} /></button>
            <button onClick={() => handleFooterNavigation('trends')}>Scam trends <ArrowUpRight size={14} /></button>
          </div>
          <div className="footer-link-column">
            <h2>Stay in the know</h2>
            <p>Share suspicious job messages with the community to help other students stay safer.</p>
            <button onClick={() => handleFooterNavigation('report')}>Report a suspicious offer <ArrowUpRight size={14} /></button>
            <span className="footer-email"><Mail size={14} /> Free, friendly, and here to help.</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 HireShield · A safer start to your career.</span>
          <span>Educational early warning only—not an endorsement or a verdict.</span>
        </div>
      </footer>
    </div>
  );
};

export default App;