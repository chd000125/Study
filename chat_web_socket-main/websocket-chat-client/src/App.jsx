import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ChatRoom from "./components/ChatRoom.jsx";
import Home from "./pages/Home.jsx";
import StudyGroupDetail from "./pages/StudyGroupDetail.jsx"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/main/:groupId" element={<StudyGroupDetail />} />
    </Routes>
  );
};

export default App;
