import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Login from './components/Login';
import Join from './components/Join'; // Join으로 변경
import Feed from './components/Feed';
import Register from './components/Register';
import MyPage from './components/MyPage';
import Menu from './components/Menu'; // Menu로 변경
import Mui from './components/Mui';

import Notifications from './components/Notifications';
import Groups from './components/Group';
import GroupDetail from './components/GroupDetail';
import CreateGroup from './components/CreateGroup';
import Activity from './components/Activity';
import GroupApplications from './components/GroupApplications';

import Messages from './components/Messages';
import ChatRoom from './components/ChatRoom';
import ActivityHistory from './components/ActivityHistory';
import FeedEdit from './components/FeedEdit';
import JoinedGroups from './components/JoinedGroups'; 







function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/' || location.pathname === '/join';

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {!isAuthPage && <Menu />} {/* 로그인과 회원가입 페이지가 아닐 때만 Menu 렌더링 */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/groups" element={<Groups />} />  {/* ✨ 添加这一行 */}
          <Route path="/join" element={<Join />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/profile/:userId" element={<MyPage />} />
          <Route path="/mui" element={<Mui />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/group" element={<Groups />} />
          <Route path="/group/create" element={<CreateGroup />} />
          <Route path="/group/:groupId" element={<GroupDetail />} />
          <Route path="/group/:groupId/activity" element={<Activity />} />
          <Route path="/group/:groupId/applications" element={<GroupApplications />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:roomId" element={<ChatRoom />} />
          <Route path="/activity-history" element={<ActivityHistory />} />
          <Route path="/feed/edit/:feedId" element={<FeedEdit />} />
          <Route path="/my/joined-groups" element={<JoinedGroups />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
