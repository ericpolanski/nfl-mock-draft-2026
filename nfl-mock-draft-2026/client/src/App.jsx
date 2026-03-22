import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home, DraftRoom } from './pages';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/draft" element={<DraftRoom />} />
    </Routes>
  );
}

export default App;
