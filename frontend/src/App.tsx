import React, { useState } from 'react';
import { Navbar, type AppTab } from './components/Navbar';
import { AnalyzerView } from './pages/AnalyzerView';
import { ReportScamPage } from './pages/ReportScamPage';
import { TrendsPage } from './pages/TrendsPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AuthPage } from './pages/AuthPage';
import { Shield } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col font-sans text-[#5B6678]">
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
      <footer className="border-t border-[#E6ECF3] bg-[#F6F8FB]/50 py-8 px-4 sm:px-6 transition-colors">
        <div className="max-w-[1120px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8A94A6]">
          <div className="flex items-center gap-2 text-[#0B1F3A] font-semibold">
            <div className="w-5 h-5 rounded-md bg-[#00A896]/10 flex items-center justify-center text-[#00A896]">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <span>HireShield</span>
          </div>

          <div className="text-center sm:text-right space-y-1">
            <p>Early-warning educational tool. Never an endorsement or absolute verdict.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;