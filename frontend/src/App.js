import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import VideoPlayer from './pages/VideoPlayer';
import CategoryPage from './pages/CategoryPage';
import Trending from './pages/Trending';
import WatchLater from './pages/WatchLater';
import LikedVideos from './pages/LikedVideos';
import AllCategories from './pages/AllCategories';
import Admin from './pages/Admin';
import InfoPage from './pages/InfoPage';
import AutoplayPage from './pages/AutoplayPage';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { Toaster } from './components/ui/sonner';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/video/:id" element={<VideoPlayer />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/watch-later" element={<WatchLater />} />
              <Route path="/liked" element={<LikedVideos />} />
              <Route path="/categories" element={<AllCategories />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/autoplay" element={<AutoplayPage />} />
              <Route path="/about" element={<InfoPage slug="about" />} />
              <Route path="/disclaimer" element={<InfoPage slug="disclaimer" />} />
              <Route path="/privacy" element={<InfoPage slug="privacy" />} />
              <Route path="/terms" element={<InfoPage slug="terms" />} />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;