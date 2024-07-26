import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import MyPage from './pages/MyPage';
import MakePlanRoom1 from './pages/MakePlanRoom1';
import MakePlanRoom2 from './pages/MakePlanRoom2';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import styled from 'styled-components';
import StartPlanRoom from './pages/StartPlanRoom';

const AppContainer = styled.div`
  display: flex;
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 20px;
`;

function App() {
  return (
    <Router>
      <Navbar />
      <AppContainer>
        <Sidebar />
        <ContentContainer>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/MyPage" element={<MyPage />} />
            <Route path="/MakePlanRoom1" element={<MakePlanRoom1 />} />
            <Route path="/MakePlanRoom2" element={<MakePlanRoom2 />} />
            <Route path="/StartPlanRoom" element={<StartPlanRoom />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </ContentContainer>
      </AppContainer>
    </Router>
  );
}

export default App;
