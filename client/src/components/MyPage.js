import React, { useEffect, useState } from 'react';
import {
  Typography, Box, Avatar, Grid, IconButton, Tabs, Tab, Card,
  CardMedia, CardContent, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Button, Menu, MenuItem, List, ListItem,
  ListItemAvatar, ListItemText, Divider, Chip, ListItemButton  // ⭐ 添加这个
} from '@mui/material';
import { jwtDecode } from "jwt-decode";
import { useNavigate, useParams } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MessageIcon from '@mui/icons-material/Message';
import PeopleIcon from '@mui/icons-material/People';

function MyPage() {
  const { userId: profileUserId } = useParams();
  const [user, setUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState('');
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [myFeeds, setMyFeeds] = useState([]);
  const [favoriteFeeds, setFavoriteFeeds] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    nickName: '',
    addr: '',
    comorbidity: '',
    intro: ''
  });
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [feedDialogOpen, setFeedDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuFeedId, setMenuFeedId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingFeedId, setDeletingFeedId] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [followerDialogOpen, setFollowerDialogOpen] = useState(false);
  const [followingDialogOpen, setFollowingDialogOpen] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [comments, setComments] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]); // ⭐ 新增
  const [creatingChat, setCreatingChat] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setCurrentUserId(decoded.userId);

      const targetUserId = profileUserId || decoded.userId;
      setIsOwnProfile(targetUserId === decoded.userId);
      fetchUserInfo(targetUserId, decoded.userId);
    } else {
      alert("로그인 후 이용해주세요.");
      navigate("/");
    }
  }, [navigate, profileUserId]);

  const fetchUserInfo = (targetUserId, viewerId) => {
    fetch(`http://localhost:3010/user/${targetUserId}?viewerId=${viewerId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
        setEditForm({
          nickName: data.user.nickName || '',
          addr: data.user.addr || '',
          comorbidity: data.user.comorbidity || '',
          intro: data.user.intro || ''
        });
      })
      .catch(err => console.error(err));
  };

  const fetchMyFeeds = () => {
    const targetUserId = profileUserId || currentUserId;
    fetch(`http://localhost:3010/feed/${targetUserId}?viewerId=${currentUserId}`)
      .then(res => res.json())
      .then(data => {
        setMyFeeds(data.list || []);
      })
      .catch(err => console.error(err));
  };

  const fetchFavoriteFeeds = () => {
    const targetUserId = profileUserId || currentUserId;
    fetch(`http://localhost:3010/user/${targetUserId}/favorites?viewerId=${currentUserId}`)
      .then(res => res.json())
      .then(data => {
        setFavoriteFeeds(data.list || []);
      })
      .catch(err => console.error(err));
  };

  const fetchComments = (feedId) => {
    fetch(`http://localhost:3010/feed/${feedId}/comments`)
      .then(res => res.json())
      .then(data => {
        setComments(data.comments || []);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (currentUserId) {
      if (tabValue === 0) {
        fetchMyFeeds();
      } else if (tabValue === 1) {
        fetchFavoriteFeeds();
      } else if (tabValue === 2) {
        fetchMyGroups();
      } else if (tabValue === 3) {  // ⭐ 新增
        fetchJoinedGroups();
      }
    }
  }, [tabValue, currentUserId, profileUserId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditOpen = () => {
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      uploadAvatar(file);
    }
  };

  const uploadAvatar = (file) => {
    const formData = new FormData();
    formData.append('avatar', file);

    fetch(`http://localhost:3010/user/${currentUserId}/avatar`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        alert(data.msg);
        fetchUserInfo(currentUserId, currentUserId);
      })
      .catch(err => {
        console.error(err);
        alert('업로드 실패');
      });
  };

  const handleEditSubmit = () => {
    fetch(`http://localhost:3010/user/${currentUserId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(editForm)
    })
      .then(res => res.json())
      .then(data => {
        alert(data.msg);
        setEditDialogOpen(false);
        fetchUserInfo(currentUserId, currentUserId);
      })
      .catch(err => {
        console.error(err);
        alert('업데이트 실패');
      });
  };

  const handleEditClick = () => {
    navigate(`/feed/edit/${menuFeedId}`);
    handleMenuClose();
  };

  const handleFollow = () => {
    const targetUserId = profileUserId || currentUserId;
    fetch(`http://localhost:3010/user/${targetUserId}/follow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ followerId: currentUserId })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.msg);
        fetchUserInfo(targetUserId, currentUserId);
      })
      .catch(err => {
        console.error(err);
        alert('팔로우 실패');
      });
  };

  // 创建私聊并跳转
  const handleSendMessage = async () => {
    if (creatingChat) return;

    setCreatingChat(true);
    try {
      const targetUserId = profileUserId || currentUserId;

      const res = await fetch('http://localhost:3010/message/rooms/private', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId1: currentUserId,
          userId2: targetUserId
        })
      });

      const data = await res.json();

      if (data.result === 'success') {
        navigate(`/messages/${data.roomId}`);
      } else {
        alert('채팅방 생성 실패');
      }
    } catch (error) {
      console.error('Failed to create chat:', error);
      alert('채팅방 생성 실패');
    } finally {
      setCreatingChat(false);
    }
  };

  const fetchMyGroups = () => {
    const targetUserId = profileUserId || currentUserId;
    fetch(`http://localhost:3010/group?leaderId=${targetUserId}&status=all`)
      .then(res => res.json())
      .then(data => {
        if (data.result === 'success') {
          const leaderGroups = data.groups.filter(g => g.leaderId === targetUserId);
          setMyGroups(leaderGroups);
        }
      })
      .catch(err => console.error(err));
  };

  const fetchJoinedGroups = () => {
    const targetUserId = profileUserId || currentUserId;
    fetch(`http://localhost:3010/group/user/${targetUserId}/joined-groups`)
      .then(res => res.json())
      .then(data => {
        if (data.result === 'success') {
          setJoinedGroups(data.groups);
        }
      })
      .catch(err => console.error(err));
  };

  const handleFeedClick = (feed) => {
    // 如果需要同伴信息，先获取完整详情
    if (feed.historyId) {
      fetch(`http://localhost:3010/feed/detail/${feed.feedId}`)
        .then(res => res.json())
        .then(data => {
          if (data.result === 'success') {
            setSelectedFeed(data.feed);
            fetchComments(data.feed.feedId);
          }
        })
        .catch(err => console.error(err));
    } else {
      setSelectedFeed(feed);
      fetchComments(feed.feedId);
    }

    setFeedDialogOpen(true);
    setCurrentImageIndex(0);
  };

  const handleFeedDialogClose = () => {
    setFeedDialogOpen(false);
    setSelectedFeed(null);
    setCurrentImageIndex(0);
    setComments([]);
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

  const handleMenuOpen = (event, feedId) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuFeedId(feedId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuFeedId(null);
  };

  const handleDeleteClick = () => {
    setDeletingFeedId(menuFeedId);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    fetch(`http://localhost:3010/feed/${deletingFeedId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        alert('삭제되었습니다.');
        setDeleteDialogOpen(false);
        if (tabValue === 0) {
          fetchMyFeeds();
        } else {
          fetchFavoriteFeeds();
        }
      })
      .catch(err => {
        console.error(err);
        alert('삭제 실패');
      });
  };

  const handleFollowersClick = () => {
    const targetUserId = profileUserId || currentUserId;
    fetch(`http://localhost:3010/user/${targetUserId}/followers?viewerId=${currentUserId}`)
      .then(res => res.json())
      .then(data => {
        setFollowers(data.followers || []);
        setFollowerDialogOpen(true);
      })
      .catch(err => console.error(err));
  };

  const handleFollowingClick = () => {
    const targetUserId = profileUserId || currentUserId;
    fetch(`http://localhost:3010/user/${targetUserId}/following?viewerId=${currentUserId}`)
      .then(res => res.json())
      .then(data => {
        setFollowing(data.following || []);
        setFollowingDialogOpen(true);
      })
      .catch(err => console.error(err));
  };

  const handleUserClick = (userId) => {
    setFollowerDialogOpen(false);
    setFollowingDialogOpen(false);
    navigate(`/profile/${userId}`);
  };

  const feeds = tabValue === 0 ? myFeeds : favoriteFeeds;

  return (
    <Box sx={{ bgcolor: '#e2e2e2ab', minHeight: '100vh', pb: 4 }}>
      {/* 个人信息卡片 */}
      <Box
        sx={{
          bgcolor: '#fff',
          padding: '32px 24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          mb: 3
        }}
      >
        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
          {/* 顶部工具栏 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>

            {isOwnProfile ? (
              <IconButton
                onClick={handleEditOpen}
                sx={{
                  bgcolor: '#2a2b2cff',
                  color: 'white',
                  '&:hover': { bgcolor: '#85898dff' }
                }}
              >
                <EditIcon />
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  onClick={handleSendMessage}
                  disabled={creatingChat}
                  sx={{
                    bgcolor: '#FFB800',
                    color: '#fff',
                    '&:hover': { bgcolor: '#E5A600' },
                    '&:disabled': { bgcolor: '#CCC' }
                  }}
                >
                  <MessageIcon />
                </IconButton>
                <Button
                  variant="contained"
                  startIcon={user?.isFollowing ? <PersonRemoveIcon /> : <PersonAddIcon />}
                  onClick={handleFollow}
                  sx={{
                    bgcolor: user?.isFollowing ? '#999' : '#96ACC1',
                    '&:hover': {
                      bgcolor: user?.isFollowing ? '#777' : '#7A94A8'
                    }
                  }}
                >
                  {user?.isFollowing ? '팔로잉' : '팔로우'}
                </Button>
              </Box>
            )}
          </Box>

          {/* 头像和基本信息 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={user?.profileImg}
                sx={{
                  width: 100,
                  height: 100,
                  border: '4px solid #96ACC1'
                }}
              >
                {user?.nickName?.charAt(0).toUpperCase()}
              </Avatar>
              {isOwnProfile && (
                <>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="avatar-upload"
                    type="file"
                    onChange={handleAvatarChange}
                  />
                  <label htmlFor="avatar-upload">
                    <IconButton
                      component="span"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: '#96ACC1',
                        color: '#fff',
                        width: 32,
                        height: 32,
                        '&:hover': { bgcolor: '#7A94A8' }
                      }}
                    >
                      <PhotoCamera sx={{ fontSize: 18 }} />
                    </IconButton>
                  </label>
                </>
              )}
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                {user?.nickName}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                @{user?.userId}
              </Typography>
              {user?.intro && (
                <Typography variant="body2" sx={{ color: '#444' }}>
                  {user.intro}
                </Typography>
              )}
            </Box>
          </Box>

          {/* 统计数据 */}
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fff', borderRadius: '12px' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#96ACC1' }}>
                  {user?.cnt || 0}
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  게시물
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: 2,
                  bgcolor: '#fff',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#f5f5f5' }
                }}
                onClick={handleFollowersClick}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#96ACC1' }}>
                  {user?.follower || 0}
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  팔로워
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box
                sx={{
                  textAlign: 'center',
                  p: 2,
                  bgcolor: '#fff',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#f5f5f5' }
                }}
                onClick={handleFollowingClick}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#96ACC1' }}>
                  {user?.following || 0}
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  팔로잉
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ maxWidth: '800px', mx: 'auto', px: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            mb: 3,
            '& .MuiTab-root': {
              fontWeight: 600,
              fontSize: '16px'
            },
            '& .Mui-selected': {
              color: '#96ACC1 !important'
            },
            '& .MuiTabs-indicator': {
              bgcolor: '#96ACC1'
            }
          }}
        >
          <Tab label={isOwnProfile ? "내 피드" : "피드"} />
          <Tab label="저장한 피드" />
          <Tab label={isOwnProfile ? "내 팀" : "팀"} />
          {/* ⭐ 新增 */}
          <Tab label="가입된 팀" />
        </Tabs>

        {/* Feed Grid */}
        {tabValue < 2 ? (
          // Tab 0 和 Tab 1：Feed 网格
          feeds.length > 0 ? (
            <Grid container spacing={2}>
              {feeds.map((feed) => (
                <Grid item xs={6} sm={4} key={feed.feedId}>
                  <Card
                    sx={{
                      borderRadius: '16px',
                      cursor: 'pointer',
                      position: 'relative',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 16px rgba(150, 172, 193, 0.2)'
                      },
                      transition: 'all 0.3s'
                    }}
                    onClick={() => handleFeedClick(feed)}
                  >
                    {isOwnProfile && tabValue === 0 && (
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, feed.feedId)}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'rgba(255,255,255,0.9)',
                          zIndex: 1,
                          '&:hover': { bgcolor: '#fff' }
                        }}
                        size="small"
                      >
                        <MoreVertIcon />
                      </IconButton>
                    )}

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
                      {feed.title && (
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
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
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {feed.content}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8, color: '#999' }}>
              <Typography variant="h6">
                {tabValue === 0 ? '등록된 피드가 없습니다' : '저장한 피드가 없습니다'}
              </Typography>
            </Box>
          )
        ) : tabValue === 2 ? (
          // Tab 2：내 팀（我创建的队伍）
          myGroups.length > 0 ? (
            <Grid container spacing={2}>
              {myGroups.map((group) => (
                <Grid item xs={12} key={group.groupId}>
                  <Card
                    sx={{
                      borderRadius: '16px',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 16px rgba(150, 172, 193, 0.2)'
                      },
                      transition: 'all 0.3s'
                    }}
                    onClick={() => navigate(`/group/${group.groupId}`)}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {group.groupName}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                            {group.routeName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#999' }}>
                            {group.district} · {group.startLocation} → {group.endLocation}
                          </Typography>
                        </Box>
                        <Chip
                          label={
                            group.status === 'recruiting' ? '모집중' :
                              group.status === 'full' ? '모집완료' :
                                group.status === 'active' ? '진행중' : '종료'
                          }
                          sx={{
                            bgcolor: group.status === 'recruiting' ? '#4CAF50' : '#FF9800',
                            color: '#fff',
                            fontWeight: 600
                          }}
                        />
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Chip
                          label={`${group.totalDistance}km`}
                          size="small"
                          sx={{ bgcolor: '#F5F5F5' }}
                        />
                        <Chip
                          label={`약 ${group.estimatedTime}분`}
                          size="small"
                          sx={{ bgcolor: '#F5F5F5' }}
                        />
                        <Chip
                          label={`${group.currentMembers}/${group.maxMembers}명`}
                          size="small"
                          sx={{ bgcolor: '#96ACC1', color: '#fff' }}
                        />
                        <Chip
                          label={
                            group.intensityLevel === 'beginner' ? '초급' :
                              group.intensityLevel === 'intermediate' ? '중급' : '고급'
                          }
                          size="small"
                          sx={{
                            bgcolor:
                              group.intensityLevel === 'beginner' ? '#4CAF50' :
                                group.intensityLevel === 'intermediate' ? '#FF9800' : '#F44336',
                            color: '#fff'
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8, color: '#999' }}>
              <Typography variant="h6">
                팀장으로 있는 팀이 없습니다
              </Typography>
            </Box>
          )
        ) : (
          // Tab 3：가입된 팀（我加入的队伍）
          joinedGroups.length > 0 ? (
            <Grid container spacing={2}>
              {joinedGroups.map((group) => (
                <Grid item xs={12} key={group.groupId}>
                  <Card
                    sx={{
                      borderRadius: '16px',
                      cursor: 'pointer',
                      position: 'relative',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 16px rgba(150, 172, 193, 0.2)'
                      },
                      transition: 'all 0.3s'
                    }}
                    onClick={() => {
                      if (group.currentActivityId) {
                        navigate(`/group/${group.groupId}/activity`);
                      } else {
                        navigate(`/group/${group.groupId}`);
                      }
                    }}
                  >
                    {/* 进行中活动标记 */}
                    {group.currentActivityId && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          bgcolor: '#2196F3',
                          color: '#fff',
                          px: 2,
                          py: 0.5,
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          zIndex: 1
                        }}
                      >
                        <PeopleIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          활동 중
                        </Typography>
                      </Box>
                    )}

                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {group.groupName}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                            {group.routeName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#999' }}>
                            {group.district} · {group.startLocation} → {group.endLocation}
                          </Typography>
                        </Box>
                        <Chip
                          label={
                            group.status === 'recruiting' ? '모집중' :
                              group.status === 'full' ? '모집완료' :
                                group.status === 'active' ? '진행중' : '종료'
                          }
                          sx={{
                            bgcolor:
                              group.status === 'recruiting' ? '#4CAF50' :
                                group.status === 'full' ? '#FF9800' :
                                  group.status === 'active' ? '#2196F3' : '#9E9E9E',
                            color: '#fff',
                            fontWeight: 600
                          }}
                        />
                      </Box>

                      {/* 我的区间信息 */}
                      <Box sx={{ p: 2, bgcolor: '#F5F8FA', borderRadius: '12px', mb: 2 }}>
                        <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 0.5 }}>
                          내 담당 구간
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#2196F3' }}>
                          {group.mySegmentName || '미배정'}
                        </Typography>
                        {group.myCompletionRate != null && (
                          <Typography variant="caption" sx={{ color: '#666', display: 'block', mt: 1 }}>
                            완료율: {typeof group.myCompletionRate === 'number' ? group.myCompletionRate.toFixed(1) : parseFloat(group.myCompletionRate || 0).toFixed(1)}%
                          </Typography>
                        )}
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Chip
                          label={`${group.totalDistance}km`}
                          size="small"
                          sx={{ bgcolor: '#F5F5F5' }}
                        />
                        <Chip
                          label={`약 ${group.estimatedTime}분`}
                          size="small"
                          sx={{ bgcolor: '#F5F5F5' }}
                        />
                        <Chip
                          label={`${group.memberCount}/${group.maxMembers}명`}
                          size="small"
                          sx={{ bgcolor: '#96ACC1', color: '#fff' }}
                        />
                        <Chip
                          label={
                            group.intensityLevel === 'beginner' ? '초급' :
                              group.intensityLevel === 'intermediate' ? '중급' : '고급'
                          }
                          size="small"
                          sx={{
                            bgcolor:
                              group.intensityLevel === 'beginner' ? '#4CAF50' :
                                group.intensityLevel === 'intermediate' ? '#FF9800' : '#F44336',
                            color: '#fff'
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8, color: '#999' }}>
              <PeopleIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
              <Typography variant="h6">
                가입된 팀이 없습니다
              </Typography>
              <Typography variant="body2">
                팀에 가입하여 활동을 시작해보세요!
              </Typography>
            </Box>
          )
        )}
      </Box>

      {/* 各种 Dialog - 保持原样 */}
      <Dialog open={editDialogOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>프로필 수정</DialogTitle>
        <DialogContent>
          <TextField
            label="닉네임"
            fullWidth
            margin="normal"
            value={editForm.nickName}
            onChange={(e) => setEditForm({ ...editForm, nickName: e.target.value })}
          />
          <TextField
            label="주소"
            fullWidth
            margin="normal"
            value={editForm.addr}
            onChange={(e) => setEditForm({ ...editForm, addr: e.target.value })}
          />
          <TextField
            label="기저질환"
            fullWidth
            margin="normal"
            value={editForm.comorbidity}
            onChange={(e) => setEditForm({ ...editForm, comorbidity: e.target.value })}
          />
          <TextField
            label="소개"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={editForm.intro}
            onChange={(e) => setEditForm({ ...editForm, intro: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>취소</Button>
          <Button onClick={handleEditSubmit} variant="contained" sx={{ bgcolor: '#96ACC1' }}>
            저장
          </Button>
        </DialogActions>
      </Dialog>

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
          <Box sx={{ flex: 1, bgcolor: '#000', minHeight: '500px', position: 'relative' }}>
            {selectedFeed?.images && selectedFeed.images.length > 0 && (
              <>
                <img
                  key={currentImageIndex}
                  src={selectedFeed.images[currentImageIndex].filePath}
                  alt={selectedFeed.images[currentImageIndex].fileName}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
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
                        '&:hover': { bgcolor: '#fff' }
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
                        '&:hover': { bgcolor: '#fff' }
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
                        borderRadius: '12px'
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
                sx={{ bgcolor: '#96ACC1', mr: 2 }}
              >
                {selectedFeed?.isAnonymous ? (
                  <PersonIcon />
                ) : (
                  selectedFeed?.nickname?.charAt(0).toUpperCase()
                )}
              </Avatar>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {selectedFeed?.isAnonymous ? '익명 사용자' : selectedFeed?.nickname}
              </Typography>
            </Box>

            {selectedFeed?.title && (
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {selectedFeed.title}
              </Typography>
            )}

            <Typography variant="body2" sx={{ color: '#444', mb: 3 }}>
              {selectedFeed?.content}
            </Typography>

            {/* ⭐ 显示同伴列表 */}
            {selectedFeed?.companions && selectedFeed.companions.length > 0 && (
              <Box sx={{ mb: 3, p: 2, bgcolor: '#F5F8FA', borderRadius: '12px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PeopleIcon sx={{ fontSize: 18, color: '#96ACC1', mr: 0.5 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#96ACC1' }}>
                    함께 달린 사람
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  {selectedFeed.companions.map((companion) => (
                    <Chip
                      key={companion.userId}
                      avatar={
                        <Avatar
                          src={companion.profileImg}
                          sx={{ width: 24, height: 24 }}
                        >
                          {companion.nickname?.charAt(0).toUpperCase()}
                        </Avatar>
                      }
                      label={companion.nickname}
                      size="small"
                      onClick={() => navigate(`/profile/${companion.userId}`)}
                      sx={{
                        bgcolor: '#fff',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#E3F2FD' }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              댓글 ({comments.length})
            </Typography>
            <List sx={{ maxHeight: '300px', overflow: 'auto' }}>
              {comments.map((comment) => (
                <ListItem key={comment.commentId} alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar
                      src={comment.profileImg}
                      sx={{ width: 32, height: 32, bgcolor: '#96ACC1' }}
                    >
                      {(comment.nickname || comment.userId)?.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {comment.nickname || comment.userId}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        {comment.replyToNickname && (
                          <Typography component="span" sx={{ color: '#96ACC1', fontWeight: 600, mr: 0.5 }}>
                            @{comment.replyToNickname}
                          </Typography>
                        )}
                        {comment.content}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Follower 列表弹窗 */}
      <Dialog open={followerDialogOpen} onClose={() => setFollowerDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>팔로워</DialogTitle>
        <DialogContent>
          <List>
            {followers.map((follower) => (
              <ListItem
                key={follower.userId}
                disablePadding  // ⭐ 添加这个
              >
                <ListItemButton onClick={() => handleUserClick(follower.userId)}>  {/* ⭐ 改用 ListItemButton */}
                  <ListItemAvatar>
                    <Avatar src={follower.profileImg} sx={{ bgcolor: '#96ACC1' }}>
                      {follower.nickname?.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={follower.nickname}
                    secondary={follower.intro || `@${follower.userId}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      {/* Following 列表弹窗 */}
      <Dialog open={followingDialogOpen} onClose={() => setFollowingDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>팔로잉</DialogTitle>
        <DialogContent>
          <List>
            {following.map((user) => (
              <ListItem
                key={user.userId}
                disablePadding  // ⭐ 添加这个
              >
                <ListItemButton onClick={() => handleUserClick(user.userId)}>  {/* ⭐ 改用 ListItemButton */}
                  <ListItemAvatar>
                    <Avatar src={user.profileImg} sx={{ bgcolor: '#96ACC1' }}>
                      {user.nickname?.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.nickname}
                    secondary={user.intro || `@${user.userId}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEditClick}>
          <EditIcon sx={{ mr: 1, fontSize: 20 }} />
          수정
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
          삭제
        </MenuItem>
      </Menu>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>피드 삭제</DialogTitle>
        <DialogContent>
          <Typography>정말 이 피드를 삭제하시겠습니까?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>취소</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MyPage;