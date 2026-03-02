import { Routes, Route } from 'react-router-dom';
import './App.jsx';

// Pages
import Home from './pages/Home';
import Play from './pages/Play.jsx';
import Header from './components/Header.jsx';
import Leaderboards from './pages/Leaderboards.jsx';
import About from './pages/About.jsx';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play/:levelId" element={<Play />} />
        <Route path="/leaderboards" element={<Leaderboards />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default App;
