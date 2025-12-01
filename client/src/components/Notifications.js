import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
  Box, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar,
  Divider, Badge, Dialog, DialogContent, IconButton, TextField, Button
} from '@mui/material';
import {
  Favorite, ChatBubble, Bookmark, PersonAdd, Message, Group,
  CheckCircle, Cancel, Close as CloseIcon, ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon, Person as PersonIcon, Reply as ReplyIcon
} from '@mui/icons-material';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [currentUserId, setCurrentUserId] = useState('');
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [userAvatars, setUserAvatars] = useState({}); // 缓存用户头像
  const [feedDialogOpen, setFeedDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyToUser, setReplyToUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setCurrentUserId(decoded.userId);
      fetchNotifications(decoded.userId);
    } else {
      alert("로그인 후 이용해주세요.");
      navigate("/");
    }
  }, [navigate]);

  const fetchNotifications = (userId) => {
    fetch(`http://localhost:3010/notification?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setNotifications(data.notifications || []);
      })
      .catch(err => {
        console.error('Failed to fetch notifications:', err);
      });
  };

  const fetchFeedDetail = (feedId) => {
    fetch(`http://localhost:3010/feed/${currentUserId}?viewerId=${currentUserId}`)
      .then(res => res.json())
      .then(data => {
        const feed = data.list.find(f => f.feedId === parseInt(feedId));
        if (feed) {
          setSelectedFeed(feed);
          setFeedDialogOpen(true);
          setCurrentImageIndex(0);
          fetchComments(feedId);
        }
      })
      .catch(err => {
        console.error('Failed to fetch feed:', err);
      });
  };

  const fetchComments = (feedId) => {
    fetch(`http://localhost:3010/feed/${feedId}/comments`)
      .then(res => res.json())
      .then(data => {
        setComments(data.comments || []);
      })
      .catch(err => {
        console.error('Failed to fetch comments:', err);
      });
  };

  const markAsRead = (notificationId) => {
    fetch(`http://localhost:3010/notification/${notificationId}/read`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(() => {
        setNotifications(notifications.map(n => 
          n.notificationId === notificationId 
            ? { ...n, isRead: true }
            : n
        ));
      })
      .catch(err => {
        console.error('Failed to mark as read:', err);
      });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'feed_like':
        return <Favorite sx={{ color: '#6d1a1aff' }} />;
      case 'feed_comment':
        return <ChatBubble sx={{ color: '#314d6dff' }} />;
      case 'feed_favorite':
        return <Bookmark sx={{ color: '#ccce59ff' }} />;
      case 'follow':
      case 'new_follower':
        return <PersonAdd sx={{ color: '#657c92ff' }} />;
      case 'app_approved':
        return <CheckCircle sx={{ color: '#295330ff' }} />;
      case 'app_rejected':
        return <Cancel sx={{ color: '#6d1a1aff' }} />;
      case 'activity_reminder':
      case 'route_update':
        return <Group sx={{ color: '#4c6094ff' }} />;
      default:
        return <Message sx={{ color: '#436d94ff' }} />;
    }
  };

  const getNotificationText = (notification) => {
    const userName = notification.fromUserNickname || '사용자';
    
    switch (notification.notificationType) {
      case 'feed_like':
        return `${userName}님이 회원님의 피드를 좋아합니다`;
      case 'feed_comment':
        return `${userName}님이 회원님의 피드에 댓글을 남겼습니다`;
      case 'feed_favorite':
        return `${userName}님이 회원님의 피드를 저장했습니다`;
      case 'follow':
      case 'new_follower':
        return `${userName}님이 회원님을 팔로우하기 시작했습니다`;
      case 'app_approved':
        return '팀 가입 신청이 승인되었습니다';
      case 'app_rejected':
        return '팀 가입 신청이 거절되었습니다';
      case 'activity_reminder':
        return '오늘 활동 일정이 있습니다';
      case 'route_update':
        return '경로가 업데이트되었습니다';
      default:
        return notification.content || '새로운 알림이 있습니다';
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.notificationId);
    
    switch (notification.notificationType) {
      case 'feed_like':
      case 'feed_comment':
      case 'feed_favorite':
        if (notification.relatedId) {
          fetchFeedDetail(notification.relatedId);
        }
        break;
      
      case 'follow':
      case 'new_follower':
        if (notification.fromUserId) {
          navigate(`/profile/${notification.fromUserId}`);
        }
        break;
      
      default:
        break;
    }
  };

  const handleFeedDialogClose = () => {
    setFeedDialogOpen(false);
    setSelectedFeed(null);
    setCurrentImageIndex(0);
    setComments([]);
    setNewComment('');
    setReplyToUser(null);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? selectedFeed.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === selectedFeed.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleReply = (comment) => {
    setReplyToUser({
      userId: comment.userId,
      nickname: comment.nickname
    });
    setNewComment(`@${comment.nickname} `);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    fetch(`http://localhost:3010/feed/${selectedFeed.feedId}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        userId: currentUserId,
        content: newComment,
        replyToUserId: replyToUser?.userId || null
      })
    })
      .then(res => res.json())
      .then(data => {
        setNewComment('');
        setReplyToUser(null);
        fetchComments(selectedFeed.feedId);
      })
      .catch(err => {
        console.error('Failed to add comment:', err);
        alert('댓글 작성에 실패했습니다.');
      });
  };

  const handleAvatarClick = (userId, e) => {
    e.stopPropagation();
    navigate(`/profile/${userId}`);
  };

  return (
    <Box sx={{ bgcolor: '#F5F5F5', minHeight: '100vh', pb: 4 }}>
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
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1A1A1A' }}>
          알림
        </Typography>
      </Box>

      <Box sx={{ maxWidth: '800px', mx: 'auto', mt: 2 }}>
        {notifications.length > 0 ? (
          <List sx={{ bgcolor: '#fff', borderRadius: '16px', overflow: 'hidden' }}>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.notificationId}>
                <ListItem
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    py: 2,
                    bgcolor: notification.isRead ? 'transparent' : 'rgba(150, 172, 193, 0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: notification.isRead ? 'rgba(150, 172, 193, 0.05)' : 'rgba(150, 172, 193, 0.15)',
                      transform: 'translateX(4px)',
                    },
                    '&:active': {
                      transform: 'scale(0.98)',
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar 
                      src={notification.fromUserProfileImg || undefined}
                      sx={{ 
                        bgcolor: notification.fromUserProfileImg ? 'transparent' : '#E8F0F7',
                        border: '2px solid #fff',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    >
                      {!notification.fromUserProfileImg && getNotificationIcon(notification.notificationType)}
                    </Avatar>
                  </ListItemAvatar>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: notification.isRead ? 400 : 600,
                            color: notification.isRead ? '#666' : '#333'
                          }}
                        >
                          {getNotificationText(notification)}
                        </Typography>
                        {!notification.isRead && (
                          <Badge 
                            variant="dot" 
                            color="primary"
                            sx={{
                              '& .MuiBadge-badge': {
                                bgcolor: '#96ACC1'
                              }
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ color: '#999' }}>
                        {new Date(notification.cdatetime).toLocaleString('ko-KR', {
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
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
              알림이 없습니다
            </Typography>
            <Typography variant="body2" sx={{ color: '#CCC' }}>
              새로운 활동이 있을 때 알려드릴게요
            </Typography>
          </Box>
        )}
      </Box>

      {/* Feed 详情弹窗 */}
      <Dialog
        open={feedDialogOpen}
        onClose={handleFeedDialogClose}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '20px' } }}
      >
        <IconButton
          onClick={handleFeedDialogClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            bgcolor: 'rgba(255,255,255,0.9)',
            zIndex: 1,
            '&:hover': { bgcolor: '#fff' }
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ flex: 1, bgcolor: '#000', minHeight: { xs: '300px', md: '500px' }, position: 'relative' }}>
            {selectedFeed?.images && selectedFeed.images.length > 0 && (
              <>
                <img
                  key={currentImageIndex}
                  src={selectedFeed.images[currentImageIndex].filePath}
                  alt={selectedFeed.images[currentImageIndex].fileName}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain'
                  }}
                />
                
                {selectedFeed.images.length > 1 && (
                  <>
                    <IconButton
                      onClick={handlePrevImage}
                      sx={{
                        position: 'absolute',
                        left: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(255,255,255,0.8)',
                        '&:hover': { bgcolor: '#fff' },
                        zIndex: 2
                      }}
                    >
                      <ChevronLeftIcon />
                    </IconButton>
                    <IconButton
                      onClick={handleNextImage}
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(255,255,255,0.8)',
                        '&:hover': { bgcolor: '#fff' },
                        zIndex: 2
                      }}
                    >
                      <ChevronRightIcon />
                    </IconButton>

                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 16,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bgcolor: 'rgba(0,0,0,0.6)',
                        color: '#fff',
                        px: 2,
                        py: 0.5,
                        borderRadius: '12px',
                        fontSize: '14px'
                      }}
                    >
                      {currentImageIndex + 1} / {selectedFeed.images.length}
                    </Box>
                  </>
                )}
              </>
            )}
          </Box>

          <Box sx={{ width: { xs: '100%', md: '400px' }, p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                src={selectedFeed?.isAnonymous ? null : selectedFeed?.profileImg}
                onClick={(e) => !selectedFeed?.isAnonymous && handleAvatarClick(selectedFeed?.userId, e)}
                sx={{ 
                  bgcolor: '#96ACC1', 
                  mr: 2,
                  cursor: selectedFeed?.isAnonymous ? 'default' : 'pointer'
                }}
              >
                {selectedFeed?.isAnonymous ? (
                  <PersonIcon />
                ) : (
                  (selectedFeed?.nickname || selectedFeed?.userId)?.charAt(0).toUpperCase()
                )}
              </Avatar>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600,
                  cursor: selectedFeed?.isAnonymous ? 'default' : 'pointer'
                }}
                onClick={(e) => !selectedFeed?.isAnonymous && handleAvatarClick(selectedFeed?.userId, e)}
              >
                {selectedFeed?.isAnonymous ? '익명 사용자' : (selectedFeed?.nickname || selectedFeed?.userId)}
              </Typography>
            </Box>

            {selectedFeed?.title && (
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
                {selectedFeed.title}
              </Typography>
            )}

            <Typography variant="body2" sx={{ mb: 3, color: '#444' }}>
              {selectedFeed?.content}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 3, pb: 2, borderBottom: '1px solid #eee' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Favorite sx={{ fontSize: 18, color: '#FF6B6B' }} />
                <Typography variant="body2">{selectedFeed?.likeCnt || 0}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Bookmark sx={{ fontSize: 18, color: '#FFB800' }} />
                <Typography variant="body2">{selectedFeed?.favorCnt || 0}</Typography>
              </Box>
            </Box>

            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              댓글 ({comments.length})
            </Typography>
            <List sx={{ maxHeight: '300px', overflow: 'auto', mb: 2 }}>
              {comments.map((comment) => (
                <ListItem key={comment.commentId} alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar 
                      src={comment.profileImg}
                      onClick={(e) => handleAvatarClick(comment.userId, e)}
                      sx={{ width: 32, height: 32, bgcolor: '#96ACC1', cursor: 'pointer' }}
                    >
                      {(comment.nickname || comment.userId)?.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography 
                          variant="caption" 
                          sx={{ fontWeight: 600, cursor: 'pointer' }}
                          onClick={(e) => handleAvatarClick(comment.userId, e)}
                        >
                          {comment.nickname || comment.userId}
                        </Typography>
                        <IconButton 
                          size="small" 
                          onClick={() => handleReply(comment)}
                          sx={{ ml: 'auto' }}
                        >
                          <ReplyIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        {comment.replyToNickname && (
                          <Typography 
                            component="span" 
                            sx={{ color: '#96ACC1', fontWeight: 600, mr: 0.5 }}
                          >
                            {/* @{comment.replyToNickname} */}
                          </Typography>
                        )}
                        {comment.content}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>

            {replyToUser && (
              <Box sx={{ mb: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: '#666', flex: 1 }}>
                  {replyToUser.nickname}님에게 답장
                </Typography>
                <IconButton size="small" onClick={() => { setReplyToUser(null); setNewComment(''); }}>
                  <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                placeholder="댓글을 입력하세요"
                variant="outlined"
                size="small"
                fullWidth
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px'
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                sx={{
                  bgcolor: '#96ACC1',
                  borderRadius: '12px',
                  minWidth: '60px',
                  '&:hover': { bgcolor: '#7A94A8' },
                  '&:disabled': { bgcolor: '#ccc' }
                }}
              >
                추가
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Notifications;