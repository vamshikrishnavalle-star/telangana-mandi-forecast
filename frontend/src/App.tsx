import { HashRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/agfarm/Navbar';
import { Footer } from './components/agfarm/Footer';
import HomePage from './pages/HomePage';
import ForecastPage from './pages/ForecastPage';
import MarketComparisonPage from './pages/MarketComparisonPage';
import ModelPerformancePage from './pages/ModelPerformancePage';
import SeasonalPatternsPage from './pages/SeasonalPatternsPage';
import RecommendationPage from './pages/RecommendationPage';

export function App() {
  return (
    <LanguageProvider>
      <HashRouter>
        <div className="min-h-screen bg-surface flex flex-col font-sans selection:bg-brand-900 selection:text-white overflow-x-hidden">
          {/* AgFarm Navbar */}
          <Navbar />

          {/* Content Container */}
          <main className="flex-1 max-w-[1240px] w-full mx-auto px-3.5 sm:px-6 md:px-8 pt-3 pb-6 sm:pt-4 sm:pb-8 md:pt-5 md:pb-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/forecast" element={<ForecastPage />} />
              <Route path="/market-comparison" element={<MarketComparisonPage />} />
              <Route path="/models" element={<ModelPerformancePage />} />
              <Route path="/seasonal" element={<SeasonalPatternsPage />} />
              <Route path="/recommendation" element={<RecommendationPage />} />
            </Routes>
          </main>

          {/* AgFarm Footer */}
          <Footer />
        </div>
      </HashRouter>
    </LanguageProvider>
  );
}

export default App;
