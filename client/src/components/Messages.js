import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
  Box, Typography, List, ListItem, ListItemAvatar, ListItemText,
  Avatar, Badge, Divider, TextField, InputAdornment, IconButton,
  Tabs, Tab, Chip, Button
} from '@mui/material';
import { Search, Group, Person, Chat, Close } from '@mui/icons-material';

function Messages() {
  const [rooms, setRooms] = useState([]);
  const [currentUserId, setCurrentUserId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchUsers, setSearchUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setCurrentUserId(decoded.userId);
      fetchRooms(decoded.userId);
    } else {
      alert("로그인 후 이용해주세요.");
      navigate("/");
    }
  }, [navigate]);

  const fetchRooms = (userId) => {
    fetch(`http://localhost:3010/message/rooms?userId=${userId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.result === 'success') {
          setRooms(data.rooms || []);
        }
      })
      .catch(err => console.error('Failed to fetch rooms:', err));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setIsSearching(false);
      setSearchUsers([]);
      return;
    }

    setIsSearching(true);

    fetch(`http://localhost:3010/message/search/users?query=${query}&currentUserId=${currentUserId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.result === 'success') {
          setSearchUsers(data.users || []);
        }
      })
      .catch(err => console.error('Failed to search users:', err));
  };

  const handleUserClick = (user) => {
    if (user.existingRoomId) {
      navigate(`/messages/${user.existingRoomId}`);
    } else {
      fetch('http://localhost:3010/message/rooms/private', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId1: currentUserId, userId2: user.userId })
      })
        .then(res => res.json())
        .then(data => {
          if (data.result === 'success') {
            navigate(`/messages/${data.roomId}`);
          }
        })
        .catch(err => alert('채팅방 생성에 실패했습니다'));
    }
  };

  const handleRoomClick = (roomId) => {
    navigate(`/messages/${roomId}`);
  };

  const formatTime = (datetime) => {
    if (!datetime) return '';
    const now = new Date();
    const msgDate = new Date(datetime);
    const diffMs = now - msgDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return '방금';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return msgDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
  };

  const getRoomDisplayName = (room) => {
    if (room.roomType === 'group') {
      return room.roomName || `${room.groupName} 그룹채팅`;
    }
    return room.otherUserNickname || room.roomName || '채팅';
  };

  const filteredRooms = rooms.filter(room => {
    const displayName = getRoomDisplayName(room).toLowerCase();
    return displayName.includes(searchQuery.toLowerCase());
  });

  return (
    <Box sx={{ bgcolor: '#F5F5F5', minHeight: '100vh', pb: 4 }}>
      <Box sx={{ bgcolor: '#fff', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1A1A1A', mb: 2 }}>메시지</Typography>
        
        <TextField
          fullWidth
          placeholder="사용자 검색..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search sx={{ color: '#999' }} /></InputAdornment>,
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => { setSearchQuery(''); setIsSearching(false); setSearchUsers([]); }}>
                  <Close sx={{ fontSize: 18 }} />
                </IconButton>
              </InputAdornment>
            ),
            sx: { borderRadius: '12px', bgcolor: '#F5F5F5' }
          }}
        />
      </Box>

      <Box sx={{ maxWidth: '800px', mx: 'auto', mt: 2 }}>
        {isSearching ? (
          <Box sx={{ bgcolor: '#fff', borderRadius: '16px', overflow: 'hidden' }}>
            {searchUsers.length > 0 ? (
              <List>
                {searchUsers.map((user, index) => (
                  <React.Fragment key={user.userId}>
                    <ListItem onClick={() => handleUserClick(user)} sx={{ py: 2, cursor: 'pointer', '&:hover': { bgcolor: 'rgba(150, 172, 193, 0.08)' } }}>
                      <ListItemAvatar>
                        <Avatar src={user.profileImg} sx={{ bgcolor: '#96ACC1', width: 50, height: 50 }}>
                          {user.nickname?.charAt(0).toUpperCase() || <Person />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Typography variant="subtitle1" sx={{ fontWeight: 500 }}>{user.nickname}</Typography>}
                        secondary={<Typography variant="body2" sx={{ color: '#999' }}>{user.addr || user.userId}</Typography>}
                      />
                      <Button size="small" startIcon={<Chat />} sx={{ bgcolor: '#96ACC1', color: '#fff', borderRadius: '8px', textTransform: 'none', '&:hover': { bgcolor: '#7A94A8' } }}>
                        {user.existingRoomId ? '열기' : '채팅'}
                      </Button>
                    </ListItem>
                    {index < searchUsers.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 6, textAlign: 'center' }}><Typography variant="body2" sx={{ color: '#999' }}>검색 결과가 없습니다</Typography></Box>
            )}
          </Box>
        ) : (
          filteredRooms.length > 0 ? (
            <List sx={{ bgcolor: '#fff', borderRadius: '16px', overflow: 'hidden' }}>
              {filteredRooms.map((room, index) => (
                <React.Fragment key={room.roomId}>
                  <ListItem onClick={() => handleRoomClick(room.roomId)} sx={{ py: 2, cursor: 'pointer', '&:hover': { bgcolor: 'rgba(150, 172, 193, 0.08)', transform: 'translateX(4px)' } }}>
                    <ListItemAvatar>
                      <Badge badgeContent={room.unreadCount} color="error">
                        <Avatar src={room.roomType === 'private' ? room.otherUserProfileImg : null} sx={{ bgcolor: room.roomType === 'group' ? '#96ACC1' : '#FFB800', width: 50, height: 50 }}>
                          {room.roomType === 'group' ? <Group /> : (room.otherUserNickname?.charAt(0).toUpperCase() || <Person />)}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: room.unreadCount > 0 ? 600 : 500, color: room.unreadCount > 0 ? '#333' : '#666' }}>
                            {getRoomDisplayName(room)}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#999', ml: 1, flexShrink: 0 }}>{formatTime(room.lastMessageTime)}</Typography>
                        </Box>
                      }
                      secondary={
                        <Box>
                          {room.district && <Typography variant="caption" sx={{ color: '#96ACC1', bgcolor: '#E8F0F7', px: 1, py: 0.25, borderRadius: '4px', display: 'inline-block', mb: 0.5 }}>{room.district}</Typography>}
                          <Typography variant="body2" sx={{ color: room.unreadCount > 0 ? '#333' : '#999', fontWeight: room.unreadCount > 0 ? 500 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {room.lastMessage || '아직 메시지가 없습니다'}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < filteredRooms.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box sx={{ bgcolor: '#fff', borderRadius: '16px', p: 6, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#999', mb: 1 }}>채팅방이 없습니다</Typography>
              <Typography variant="body2" sx={{ color: '#CCC' }}>팀에 가입하거나 친구에게 메시지를 보내보세요</Typography>
            </Box>
          )
        )}
      </Box>
    </Box>
  );
}

export default Messages;