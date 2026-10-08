import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import ConsoleLayout from './components/console/ConsoleLayout';
import { AnalysisProvider } from './context/AnalysisContext';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');

  return (
    <AnalysisProvider>
      {currentView === 'landing' ? (
        <LandingPage onOpenWorkbench={() => setCurrentView('workbench')} />
      ) : (
        <ConsoleLayout onReturnToLanding={() => setCurrentView('landing')} />
      )}
    </AnalysisProvider>
  );
}
