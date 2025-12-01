import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Toolbar,
  ListItemIcon,
  Box,
  Badge,
  ListItemButton,
  Avatar,
  Divider,
  Button
} from '@mui/material';
import {
  Home,
  Add,
  AccountCircle,
  Notifications,
  Message,
  Group,
  Logout
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'; // ⭐ 添加这行

function Menu() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 获取当前用户信息
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // 直接从 token 中获取用户信息
        setCurrentUser({
          userId: decoded.userId,
          nickname: decoded.nickName
        });
        // 获取完整用户信息（包括头像）
        fetchUserInfo(decoded.userId);
        // 获取未读通知数量
        fetchUnreadNotifications(decoded.userId);
      } catch (error) {
        console.error('Token decode error:', error);
        // Token 无效，跳转到登录页
        navigate('/');
      }
    }
  }, [navigate]);

  const fetchUserInfo = (userId) => {
    fetch(`http://localhost:3010/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(err => console.error(err));
  };

  const fetchUnreadNotifications = (userId) => {
    fetch(`http://localhost:3010/notification/unread-count?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setUnreadCount(data.count || 0);
      })
      .catch(err => console.error(err));
  };

  // ⭐ Logout 逻辑
  const handleLogout = () => {
    // 清除本地存储的 token
    localStorage.removeItem("token");

    // 显示提示消息
    alert("로그아웃되었습니다");

    // 跳转到登录页
    navigate("/");
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          bgcolor: '#FFFFFF',
          borderRight: 'none',
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.08)'
        },
      }}
    >
      <Toolbar />

      {/* Logo/Title */}
      <Box sx={{  bgcolor:'#96ACC1', p: 2, textAlign: 'center' }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: '#F5F5F5',

            letterSpacing: '-0.5px'
          }}
        >
          Sweatin'SkyBlue
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Menu Items */}
      <List sx={{ px: 1 }}>
        <ListItem
          button
          component={Link}
          to="/feed"
          sx={{
            borderRadius: '12px',
            mb: 1,
            '&:hover': {
              bgcolor: '#F5F5F5'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Home sx={{ color: '#333' }} />
          </ListItemIcon>
          <ListItemText
            primary="홈"
            primaryTypographyProps={{
              fontWeight: 500,
              color: '#333'
            }}
          />
        </ListItem>



        <ListItem
          button
          component={Link}
          to="/notifications"
          sx={{
            borderRadius: '12px',
            mb: 1,
            '&:hover': {
              bgcolor: '#F5F5F5'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Badge
              badgeContent={unreadCount}
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '10px',
                  height: '18px',
                  minWidth: '18px'
                }
              }}
            >
              <Notifications sx={{ color: '#333' }} />
            </Badge>
          </ListItemIcon>
          <ListItemText
            primary="알림"
            primaryTypographyProps={{
              fontWeight: 500,
              color: '#333'
            }}
          />
        </ListItem>

        <ListItem
          button
          component={Link}
          to="/messages"
          sx={{
            borderRadius: '12px',
            mb: 1,
            '&:hover': {
              bgcolor: '#F5F5F5'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Message sx={{ color: '#333' }} />
          </ListItemIcon>
          <ListItemText
            primary="메시지"
            primaryTypographyProps={{
              fontWeight: 500,
              color: '#333'
            }}
          />
        </ListItem>

        <ListItem
          button
          component={Link}
          to="/group"
          sx={{
            borderRadius: '12px',
            mb: 1,
            '&:hover': {
              bgcolor: '#F5F5F5'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Group sx={{ color: '#333' }} />
          </ListItemIcon>
          <ListItemText
            primary="팀"
            primaryTypographyProps={{
              fontWeight: 500,
              color: '#333'
            }}
          />
        </ListItem>


        <ListItem
          button
          component={Link}
          to="/group/create"
          sx={{
            borderRadius: '12px',
            mb: 1,
            '&:hover': {
              bgcolor: '#F5F5F5'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Add sx={{ color: '#333' }} />
          </ListItemIcon>
          <ListItemText
            primary="팀 생성하러 가기"
            primaryTypographyProps={{
              fontWeight: 500,
              color: '#333'
            }}
          />
        </ListItem>

        <ListItemButton onClick={() => navigate('/activity-history')}>
          <ListItemIcon>
            <EmojiEventsIcon sx={{ color: '#333' }} />
          </ListItemIcon>
          <ListItemText primary="활동 내역" />
        </ListItemButton>

        <ListItem
          button
          component={Link}
          to="/mypage"
          sx={{
            borderRadius: '12px',
            mb: 1,
            '&:hover': {
              bgcolor: '#F5F5F5'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <AccountCircle sx={{ color: '#333' }} />
          </ListItemIcon>
          <ListItemText
            primary="마이페이지"
            primaryTypographyProps={{
              fontWeight: 500,
              color: '#333'
            }}
          />
        </ListItem>
      </List>


      {/* User Profile at Bottom with Logout */}
      <Box sx={{ mt: 'auto', p: 2, bgcolor: '#1b1b1bff' }}>
        {currentUser && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Avatar
              src={currentUser.profileImg}
              sx={{
                width: 40,
                height: 40,
                bgcolor: '#555'
              }}
            >
              {currentUser.nickname?.charAt(0).toUpperCase() || currentUser.nickName?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: '#fff',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {currentUser.nickname || currentUser.nickName || '사용자'}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#bbb',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'block'
                }}
              >
                @{currentUser.userId || 'user'}
              </Typography>
            </Box>
          </Box>
        )}

        {/* ⭐ Logout Button */}
        <Button
          fullWidth
          onClick={handleLogout}
          startIcon={<Logout />}
          sx={{
            color: '#fff',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            textTransform: 'none',
            py: 1,
            fontSize: '14px',
            fontWeight: 500,
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.2)'
            }
          }}
        >
          로그아웃
        </Button>
      </Box>
    </Drawer>
  );
}

export default Menu;