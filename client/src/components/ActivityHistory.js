import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
  Box, Typography, Card, CardContent, Grid, Chip, Avatar,
  IconButton, Button, List, ListItem, ListItemAvatar, ListItemText,
  Paper, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';

function ActivityHistory() {
  const [activities, setActivities] = useState([]);
  const [currentUserId, setCurrentUserId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setCurrentUserId(decoded.userId);
      fetchActivities(decoded.userId);
    } else {
      alert("로그인 후 이용해주세요.");
      navigate("/");
    }
  }, [navigate]);

  const fetchActivities = (userId) => {
    fetch(`http://localhost:3010/group/user/${userId}/completed-activities`)
      .then(res => res.json())
      .then(data => {
        if (data.result === 'success') {
          setActivities(data.activities);
        }
      })
      .catch(err => console.error(err));
  };

  const handleWriteFeed = (activity) => {
    // 准备同伴列表（所有段的同伴）
    let allCompanions = [];
    activity.myRecords.forEach(record => {
      if (record.companions) {
        record.companions.forEach(companion => {
          if (!allCompanions.find(c => c.userId === companion.userId)) {
            allCompanions.push(companion);
          }
        });
      }
    });

    navigate('/register', {
      state: {
        historyId: activity.activityId,
        groupId: activity.groupId,
        routeId: activity.routeId,
        location: activity.district,
        companions: allCompanions,
        activityInfo: {
          groupName: activity.groupName,
          routeName: activity.routeName,
          date: activity.scheduledDate,
          distance: activity.totalDistance
        }
      }
    });
  };

  const handleEditFeed = (feedId) => {
    navigate(`/feed/edit/${feedId}`);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const getRoleLabel = (role) => {
    return role === 'main_runner' ? '주자' : '동행자';
  };

  // 1️⃣ 添加一个获取状态标签的函数（添加到 getRoleLabel 函数后面）
  const getStatusLabel = (record) => {
    if (record.status === 'skipped') {
      return '미완료';  // 未完成
    } else if (record.status === 'completed') {
      return record.isOnTime ? '정시 완료' : '지연 완료';
    } else {
      return record.status;  // 其他状态
    }
  };

  const getStatusColor = (record) => {
    if (record.status === 'skipped') {
      return '#F44336';  // 红色 - 未完成
    } else if (record.status === 'completed') {
      return record.isOnTime ? '#4CAF50' : '#FF9800';  // 绿色/橙色
    } else {
      return '#9E9E9E';  // 灰色
    }
  };

  return (
    <Box sx={{ bgcolor: '#E2E2E2', minHeight: '100vh', pb: 4 }}>
      {/* 顶部工具栏 */}
      <Box
        sx={{
          bgcolor: '#fff',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          활동 내역
        </Typography>
      </Box>

      <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 3 }}>
        {activities.length > 0 ? (
          <Grid container spacing={3}>
            {activities.map((activity) => (
              <Grid item xs={12} key={activity.activityId}>
                <Card sx={{ borderRadius: '16px', overflow: 'hidden' }}>
                  <CardContent sx={{ p: 3 }}>
                    {/* 活动头部 */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Chip
                            icon={<EmojiEventsIcon />}
                            label="완료"
                            size="small"
                            sx={{ bgcolor: '#4CAF50', color: '#fff', fontWeight: 600 }}
                          />
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            {formatDate(activity.actualEndTime)}
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {activity.groupName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                          {activity.routeName}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationOnIcon sx={{ fontSize: 16, color: '#666' }} />
                            <Typography variant="caption" sx={{ color: '#666' }}>
                              {activity.district}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <DirectionsRunIcon sx={{ fontSize: 16, color: '#666' }} />
                            <Typography variant="caption" sx={{ color: '#666' }}>
                              {activity.totalDistance}km
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTimeIcon sx={{ fontSize: 16, color: '#666' }} />
                            <Typography variant="caption" sx={{ color: '#666' }}>
                              {formatTime(activity.actualStartTime)} - {formatTime(activity.actualEndTime)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* Feed 按钮 */}
                      <Box>
                        {activity.hasFeed ? (
                          <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={() => handleEditFeed(activity.feedId)}
                            sx={{
                              borderColor: '#96ACC1',
                              color: '#96ACC1',
                              '&:hover': { borderColor: '#7A94A8', bgcolor: '#F5F5F5' }
                            }}
                          >
                            피드 수정
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleWriteFeed(activity)}
                            sx={{
                              bgcolor: '#96ACC1',
                              '&:hover': { bgcolor: '#7A94A8' }
                            }}
                          >
                            피드 작성
                          </Button>
                        )}
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* 我的段记录 */}
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                      내가 달린 구간 ({activity.myRecords.length}개)
                    </Typography>

                    <List sx={{ p: 0 }}>
                      {activity.myRecords.map((record, index) => (
                        <React.Fragment key={record.recordId}>
                          <Paper sx={{ p: 2, mb: 2, bgcolor: '#F5F5F5', borderRadius: '12px' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    {record.segmentName}
                                  </Typography>
                                  <Chip
                                    label={getRoleLabel(record.role)}
                                    size="small"
                                    sx={{
                                      height: 20,
                                      bgcolor: record.role === 'main_runner' ? '#2196F3' : '#96ACC1',
                                      color: '#fff'
                                    }}
                                  />

                                  {/* ⭐ 修复：skipped 状态优先判断，避免重复显示 */}
                                  {record.status === 'skipped' ? (
                                    <Chip
                                      label="미완료"
                                      size="small"
                                      sx={{
                                        height: 20,
                                        bgcolor: '#FFEBEE',
                                        color: '#F44336',
                                        fontWeight: 600
                                      }}
                                    />
                                  ) : record.status === 'completed' && record.isOnTime ? (
                                    <CheckCircleIcon sx={{ fontSize: 20, color: '#4CAF50' }} />
                                  ) : record.status === 'completed' && !record.isOnTime ? (
                                    <Chip
                                      label="지연 완료"
                                      size="small"
                                      sx={{
                                        height: 20,
                                        bgcolor: '#FFF3E0',
                                        color: '#FF9800',
                                        fontWeight: 600
                                      }}
                                    />
                                  ) : null}
                                </Box>
                                <Typography variant="caption" sx={{ color: '#666' }}>
                                  {record.startPoint} → {record.endPoint}
                                </Typography>
                              </Box>
                            </Box>

                            {/* 同伴列表 */}
                            {record.companions && record.companions.length > 0 && (
                              <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #E0E0E0' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <PeopleIcon sx={{ fontSize: 18, mr: 0.5, color: '#666' }} />
                                  <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                                    함께 달린 사람
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                  {record.companions.map((companion) => (
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
                                      sx={{ bgcolor: '#fff' }}
                                    />
                                  ))}
                                </Box>
                              </Box>
                            )}
                          </Paper>
                        </React.Fragment>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8, color: '#999' }}>
            <EmojiEventsIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
            <Typography variant="h6">완료된 활동이 없습니다</Typography>
            <Typography variant="body2">팀에 가입하여 활동을 시작해보세요!</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default ActivityHistory;