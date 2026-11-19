import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import GlassyDashboard from './components/ui/GlassyDashboard';
import HomePage from './pages/HomePage';
import ForecastPage from './pages/ForecastPage';
import RecommendationPage from './pages/RecommendationPage';
import MarketComparisonPage from './pages/MarketComparisonPage';
import ModelPerformancePage from './pages/ModelPerformancePage';
import SeasonalPatternsPage from './pages/SeasonalPatternsPage';

export function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <GlassyDashboard>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/forecast" element={<ForecastPage />} />
            <Route path="/recommendation" element={<RecommendationPage />} />
            <Route path="/market-comparison" element={<MarketComparisonPage />} />
            <Route path="/model-performance" element={<ModelPerformancePage />} />
            <Route path="/seasonal-patterns" element={<SeasonalPatternsPage />} />
          </Routes>
        </GlassyDashboard>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
