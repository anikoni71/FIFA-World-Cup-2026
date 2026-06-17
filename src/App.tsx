import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import TeamPage from '@/pages/TeamPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/team/:code" element={<TeamPage />} />
      </Routes>
    </BrowserRouter>
  );
}
