import './App.css';
import { Route, Routes } from 'react-router-dom';

// COMPONENT
import Navigation from './components/Navigation';

// PAGES
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';
import Detail from './pages/Detail';

function App() {
  return (
    <div className="App">
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/detail/:id" element={<Detail />}></Route>
      </Routes>
    </div>
  );
}

export default App;
