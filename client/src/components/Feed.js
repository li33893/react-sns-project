import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Avatar,
  Chip,
  Dialog,
  DialogContent,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Fab,
  Grid
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

function Feed() {
  const [feeds, setFeeds] = useState([]);
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [category, setCategory] = useState('share'); // share/daily/vent
  const [filter, setFilter] = useState('team'); // team/location/all
  
  let navigate = useNavigate();

  function fnFeeds() {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      fetch("http://localhost:3010/feed/" + decoded.userId)
        .then(res => res.json())
        .then(data => {
          setFeeds(data.list);
        });
    } else {
      alert("로그인 후 이용해주세요.");
      navigate("/");
    }
  }

  useEffect(() => {
    fnFeeds();
  }, []);

  const handleClickOpen = (feed) => {
    setSelectedFeed(feed);
    setOpen(true);
    setComments([
      { id: 'user1', text: '멋진 사진이에요!' },
      { id: 'user2', text: '이 장소에 가보고 싶네요!' },
    ]);
    setNewComment('');
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFeed(null);
    setComments([]);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, { id: 'currentUser', text: newComment }]);
      setNewComment('');
    }
  };

  const handleLike = (feedId) => {
    // TODO: 实现点赞逻辑
    console.log('Like feed:', feedId);
  };

  const handleBookmark = (feedId) => {
    // TODO: 实现收藏逻辑
    console.log('Bookmark feed:', feedId);
  };

  return (
    <Box sx={{ bgcolor: '#E2E2E2', minHeight: '100vh', pb: 10 }}>
      {/* 顶部筛选栏 */}
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
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600, 
            mb: 2,
            color: '#1A1A1A'
          }}
        >
          Feed
        </Typography>
        
        {/* 分类标签 */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip 
            label="분석구역" 
            onClick={() => setCategory('share')}
            sx={{ 
              bgcolor: category === 'share' ? '#96ACC1' : '#fff',
              color: category === 'share' ? '#fff' : '#666',
              fontWeight: 500,
              '&:hover': { bgcolor: category === 'share' ? '#7A94A8' : '#f5f5f5' }
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

        {/* 筛选器 */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip 
            label="팀 동태" 
            onClick={() => setFilter('team')}
            size="small"
            sx={{ 
              bgcolor: filter === 'team' ? '#96ACC1' : '#fff',
              color: filter === 'team' ? '#fff' : '#666',
              '&:hover': { bgcolor: filter === 'team' ? '#7A94A8' : '#f5f5f5' }
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

      {/* Grid 布局笔记展示 */}
      <Box sx={{ padding: '20px' }}>
        {feeds.length > 0 ? (
          <Grid container spacing={2}>
            {feeds.map((feed) => (
              <Grid item xs={6} sm={4} md={3} key={feed.id}>
                <Card 
                  sx={{ 
                    borderRadius: '16px',
                    overflow: 'hidden',
                    bgcolor: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(150, 172, 193, 0.2)'
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    image={feed.imgPath}
                    alt={feed.imgName}
                    onClick={() => handleClickOpen(feed)}
                    sx={{ 
                      cursor: 'pointer',
                      aspectRatio: '1',
                      objectFit: 'cover'
                    }}
                  />
                  <CardContent sx={{ p: 2 }}>
                    {/* 作者信息 */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar 
                        sx={{ 
                          width: 28, 
                          height: 28, 
                          mr: 1,
                          bgcolor: '#96ACC1'
                        }}
                      >
                        {feed.userId?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontWeight: 600,
                          color: '#444'
                        }}
                      >
                        {feed.userId}
                      </Typography>
                    </Box>

                    {/* 标题/内容 */}
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#666',
                        mb: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {feed.content}
                    </Typography>

                    {/* 点赞和收藏 */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton 
                        size="small"
                        onClick={() => handleLike(feed.id)}
                        sx={{ color: '#96ACC1' }}
                      >
                        <FavoriteBorderIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        {feed.likes || 0}
                      </Typography>
                      
                      <IconButton 
                        size="small"
                        onClick={() => handleBookmark(feed.id)}
                        sx={{ color: '#96ACC1', ml: 'auto' }}
                      >
                        <BookmarkBorderIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 8,
              color: '#999'
            }}
          >
            <Typography variant="h6">등록된 피드가 없습니다</Typography>
            <Typography variant="body2">첫 피드를 등록해보세요!</Typography>
          </Box>
        )}
      </Box>

      {/* 固定的 + 按钮 - 内容区域底部居中 */}
      <Fab
        onClick={() => navigate('/register')}
        sx={{
          position: 'fixed',
          bottom: { xs: 20, sm: 24 },
          left: { 
            xs: '50%', // 手机: 屏幕中间
            sm: '50%', // 平板: 屏幕中间
            md: 'calc(240px + (100% - 240px) / 2)' // 桌面: sidebar(240px) + 内容区域的一半
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
          {/* 左侧图片 */}
          <Box sx={{ flex: 1, bgcolor: '#000' }}>
            {selectedFeed?.imgPath && (
              <img
                src={selectedFeed.imgPath}
                alt={selectedFeed.imgName}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            )}
          </Box>

          {/* 右侧评论区 */}
          <Box sx={{ width: { xs: '100%', md: '400px' }, p: 3 }}>
            {/* 作者信息 */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: '#96ACC1', mr: 2 }}>
                {selectedFeed?.userId?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {selectedFeed?.userId}
              </Typography>
            </Box>

            {/* 内容 */}
            <Typography variant="body2" sx={{ mb: 3, color: '#444' }}>
              {selectedFeed?.content}
            </Typography>

            {/* 评论列表 */}
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              댓글
            </Typography>
            <List sx={{ maxHeight: '300px', overflow: 'auto', mb: 2 }}>
              {comments.map((comment, index) => (
                <ListItem key={index} alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#96ACC1' }}>
                      {comment.id.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {comment.id}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        {comment.text}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>

            {/* 评论输入 */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                placeholder="댓글을 입력하세요"
                variant="outlined"
                size="small"
                fullWidth
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px'
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={handleAddComment}
                sx={{
                  bgcolor: '#96ACC1',
                  borderRadius: '12px',
                  '&:hover': { bgcolor: '#7A94A8' }
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