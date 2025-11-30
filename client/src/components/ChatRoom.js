import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import io from 'socket.io-client';
import {
  Box, Typography, TextField, IconButton, Avatar, AppBar, Toolbar,
  Paper, List, ListItem, ListItemAvatar, ListItemText, Dialog,
  DialogTitle, DialogContent, Button, Badge, Chip
} from '@mui/material';
import {
  ArrowBack, Send, Image, Info, Close
} from '@mui/icons-material';

function ChatRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState('');
  const [roomInfo, setRoomInfo] = useState(null);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

 useEffect(() => {
  if (!roomId) {
    console.error('❌ roomId is undefined');
    alert('채팅방 ID가 없습니다');
    navigate('/messages');
    return;
  }

  const token = localStorage.getItem("token");
  if (token) {
    const decoded = jwtDecode(token);
    setCurrentUserId(decoded.userId);
    
    fetchRoomInfo(roomId, decoded.userId);
    fetchMessages(roomId, decoded.userId);
    markAsRead(roomId, decoded.userId);
    
    const newSocket = io('http://localhost:3010', {
      auth: { token }
    });
    
    setSocket(newSocket);
    
    // 监听连接事件
    newSocket.on('connect', () => {
      console.log('✅✅✅ Socket 已连接，ID:', newSocket.id);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket 已断开');
    });

    // 加入房间
    console.log('📥 准备加入房间:', roomId);
    newSocket.emit('join_room', { roomId: parseInt(roomId), userId: decoded.userId });
    
    // 监听新消息 - 重点！
    newSocket.on('new_message', (message) => {
      console.log('==================== 收到新消息 ====================');
      console.log('📨 消息类型:', message.messageType);
      console.log('📨 消息内容:', message.messageType === 'text' ? message.content : '图片');
      console.log('📨 完整消息:', JSON.stringify(message, null, 2));
      console.log('====================================================\n');
      
      setMessages(prev => {
        console.log('🔄 更新消息列表: 旧数量', prev.length, '→ 新数量', prev.length + 1);
        return [...prev, message];
      });
      markAsRead(roomId, decoded.userId);
    });
    
    return () => {
      console.log('🚪 离开房间:', roomId);
      newSocket.emit('leave_room', { roomId: parseInt(roomId) });
      newSocket.disconnect();
    };
  } else {
    alert("로그인 후 이용해주세요.");
    navigate("/");
  }
}, [roomId, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchRoomInfo = (roomId, userId) => {
    fetch(`http://localhost:3010/message/rooms/${roomId}?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.result === 'success') {
          setRoomInfo(data.room);
          setMembers(data.members || []);
        }
      })
      .catch(err => {
        console.error('Failed to fetch room info:', err);
      });
  };

  const fetchMessages = (roomId, userId) => {
    fetch(`http://localhost:3010/message/rooms/${roomId}/messages?userId=${userId}&limit=100`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.result === 'success') {
          setMessages(data.messages || []);
        }
      })
      .catch(err => {
        console.error('Failed to fetch messages:', err);
      });
  };

  const markAsRead = (roomId, userId) => {
    if (!roomId || !userId) {
      return;
    }

    fetch(`http://localhost:3010/message/rooms/${roomId}/read`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ userId })
    }).catch(err => console.error('Failed to mark as read:', err));
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      roomId: parseInt(roomId),
      senderId: currentUserId,
      content: newMessage
    };

    socket.emit('send_message', messageData);
    setNewMessage('');
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && socket) {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('senderId', currentUserId);

      fetch(`http://localhost:3010/message/rooms/${roomId}/messages/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          if (data.result === 'success') {
            // 后端已经通过 Socket.IO 广播了，这里不需要再 emit
            console.log('✅ 图片上传成功');
          }
        })
        .catch(err => {
          console.error('Failed to send image:', err);
          alert('이미지 전송 실패');
        });
    }
  };

  const formatMessageTime = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getRoomDisplayName = () => {
    if (!roomInfo) return '';
    if (roomInfo.roomType === 'group') {
      return roomInfo.roomName || `${roomInfo.groupName} 그룹채팅`;
    }
    const otherMember = members.find(m => m.userId !== currentUserId);
    return otherMember?.nickname || '채팅';
  };

  const handleUserClick = (userId) => {
    if (userId !== currentUserId) {
      navigate(`/profile/${userId}`);
    }
  };

  if (!roomId) {
    return (
      <Box sx={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 2
      }}>
        <Typography variant="h6" color="error">
          채팅방을 찾을 수 없습니다
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/messages')}
          sx={{ bgcolor: '#96ACC1' }}
        >
          메시지 목록으로
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F5F5F5' }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <Toolbar>
          <IconButton
            edge="start"
            onClick={() => navigate('/messages')}
            sx={{ mr: 2, color: '#333' }}
          >
            <ArrowBack />
          </IconButton>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ color: '#333', fontWeight: 600 }}>
              {getRoomDisplayName()}
            </Typography>
            {roomInfo?.district && (
              <Typography variant="caption" sx={{ color: '#96ACC1' }}>
                {roomInfo.district}
              </Typography>
            )}
          </Box>

          <IconButton
            onClick={() => setInfoDialogOpen(true)}
            sx={{ color: '#333' }}
          >
            <Badge badgeContent={members.length} color="primary">
              <Info />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          bgcolor: '#F5F5F5'
        }}
      >
        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          {messages.map((message, index) => {
            const isOwnMessage = message.senderId === currentUserId;
            const showAvatar = !isOwnMessage && (
              index === 0 ||
              messages[index - 1].senderId !== message.senderId
            );

            return (
              <Box
                key={message.messageId}
                sx={{
                  display: 'flex',
                  justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                  mb: showAvatar ? 2 : 0.5,
                  alignItems: 'flex-end'
                }}
              >
                {!isOwnMessage && showAvatar && (
                  <Avatar
                    src={message.profileImg}
                    onClick={() => handleUserClick(message.senderId)}
                    sx={{
                      width: 32,
                      height: 32,
                      mr: 1,
                      cursor: 'pointer',
                      bgcolor: '#96ACC1'
                    }}
                  >
                    {message.nickname?.charAt(0).toUpperCase()}
                  </Avatar>
                )}

                {!isOwnMessage && !showAvatar && (
                  <Box sx={{ width: 32, mr: 1 }} />
                )}

                <Box sx={{ maxWidth: '70%' }}>
                  {!isOwnMessage && showAvatar && (
                    <Typography
                      variant="caption"
                      sx={{
                        ml: 1,
                        color: '#666',
                        fontWeight: 500,
                        cursor: 'pointer'
                      }}
                      onClick={() => handleUserClick(message.senderId)}
                    >
                      {message.nickname}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.5 }}>
                    {isOwnMessage && (
                      <Typography
                        variant="caption"
                        sx={{ color: '#999', fontSize: '10px' }}
                      >
                        {formatMessageTime(message.cdatetime)}
                      </Typography>
                    )}

                    <Paper
                      sx={{
                        p: message.messageType === 'image' ? 0.5 : 1.5,
                        bgcolor: isOwnMessage ? '#96ACC1' : '#fff',
                        color: isOwnMessage ? '#fff' : '#333',
                        borderRadius: isOwnMessage ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        wordBreak: 'break-word'
                      }}
                    >
                      {message.messageType === 'text' ? (
                        <Typography variant="body2">
                          {message.content}
                        </Typography>
                      ) : (
                        <img
                          src={message.content}
                          alt="chat"
                          style={{
                            maxWidth: '300px',
                            maxHeight: '300px',
                            borderRadius: '12px',
                            display: 'block'
                          }}
                        />
                      )}
                    </Paper>

                    {!isOwnMessage && (
                      <Typography
                        variant="caption"
                        sx={{ color: '#999', fontSize: '10px' }}
                      >
                        {formatMessageTime(message.cdatetime)}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            );
          })}
          <div ref={messagesEndRef} />
        </Box>
      </Box>

      {/* Input Area */}
      <Paper
        elevation={3}
        sx={{
          p: 2,
          bgcolor: '#fff',
          borderTop: '1px solid #eee'
        }}
      >
        <Box sx={{ maxWidth: '800px', mx: 'auto', display: 'flex', gap: 1 }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageSelect}
          />
          
          <IconButton
            onClick={() => fileInputRef.current?.click()}
            sx={{ color: '#96ACC1' }}
          >
            <Image />
          </IconButton>

          <TextField
            fullWidth
            placeholder="메시지를 입력하세요"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            multiline
            maxRows={4}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                bgcolor: '#F5F5F5'
              }
            }}
          />

          <IconButton
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            sx={{
              bgcolor: '#96ACC1',
              color: '#fff',
              '&:hover': { bgcolor: '#7A94A8' },
              '&:disabled': { bgcolor: '#ccc' }
            }}
          >
            <Send />
          </IconButton>
        </Box>
      </Paper>

      {/* Room Info Dialog */}
      <Dialog
        open={infoDialogOpen}
        onClose={() => setInfoDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">채팅방 정보</Typography>
          <IconButton onClick={() => setInfoDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ color: '#666', mb: 1 }}>
              채팅방 이름
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {getRoomDisplayName()}
            </Typography>
          </Box>

          {roomInfo?.groupName && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ color: '#666', mb: 1 }}>
                팀 정보
              </Typography>
              <Chip
                label={roomInfo.groupName}
                onClick={() => navigate(`/group/${roomInfo.relatedGroupId}`)}
                sx={{ cursor: 'pointer' }}
              />
            </Box>
          )}

          <Typography variant="subtitle2" sx={{ color: '#666', mb: 2 }}>
            멤버 ({members.length})
          </Typography>
          <List>
            {members.map((member) => (
              <ListItem
                key={member.userId}
                button
                onClick={() => {
                  setInfoDialogOpen(false);
                  handleUserClick(member.userId);
                }}
              >
                <ListItemAvatar>
                  <Avatar src={member.profileImg} sx={{ bgcolor: '#96ACC1' }}>
                    {member.nickname?.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={member.nickname}
                  secondary={member.userId === currentUserId ? '나' : `@${member.userId}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default ChatRoom;