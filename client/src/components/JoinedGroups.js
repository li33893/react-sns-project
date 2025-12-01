import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
  Box, Typography, Card, CardContent, Grid, Chip, Avatar,
  IconButton, Paper, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

function JoinedGroups() {
  const [groups, setGroups] = useState([]);
  const [currentUserId, setCurrentUserId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setCurrentUserId(decoded.userId);
      fetchJoinedGroups(decoded.userId);
    } else {
      alert("로그인 후 이용해주세요.");
      navigate("/");
    }
  }, [navigate]);

  const fetchJoinedGroups = (userId) => {
    fetch(`http://localhost:3010/group/user/${userId}/joined-groups`)
      .then(res => res.json())
      .then(data => {
        if (data.result === 'success') {
          setGroups(data.groups);
        }
      })
      .catch(err => console.error('Failed to fetch joined groups:', err));
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'recruiting':
        return '모집중';
      case 'full':
        return '모집완료';
      case 'active':
        return '진행중';
      case 'ended':
        return '종료';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'recruiting':
        return '#4CAF50';
      case 'full':
        return '#FF9800';
      case 'active':
        return '#2196F3';
      case 'ended':
        return '#9E9E9E';
      default:
        return '#96ACC1';
    }
  };

  const getIntensityLabel = (level) => {
    switch (level) {
      case 'beginner':
        return '초급';
      case 'intermediate':
        return '중급';
      case 'advanced':
        return '고급';
      default:
        return level;
    }
  };

  const getIntensityColor = (level) => {
    switch (level) {
      case 'beginner':
        return '#4CAF50';
      case 'intermediate':
        return '#FF9800';
      case 'advanced':
        return '#F44336';
      default:
        return '#96ACC1';
    }
  };

  const handleCardClick = (groupId, currentActivityId) => {
    // 如果有进行中的活动，跳转到活动页面，否则跳转到队伍详情
    if (currentActivityId) {
      navigate(`/group/${groupId}/activity`);
    } else {
      navigate(`/group/${groupId}`);
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
          가입된 팀
        </Typography>
      </Box>

      <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 3 }}>
        {groups.length > 0 ? (
          <Grid container spacing={2.5}>
            {groups.map((group) => (
              <Grid item xs={12} sm={6} md={4} key={group.groupId}>
                <Card
                  sx={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    bgcolor: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(150, 172, 193, 0.2)'
                    }
                  }}
                  onClick={() => handleCardClick(group.groupId, group.currentActivityId)}
                >
                  {/* 进行中活动标记 */}
                  {group.currentActivityId && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bgcolor: '#2196F3',
                        color: '#fff',
                        px: 2,
                        py: 0.5,
                        borderBottomLeftRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        zIndex: 1
                      }}
                    >
                      <PlayCircleOutlineIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        활동 중
                      </Typography>
                    </Box>
                  )}

                  <CardContent sx={{ p: 2.5 }}>
                    {/* 状态标签 */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Chip
                        label={getStatusLabel(group.status)}
                        size="small"
                        sx={{
                          bgcolor: getStatusColor(group.status),
                          color: '#fff',
                          fontWeight: 600
                        }}
                      />
                      <Chip
                        label={getIntensityLabel(group.intensityLevel)}
                        size="small"
                        sx={{
                          bgcolor: getIntensityColor(group.intensityLevel),
                          color: '#fff',
                          fontWeight: 600
                        }}
                      />
                    </Box>

                    {/* 队伍名称 */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: '#333',
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {group.groupName}
                    </Typography>

                    {/* 路线名称 */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: '#666' }}>
                      <DirectionsRunIcon sx={{ fontSize: 18, mr: 0.5 }} />
                      <Typography variant="body2" sx={{ fontSize: '14px' }}>
                        {group.routeName}
                      </Typography>
                    </Box>

                    {/* 地区 */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: '#666' }}>
                      <LocationOnIcon sx={{ fontSize: 18, mr: 0.5 }} />
                      <Typography variant="body2" sx={{ fontSize: '14px' }}>
                        {group.district} · {group.startLocation} → {group.endLocation}
                      </Typography>
                    </Box>

                    {/* 时间 */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: '#666' }}>
                      <AccessTimeIcon sx={{ fontSize: 18, mr: 0.5 }} />
                      <Typography variant="body2" sx={{ fontSize: '14px' }}>
                        {group.startTime?.slice(0, 5)} · 약 {group.estimatedTime}분
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* 我的信息 */}
                    <Paper sx={{ p: 1.5, bgcolor: '#F5F5F5', borderRadius: '8px', mb: 2 }}>
                      <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 0.5 }}>
                        내 담당 구간
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#2196F3' }}>
                        {group.mySegmentName || '미배정'}
                      </Typography>
                      {group.myCompletionRate !== null && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                          <EmojiEventsIcon sx={{ fontSize: 16, color: '#FF9800' }} />
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            완료율: {group.myCompletionRate?.toFixed(1)}%
                          </Typography>
                        </Box>
                      )}
                    </Paper>

                    {/* 队长信息和人数 */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          src={group.leaderProfileImg}
                          sx={{ width: 28, height: 28, mr: 1, bgcolor: '#96ACC1' }}
                        >
                          {group.leaderNickname?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                          {group.leaderNickname}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', color: '#96ACC1' }}>
                        <PeopleIcon sx={{ fontSize: 18, mr: 0.5 }} />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {group.memberCount}/{group.maxMembers}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8, color: '#999' }}>
            <PeopleIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
            <Typography variant="h6">가입된 팀이 없습니다</Typography>
            <Typography variant="body2">팀에 가입하여 활동을 시작해보세요!</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default JoinedGroups;