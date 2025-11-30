import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
  Box, Typography, List, ListItem, ListItemAvatar, ListItemText,
  Avatar, Badge, Divider, TextField, InputAdornment, IconButton
} from '@mui/material';
import { Search, Group, Person } from '@mui/icons-material';

function Messages() {
  const [rooms, setRooms] = useState([]);
  const [currentUserId, setCurrentUserId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
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
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.result === 'success') {
          setRooms(data.rooms || []);
        }
      })
      .catch(err => {
        console.error('Failed to fetch rooms:', err);
      });
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
    
    return msgDate.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoomDisplayName = (room) => {
    if (room.roomType === 'group') {
      return room.roomName || `${room.groupName} 그룹채팅`;
    }
    // 私聊显示对方昵称
    return room.otherUserNickname || room.roomName || '채팅';
  };

  const filteredRooms = rooms.filter(room => {
    const displayName = getRoomDisplayName(room).toLowerCase();
    return displayName.includes(searchQuery.toLowerCase());
  });

  return (
    <Box sx={{ bgcolor: '#F5F5F5', minHeight: '100vh', pb: 4 }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: '#fff',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1A1A1A', mb: 2 }}>
          메시지
        </Typography>
        
        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="채팅방 검색"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#999' }} />
              </InputAdornment>
            ),
            sx: {
              borderRadius: '12px',
              bgcolor: '#F5F5F5'
            }
          }}
        />
      </Box>

      {/* Chat Rooms List */}
      <Box sx={{ maxWidth: '800px', mx: 'auto', mt: 2 }}>
        {filteredRooms.length > 0 ? (
          <List sx={{ bgcolor: '#fff', borderRadius: '16px', overflow: 'hidden' }}>
            {filteredRooms.map((room, index) => (
              <React.Fragment key={room.roomId}>
                <ListItem
                  onClick={() => handleRoomClick(room.roomId)}
                  sx={{
                    py: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'rgba(150, 172, 193, 0.08)',
                      transform: 'translateX(4px)',
                    },
                    '&:active': {
                      transform: 'scale(0.98)',
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      badgeContent={room.unreadCount}
                      color="error"
                      overlap="circular"
                      sx={{
                        '& .MuiBadge-badge': {
                          fontSize: '11px',
                          height: '20px',
                          minWidth: '20px',
                          borderRadius: '10px'
                        }
                      }}
                    >
                      <Avatar
                        src={room.roomType === 'private' ? room.otherUserProfileImg : null}
                        sx={{
                          bgcolor: room.roomType === 'group' ? '#96ACC1' : '#FFB800',
                          width: 50,
                          height: 50
                        }}
                      >
                        {room.roomType === 'group' ? (
                          <Group />
                        ) : (
                          room.otherUserNickname?.charAt(0).toUpperCase() || <Person />
                        )}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: room.unreadCount > 0 ? 600 : 500,
                            color: room.unreadCount > 0 ? '#333' : '#666'
                          }}
                        >
                          {getRoomDisplayName(room)}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: '#999', ml: 1, flexShrink: 0 }}
                        >
                          {formatTime(room.lastMessageTime)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box>
                        {room.district && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#96ACC1',
                              bgcolor: '#E8F0F7',
                              px: 1,
                              py: 0.25,
                              borderRadius: '4px',
                              display: 'inline-block',
                              mb: 0.5
                            }}
                          >
                            {room.district}
                          </Typography>
                        )}
                        <Typography
                          variant="body2"
                          sx={{
                            color: room.unreadCount > 0 ? '#333' : '#999',
                            fontWeight: room.unreadCount > 0 ? 500 : 400,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
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
          <Box
            sx={{
              bgcolor: '#fff',
              borderRadius: '16px',
              p: 6,
              textAlign: 'center'
            }}
          >
            <Typography variant="h6" sx={{ color: '#999', mb: 1 }}>
              {searchQuery ? '검색 결과가 없습니다' : '채팅방이 없습니다'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#CCC' }}>
              {searchQuery ? '다른 검색어로 시도해보세요' : '팀에 가입하거나 친구에게 메시지를 보내보세요'}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Messages;