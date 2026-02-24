import { Routes, Route } from 'react-router-dom';
import './App.jsx';

// Pages
import Home from './pages/Home';
import Play from './pages/Play.jsx';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play/:levelId" element={<Play />} />
      </Routes>
    </>
  );
}

export default App;
