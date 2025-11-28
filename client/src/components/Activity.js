import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
  Box, Typography, Card, CardContent, Avatar, Button, IconButton,
  List, ListItem, ListItemAvatar, ListItemText, Chip, LinearProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import TimerIcon from '@mui/icons-material/Timer';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import CancelIcon from '@mui/icons-material/Cancel';

function Activity() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState('');
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [skipDialogOpen, setSkipDialogOpen] = useState(false);
  const [skipUserId, setSkipUserId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setCurrentUserId(decoded.userId);
      fetchActivity(decoded.userId);
    } else {
      alert("로그인 후 이용해주세요.");
      navigate("/");
    }
  }, [groupId, navigate]);

  // 每秒更新时间（用于显示实时计时）
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 每5秒刷新活动状态
  useEffect(() => {
    if (currentUserId) {
      const refreshTimer = setInterval(() => {
        fetchActivity(currentUserId);
      }, 5000);

      return () => clearInterval(refreshTimer);
    }
  }, [currentUserId]);

  const fetchActivity = (userId) => {
    fetch(`http://localhost:3010/group/${groupId}/activity/current?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.result === 'success') {
          setActivity(data.activity);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch activity:', err);
        setLoading(false);
      });
  };

  const handleRelay = () => {
    if (!window.confirm('다음 주자에게 릴레이하시겠습니까?')) return;

    fetch(`http://localhost:3010/group/activity/${activity.activityId}/relay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ userId: currentUserId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.result === 'success') {
          alert(data.msg);
          if (data.isCompleted) {
            // 活动完成，返回队伍详情页
            navigate(`/group/${groupId}`);
          } else {
            fetchActivity(currentUserId);
          }
        } else {
          alert(data.msg);
        }
      })
      .catch(err => {
        console.error('Relay failed:', err);
        alert('릴레이 실패');
      });
  };

  const handleSkipClick = (userId) => {
    setSkipUserId(userId);
    setSkipDialogOpen(true);
  };

  const handleSkipConfirm = () => {
    fetch(`http://localhost:3010/group/activity/${activity.activityId}/skip`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ 
        userId: currentUserId,
        skipUserId: skipUserId
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.result === 'success') {
          alert(data.msg);
          setSkipDialogOpen(false);
          fetchActivity(currentUserId);
        } else {
          alert(data.msg);
        }
      })
      .catch(err => {
        console.error('Skip failed:', err);
        alert('스킵 실패');
      });
  };

  const handleCancelActivity = () => {
    if (!window.confirm('정말 이 활동을 취소하시겠습니까?')) return;

    fetch(`http://localhost:3010/group/activity/${activity.activityId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ userId: currentUserId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.result === 'success') {
          alert(data.msg);
          navigate(`/group/${groupId}`);
        } else {
          alert(data.msg);
        }
      })
      .catch(err => {
        console.error('Cancel failed:', err);
        alert('취소 실패');
      });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon sx={{ color: '#4CAF50' }} />;
      case 'running':
        return <DirectionsRunIcon sx={{ color: '#2196F3' }} />;
      case 'overtime':
        return <CheckCircleIcon sx={{ color: '#FF9800' }} />;
      case 'skipped':
        return <SkipNextIcon sx={{ color: '#9E9E9E' }} />;
      default:
        return <HourglassEmptyIcon sx={{ color: '#9E9E9E' }} />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return '완료';
      case 'running':
        return '진행 중';
      case 'overtime':
        return '지각 완료';
      case 'skipped':
        return '스킵됨';
      case 'waiting':
        return '대기 중';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'running':
        return '#2196F3';
      case 'overtime':
        return '#FF9800';
      case 'skipped':
        return '#9E9E9E';
      default:
        return '#E0E0E0';
    }
  };

  const calculateElapsedTime = (startTime) => {
    if (!startTime) return '00:00';
    const start = new Date(startTime);
    const diff = Math.floor((currentTime - start) / 1000); // 秒
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>로딩 중...</Typography>
      </Box>
    );
  }

  if (!activity) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>진행 중인 활동이 없습니다</Typography>
        <Button variant="contained" onClick={() => navigate(`/group/${groupId}`)}>
          팀 페이지로 돌아가기
        </Button>
      </Box>
    );
  }

  const currentRunner = activity.currentRunner;
  const completedCount = activity.records.filter(r => r.status === 'completed' || r.status === 'overtime').length;
  const totalCount = activity.records.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <Box sx={{ bgcolor: '#E2E2E2', minHeight: '100vh', pb: 4 }}>
      {/* 顶部工具栏 */}
      <Box
        sx={{
          bgcolor: '#fff',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate(`/group/${groupId}`)} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            릴레이 진행 중
          </Typography>
        </Box>

        {activity.isLeader && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<CancelIcon />}
            onClick={handleCancelActivity}
          >
            활동 취소
          </Button>
        )}
      </Box>

      <Box sx={{ maxWidth: '800px', mx: 'auto', p: 3 }}>
        {/* 进度条 */}
        <Card sx={{ borderRadius: '16px', mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                전체 진행률
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#96ACC1' }}>
                {completedCount} / {totalCount}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 12,
                borderRadius: '6px',
                bgcolor: '#E0E0E0',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#96ACC1',
                  borderRadius: '6px'
                }
              }}
            />
          </CardContent>
        </Card>

        {/* 当前跑步者 */}
        {currentRunner && (
          <Card sx={{ borderRadius: '16px', mb: 3, border: '2px solid #2196F3' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  현재 주자
                </Typography>
                <Chip
                  icon={<DirectionsRunIcon />}
                  label="진행 중"
                  sx={{ bgcolor: '#2196F3', color: '#fff', fontWeight: 600 }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={currentRunner.profileImg}
                  sx={{ width: 64, height: 64, mr: 2, bgcolor: '#96ACC1' }}
                >
                  {currentRunner.nickname?.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {currentRunner.nickname}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {currentRunner.segmentName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#999' }}>
                    {currentRunner.startPoint} → {currentRunner.endPoint}
                  </Typography>
                </Box>
              </Box>

              {/* 计时器 */}
              <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: '#F5F5F5', borderRadius: '12px', mb: 2 }}>
                <TimerIcon sx={{ fontSize: 32, mr: 1, color: '#2196F3' }} />
                <Box>
                  <Typography variant="caption" sx={{ color: '#666' }}>경과 시간</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#2196F3' }}>
                    {calculateElapsedTime(currentRunner.actualStartTime)}
                  </Typography>
                </Box>
                <Box sx={{ ml: 'auto', textAlign: 'right' }}>
                  <Typography variant="caption" sx={{ color: '#666' }}>제한 시간</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#666' }}>
                    {currentRunner.maxTime}분
                  </Typography>
                </Box>
              </Box>

              {/* 按钮区域 */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                {activity.userStatus.canRelay && (
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<PlayArrowIcon />}
                    onClick={handleRelay}
                    sx={{
                      bgcolor: '#2196F3',
                      py: 1.5,
                      borderRadius: '12px',
                      fontWeight: 600,
                      fontSize: '16px',
                      '&:hover': { bgcolor: '#1976D2' }
                    }}
                  >
                    릴레이 (다음 주자에게 전달)
                  </Button>
                )}

                {activity.isLeader && currentRunner.userId !== currentUserId && (
                  <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<SkipNextIcon />}
                    onClick={() => handleSkipClick(currentRunner.userId)}
                    sx={{ minWidth: 120 }}
                  >
                    스킵
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* 所有分段列表 */}
        <Card sx={{ borderRadius: '16px' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              구간별 진행 상황
            </Typography>
            <List>
              {activity.records.map((record, index) => (
                <ListItem
                  key={record.recordId}
                  sx={{
                    borderRadius: '12px',
                    mb: 1,
                    bgcolor: record.status === 'running' ? 'rgba(33, 150, 243, 0.1)' : '#F5F5F5',
                    border: record.status === 'running' ? '2px solid #2196F3' : 'none'
                  }}
                >
                  <ListItemAvatar>
                    {getStatusIcon(record.status)}
                  </ListItemAvatar>
                  <ListItemAvatar>
                    <Avatar
                      src={record.profileImg}
                      sx={{ bgcolor: '#96ACC1' }}
                    >
                      {record.nickname?.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {record.segmentName}
                        </Typography>
                        <Chip
                          label={getStatusLabel(record.status)}
                          size="small"
                          sx={{
                            bgcolor: getStatusColor(record.status),
                            color: '#fff',
                            height: 20,
                            fontSize: '11px'
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          {record.nickname}
                        </Typography>
                        {record.actualDuration && (
                          <Typography variant="caption" sx={{ color: record.isOnTime ? '#4CAF50' : '#FF9800' }}>
                            {record.actualDuration}분 소요 {!record.isOnTime && '(지각)'}
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* 提示信息 */}
        {activity.userStatus.isParticipant && !activity.userStatus.canRelay && (
          <Alert severity="info" sx={{ mt: 2, borderRadius: '12px' }}>
            {activity.userStatus.hasCompleted
              ? '구간을 완료했습니다! 다른 주자들을 응원해주세요.'
              : '당신의 차례를 기다려주세요.'}
          </Alert>
        )}
      </Box>

      {/* 跳过确认弹窗 */}
      <Dialog open={skipDialogOpen} onClose={() => setSkipDialogOpen(false)}>
        <DialogTitle>주자 스킵</DialogTitle>
        <DialogContent>
          <Typography>
            {skipUserId}님을 스킵하시겠습니까? 다음 주자가 즉시 시작됩니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSkipDialogOpen(false)}>취소</Button>
          <Button onClick={handleSkipConfirm} color="warning" variant="contained">
            스킵
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Activity;