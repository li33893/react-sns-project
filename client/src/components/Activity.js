import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
  Box, Typography, Card, CardContent, Avatar, Button, IconButton,
  List, ListItem, ListItemAvatar, ListItemText, Chip, LinearProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert, Paper, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import TimerIcon from '@mui/icons-material/Timer';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import CancelIcon from '@mui/icons-material/Cancel';
import PeopleIcon from '@mui/icons-material/People';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
    if (!window.confirm('다음 구간으로 릴레이하시겠습니까?')) return;

    fetch(`http://localhost:3010/group/activity/${activity.activityId}/relay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ 
        operatorId: currentUserId
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.result === 'success') {
          alert(data.msg);
          
          if (data.isCompleted) {
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

  const getRoleLabel = (role) => {
    return role === 'main_runner' ? '주자' : '동행자';
  };

  const calculateElapsedTime = (startTime) => {
    if (!startTime) return '00:00';
    const start = new Date(startTime);
    const diff = Math.floor((currentTime - start) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const formatDeadline = (deadline) => {
    if (!deadline) return '';
    const d = new Date(deadline);
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
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

  // ⭐ 按段分组记录
  const segmentGroups = {};
  activity.records.forEach(record => {
    if (!segmentGroups[record.segmentOrder]) {
      segmentGroups[record.segmentOrder] = {
        segmentName: record.segmentName,
        segmentOrder: record.segmentOrder,
        startPoint: record.startPoint,
        endPoint: record.endPoint,
        runners: []
      };
    }
    segmentGroups[record.segmentOrder].runners.push(record);
  });

  const segments = Object.values(segmentGroups).sort((a, b) => a.segmentOrder - b.segmentOrder);

  // ⭐ 找出当前正在跑的段
  const currentSegment = segments.find(seg => seg.runners.some(r => r.status === 'running'));
  const runningRecords = currentSegment ? currentSegment.runners.filter(r => r.status === 'running') : [];

  // ⭐ 找出下一段的主跑者（用于按钮文案）
  const nextSegment = currentSegment ? segments.find(seg => seg.segmentOrder === currentSegment.segmentOrder + 1) : null;
  const nextMainRunner = nextSegment ? nextSegment.runners.find(r => r.role === 'main_runner') : null;

  // ⭐ 判断是否是最后一段
  const isLastSegment = currentSegment && currentSegment.segmentOrder === segments.length;

  // ⭐ 计算进度
  const completedSegments = segments.filter(seg => seg.runners.every(r => r.status === 'completed' || r.status === 'overtime')).length;
  const totalSegments = segments.length;
  const progress = (completedSegments / totalSegments) * 100;

  // ⭐ 检查当前用户状态
  const isCurrentRunner = runningRecords.some(r => r.userId === currentUserId);
  const isLeader = activity.isLeader;
  const canRelay = isCurrentRunner || isLeader;

  // ⭐ 按钮文案逻辑
  const getRelayButtonText = () => {
    if (isLastSegment) {
      return '활동 완료하기';
    }
    
    if (nextMainRunner) {
      // 检查下一段的主跑者是否就是当前的主跑者（最后一人继续的情况）
      const currentMainRunner = runningRecords.find(r => r.role === 'main_runner');
      if (nextMainRunner.userId === currentMainRunner?.userId) {
        return `${nextMainRunner.nickname}님 계속 달리기`;
      }
      return `${nextMainRunner.nickname}님에게 릴레이`;
    }
    
    return '다음 구간으로';
  };

  const getRelayButtonIcon = () => {
    if (isLastSegment) {
      return <EmojiEventsIcon />;
    }
    return <ArrowForwardIcon />;
  };

  return (
    <Box sx={{ bgcolor: '#E2E2E2', minHeight: '100vh', pb: 4 }}>
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

        {isLeader && (
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
        {/* 整体进度 */}
        <Card sx={{ borderRadius: '16px', mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                전체 진행률
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#96ACC1' }}>
                {completedSegments} / {totalSegments} 구간
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

        {/* ⭐ 当前段信息（如果有正在跑的） */}
        {currentSegment && runningRecords.length > 0 && (
          <Card sx={{ borderRadius: '16px', mb: 3, border: '2px solid #2196F3' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  현재 구간: {currentSegment.segmentName}
                </Typography>
                <Chip
                  icon={<DirectionsRunIcon />}
                  label="진행 중"
                  sx={{ bgcolor: '#2196F3', color: '#fff', fontWeight: 600 }}
                />
              </Box>

              <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                {currentSegment.startPoint} → {currentSegment.endPoint}
              </Typography>

              {/* ⭐ 当前跑步者列表（1-2人） */}
              <Paper sx={{ p: 2, bgcolor: '#F5F5F5', borderRadius: '12px', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PeopleIcon sx={{ mr: 1, color: '#2196F3' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    현재 달리는 사람 ({runningRecords.length}명)
                  </Typography>
                </Box>

                {runningRecords.map((record, index) => (
                  <Box key={record.recordId}>
                    {index > 0 && <Divider sx={{ my: 1 }} />}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <Avatar
                          src={record.profileImg}
                          sx={{ width: 40, height: 40, mr: 2, bgcolor: '#96ACC1' }}
                        >
                          {record.nickname?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {record.nickname}
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
                          </Box>
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            개인 마감: {formatDeadline(record.personalDeadline)}
                          </Typography>
                        </Box>
                      </Box>

                      {/* 计时器 */}
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2196F3' }}>
                          {calculateElapsedTime(record.actualStartTime)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          경과 시간
                        </Typography>
                      </Box>

                      {/* 队长可以跳过 */}
                      {isLeader && record.userId !== currentUserId && (
                        <IconButton 
                          size="small" 
                          onClick={() => handleSkipClick(record.userId)}
                          sx={{ ml: 1 }}
                        >
                          <SkipNextIcon />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                ))}
              </Paper>

              {/* ⭐ 下一段预告 */}
              {nextMainRunner && !isLastSegment && (
                <Alert severity="info" sx={{ mb: 2, borderRadius: '12px' }}>
                  <Typography variant="body2">
                    <strong>다음 주자:</strong> {nextMainRunner.nickname}님
                    {nextSegment.runners.length > 1 && 
                      ` (${nextSegment.runners.find(r => r.role === 'companion')?.nickname}님과 함께)`
                    }
                  </Typography>
                </Alert>
              )}

              {/* ⭐ 角色说明 */}
              {runningRecords.find(r => r.userId === currentUserId && r.role === 'main_runner') && (
                <Alert severity="success" icon={<DirectionsRunIcon />} sx={{ mb: 2, borderRadius: '12px' }}>
                  당신은 이 구간의 <strong>주자</strong>입니다!
                  {runningRecords.length > 1 && ' 동행자가 함께 달리고 있습니다.'}
                </Alert>
              )}
              
              {runningRecords.find(r => r.userId === currentUserId && r.role === 'companion') && (
                <Alert severity="info" icon={<PeopleIcon />} sx={{ mb: 2, borderRadius: '12px' }}>
                  당신은 이 구간의 <strong>동행자</strong>입니다. 주자를 응원하며 함께 달려주세요!
                </Alert>
              )}

              {/* ⭐ 接力按钮 */}
              {canRelay && (
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={getRelayButtonIcon()}
                  onClick={handleRelay}
                  sx={{
                    bgcolor: isLastSegment ? '#4CAF50' : '#2196F3',
                    py: 1.5,
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '16px',
                    '&:hover': { bgcolor: isLastSegment ? '#45A049' : '#1976D2' }
                  }}
                >
                  {getRelayButtonText()}
                  {!isLeader && isCurrentRunner && ' (주자/동행자 완료)'}
                  {isLeader && !isCurrentRunner && ' (팀장 권한)'}
                </Button>
              )}

              {!canRelay && activity.userStatus.isParticipant && (
                <Alert severity="info" sx={{ borderRadius: '12px' }}>
                  현재 주자 또는 동행자가 릴레이 버튼을 누를 때까지 기다려주세요
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* ⭐ 所有段的详细进度 */}
        <Card sx={{ borderRadius: '16px' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              구간별 진행 상황
            </Typography>
            <List>
              {segments.map((segment, segIndex) => {
                const allCompleted = segment.runners.every(r => r.status === 'completed' || r.status === 'overtime');
                const anyRunning = segment.runners.some(r => r.status === 'running');

                return (
                  <React.Fragment key={segment.segmentOrder}>
                    <ListItem
                      sx={{
                        borderRadius: '12px',
                        mb: 1,
                        bgcolor: anyRunning ? 'rgba(33, 150, 243, 0.1)' : allCompleted ? '#F5F5F5' : 'transparent',
                        border: anyRunning ? '2px solid #2196F3' : 'none',
                        flexDirection: 'column',
                        alignItems: 'flex-start'
                      }}
                    >
                      {/* 段标题 */}
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600, mr: 1 }}>
                          {segment.segmentName}
                        </Typography>
                        {anyRunning && (
                          <Chip 
                            label="진행 중" 
                            size="small" 
                            sx={{ bgcolor: '#2196F3', color: '#fff' }} 
                          />
                        )}
                        {allCompleted && (
                          <Chip 
                            label="완료" 
                            size="small" 
                            sx={{ bgcolor: '#4CAF50', color: '#fff' }} 
                          />
                        )}
                      </Box>

                      <Typography variant="caption" sx={{ color: '#666', mb: 1 }}>
                        {segment.startPoint} → {segment.endPoint}
                      </Typography>

                      {/* 该段的跑步者（1-2人） */}
                      <Box sx={{ width: '100%' }}>
                        {segment.runners.map((record, runnerIndex) => (
                          <Box 
                            key={record.recordId}
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              p: 1, 
                              bgcolor: '#fff', 
                              borderRadius: '8px',
                              mb: runnerIndex < segment.runners.length - 1 ? 1 : 0
                            }}
                          >
                            <ListItemAvatar sx={{ minWidth: 'auto', mr: 1 }}>
                              {getStatusIcon(record.status)}
                            </ListItemAvatar>
                            <ListItemAvatar>
                              <Avatar
                                src={record.profileImg}
                                sx={{ width: 32, height: 32, bgcolor: '#96ACC1' }}
                              >
                                {record.nickname?.charAt(0).toUpperCase()}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {record.nickname}
                                  </Typography>
                                  <Chip 
                                    label={getRoleLabel(record.role)} 
                                    size="small" 
                                    sx={{ 
                                      height: 18, 
                                      fontSize: '10px',
                                      bgcolor: record.role === 'main_runner' ? '#E3F2FD' : '#F5F5F5',
                                      color: record.role === 'main_runner' ? '#2196F3' : '#666'
                                    }} 
                                  />
                                </Box>
                              }
                              secondary={
                                <>
                                  {record.status === 'completed' && record.actualDuration && (
                                    <Typography variant="caption" sx={{ color: record.isOnTime ? '#4CAF50' : '#FF9800' }}>
                                      {record.actualDuration}분 소요 {!record.isOnTime && '(개인 마감 초과)'}
                                    </Typography>
                                  )}
                                  {record.status === 'skipped' && (
                                    <Typography variant="caption" sx={{ color: '#9E9E9E' }}>
                                      스킵됨
                                    </Typography>
                                  )}
                                </>
                              }
                              sx={{ m: 0 }}
                            />
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
                        ))}
                      </Box>
                    </ListItem>
                    {segIndex < segments.length - 1 && <Divider sx={{ my: 1 }} />}
                  </React.Fragment>
                );
              })}
            </List>
          </CardContent>
        </Card>

        {/* 用户状态提示 */}
        {activity.userStatus.isParticipant && !isCurrentRunner && !isLeader && (
          <Alert severity="info" sx={{ mt: 2, borderRadius: '12px' }}>
            {activity.userStatus.hasCompleted
              ? '🎉 모든 구간을 완료했습니다! 다른 주자들을 응원해주세요.'
              : '⏳ 당신의 차례를 기다려주세요. 곧 릴레이가 전달됩니다!'}
          </Alert>
        )}
      </Box>

      {/* 跳过确认对话框 */}
      <Dialog open={skipDialogOpen} onClose={() => setSkipDialogOpen(false)}>
        <DialogTitle>주자 스킵</DialogTitle>
        <DialogContent>
          <Typography>
            {skipUserId}님을 스킵하시겠습니까? 다음 구간으로 자동으로 넘어갑니다.
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
