import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardMedia, CardContent, Typography, IconButton, Avatar,
  Chip, Dialog, DialogContent, TextField, Button, List, ListItem,
  ListItemAvatar, ListItemText, Fab, Grid, InputAdornment
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PersonIcon from '@mui/icons-material/Person';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SearchIcon from '@mui/icons-material/Search';
import ReplyIcon from '@mui/icons-material/Reply';

function Feed() {
  const [feeds, setFeeds] = useState([]);
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [category, setCategory] = useState('group');
  const [filter, setFilter] = useState('all');
  const [currentUserId, setCurrentUserId] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [replyToUser, setReplyToUser] = useState(null);
  
  let navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setCurrentUserId(decoded.userId);
    } else {
      alert("로그인 후 이용해주세요.");
      navigate("/");
    }
  }, [navigate]);

  function fnFeeds() {
    if (!currentUserId) return;
    
    let params = new URLSearchParams({
      feedType: category,
      userId: currentUserId
    });
    
    if (filter !== 'team') {
      params.append('filter', filter);
    }
    
    if (searchQuery.trim()) {
      params.append('search', searchQuery.trim());
    }
    
    let url = `http://localhost:3010/feed?${params.toString()}`;
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setFeeds(data.list || []);
      })
      .catch(err => {
        console.error('Failed to fetch feeds:', err);
      });
  }

  useEffect(() => {
    if (currentUserId) {
      fnFeeds();
    }
  }, [category, filter, currentUserId]);

  const handleSearch = () => {
    fnFeeds();
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

  const handleClickOpen = (feed) => {
    setSelectedFeed(feed);
    setOpen(true);
    setCurrentImageIndex(0);
    fetchComments(feed.feedId);
    setNewComment('');
    setReplyToUser(null);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFeed(null);
    setComments([]);
    setCurrentImageIndex(0);
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
        setFeeds(feeds.map(f => 
          f.feedId === selectedFeed.feedId 
            ? {...f, commentCnt: f.commentCnt + 1}
            : f
        ));
      })
      .catch(err => {
        console.error('Failed to add comment:', err);
        alert('댓글 작성에 실패했습니다.');
      });
  };

  const handleLike = (feedId, e) => {
    e.stopPropagation();
    
    fetch(`http://localhost:3010/feed/${feedId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ userId: currentUserId })
    })
      .then(res => res.json())
      .then(data => {
        setFeeds(feeds.map(f => {
          if (f.feedId === feedId) {
            return {
              ...f,
              likeCnt: data.liked ? f.likeCnt + 1 : f.likeCnt - 1,
              isLiked: data.liked
            };
          }
          return f;
        }));
      })
      .catch(err => {
        console.error('Failed to like:', err);
      });
  };

  const handleBookmark = (feedId, e) => {
    e.stopPropagation();
    
    fetch(`http://localhost:3010/feed/${feedId}/favorite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ userId: currentUserId })
    })
      .then(res => res.json())
      .then(data => {
        setFeeds(feeds.map(f => {
          if (f.feedId === feedId) {
            return {
              ...f,
              favorCnt: data.favorited ? f.favorCnt + 1 : f.favorCnt - 1,
              isFavorited: data.favorited
            };
          }
          return f;
        }));
      })
      .catch(err => {
        console.error('Failed to bookmark:', err);
      });
  };

  const handleAvatarClick = (userId, e) => {
    e.stopPropagation();
    navigate(`/profile/${userId}`);
  };

  return (
    <Box sx={{ bgcolor: '#E2E2E2', minHeight: '100vh', pb: 10 }}>
      <Box 
        sx={{ 
          bgcolor: '#F0F0F0',
          padding: '16px 20px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#1A1A1A' }}>
          편하게 둘러봐 ~
        </Typography>
        
        {/* 搜索框 */}
        <TextField
          placeholder="제목이나 내용으로 검색..."
          size="small"
          width="50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#666' }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => { setSearchQuery(''); fnFeeds(); }}>
                  <CloseIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{ 
            mb: 2,
            bgcolor: '#fff',
            borderRadius: '12px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px'
            }
          }}
        />
        
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip 
            label="운동구역" 
            onClick={() => setCategory('group')}
            sx={{ 
              bgcolor: category === 'group' ? '#96ACC1' : '#fff',
              color: category === 'group' ? '#fff' : '#666',
              fontWeight: 500,
              '&:hover': { bgcolor: category === 'group' ? '#7A94A8' : '#f5f5f5' }
            }}
          />
          <Chip 
            label="일상구역" 
            onClick={() => setCategory('daily')}
            sx={{ 
              bgcolor: category === 'daily' ? '#96ACC1' : '#fff',
              color: category === 'daily' ? '#fff' : '#666',
              fontWeight: 500,
              '&:hover': { bgcolor: category === 'daily' ? '#7A94A8' : '#f5f5f5' }
            }}
          />
          <Chip 
            label="발산구역" 
            onClick={() => setCategory('vent')}
            sx={{ 
              bgcolor: category === 'vent' ? '#96ACC1' : '#fff',
              color: category === 'vent' ? '#fff' : '#666',
              fontWeight: 500,
              '&:hover': { bgcolor: category === 'vent' ? '#7A94A8' : '#f5f5f5' }
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip 
            label="팀 동태" 
            onClick={() => setFilter('team')}
            size="small"
            disabled
            sx={{ 
              bgcolor: filter === 'team' ? '#96ACC1' : '#fff',
              color: filter === 'team' ? '#fff' : '#999',
              '&.Mui-disabled': {
                bgcolor: '#f5f5f5',
                color: '#ccc'
              }
            }}
          />
          <Chip 
            label="지역" 
            onClick={() => setFilter('location')}
            size="small"
            sx={{ 
              bgcolor: filter === 'location' ? '#96ACC1' : '#fff',
              color: filter === 'location' ? '#fff' : '#666',
              '&:hover': { bgcolor: filter === 'location' ? '#7A94A8' : '#f5f5f5' }
            }}
          />
          <Chip 
            label="전체" 
            onClick={() => setFilter('all')}
            size="small"
            sx={{ 
              bgcolor: filter === 'all' ? '#96ACC1' : '#fff',
              color: filter === 'all' ? '#fff' : '#666',
              '&:hover': { bgcolor: filter === 'all' ? '#7A94A8' : '#f5f5f5' }
            }}
          />
        </Box>
      </Box>

      <Box sx={{ padding: '20px' }}>
        {feeds.length > 0 ? (
          <Grid container spacing={2.5}>
            {feeds.map((feed) => (
              <Grid item xs={6} sm={4} md={3} key={feed.feedId}>
                <Card 
                  sx={{ 
                    borderRadius: '16px',
                    overflow: 'hidden',
                    bgcolor: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(150, 172, 193, 0.2)'
                    }
                  }}
                  onClick={() => handleClickOpen(feed)}
                >
                  {feed.thumbnail && (
                    <CardMedia
                      component="img"
                      image={feed.thumbnail.filePath}
                      alt={feed.thumbnail.fileName}
                      sx={{ 
                        aspectRatio: '1',
                        objectFit: 'cover',
                        height: 200
                      }}
                    />
                  )}
                  
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar 
                        src={feed.isAnonymous ? null : feed.profileImg}
                        onClick={(e) => !feed.isAnonymous && handleAvatarClick(feed.userId, e)}
                        sx={{ 
                          width: 28, 
                          height: 28, 
                          mr: 1,
                          bgcolor: '#333',
                          cursor: feed.isAnonymous ? 'default' : 'pointer'
                        }}
                      >
                        {feed.isAnonymous ? (
                          <PersonIcon sx={{ fontSize: 18 }} />
                        ) : (
                          (feed.nickname || feed.userId)?.charAt(0).toUpperCase()
                        )}
                      </Avatar>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontWeight: 600,
                          color: '#444',
                          cursor: feed.isAnonymous ? 'default' : 'pointer'
                        }}
                        onClick={(e) => !feed.isAnonymous && handleAvatarClick(feed.userId, e)}
                      >
                        {feed.isAnonymous ? '익명' : (feed.nickname || feed.userId)}
                      </Typography>
                    </Box>

                    {feed.title && (
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 600,
                          color: '#333',
                          mb: 0.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {feed.title}
                      </Typography>
                    )}

                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#666',
                        mb: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '40px'
                      }}
                    >
                      {feed.content}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <IconButton 
                        size="small"
                        onClick={(e) => handleLike(feed.feedId, e)}
                        sx={{ color: feed.isLiked ? '#960303ff' : '#333' }}
                      >
                        {feed.isLiked ? <FavoriteIcon sx={{ fontSize: 18 }} /> : <FavoriteBorderIcon sx={{ fontSize: 18 }} />}
                      </IconButton>
                      <Typography variant="caption" sx={{ color: '#666', mr: 1 }}>
                        {feed.likeCnt || 0}
                      </Typography>
                      
                      <IconButton 
                        size="small"
                        sx={{ color: '#333' }}
                      >
                        <ChatBubbleOutlineIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        {feed.commentCnt || 0}
                      </Typography>
                      
                      <IconButton 
                        size="small"
                        onClick={(e) => handleBookmark(feed.feedId, e)}
                        sx={{ color: feed.isFavorited ? '#FFB800' : '#333', ml: 'auto' }}
                      >
                        {feed.isFavorited ? <BookmarkIcon sx={{ fontSize: 18 }} /> : <BookmarkBorderIcon sx={{ fontSize: 18 }} />}
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8, color: '#999' }}>
            <Typography variant="h6">등록된 피드가 없습니다</Typography>
            <Typography variant="body2">첫 피드를 등록해보세요!</Typography>
          </Box>
        )}
      </Box>

      <Fab
        onClick={() => navigate('/register')}
        sx={{
          position: 'fixed',
          bottom: { xs: 20, sm: 24 },
          left: { 
            xs: '50%',
            sm: '50%',
            md: 'calc(240px + (100% - 240px) / 2)'
          },
          transform: 'translateX(-50%)',
          bgcolor: '#96ACC1',
          color: '#fff',
          width: { xs: 64, sm: 72 },
          height: { xs: 64, sm: 72 },
          border: '4px solid #fff',
          boxShadow: '0 4px 20px rgba(150, 172, 193, 0.35)',
          '&:hover': {
            bgcolor: '#7A94A8',
            transform: 'translateX(-50%) scale(1.08)',
            boxShadow: '0 6px 24px rgba(150, 172, 193, 0.45)'
          },
          transition: 'all 0.3s ease',
          zIndex: 1000
        }}
      >
        <AddIcon sx={{ fontSize: { xs: 32, sm: 36 } }} />
      </Fab>

      {/* 详情弹窗 */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        fullWidth 
        maxWidth="md"
        PaperProps={{
          sx: { borderRadius: '20px' }
        }}
      >
        <IconButton
          onClick={handleClose}
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
                <FavoriteIcon sx={{ fontSize: 18, color: '#FF6B6B' }} />
                <Typography variant="body2">{selectedFeed?.likeCnt || 0}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <BookmarkIcon sx={{ fontSize: 18, color: '#FFB800' }} />
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

export default Feed;