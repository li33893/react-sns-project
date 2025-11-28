import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
  Box, Typography, Card, CardContent, Grid, Chip, TextField,
  InputAdornment, IconButton, Fab, Avatar, MenuItem, Select,
  FormControl, InputLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';

function Groups() {
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [intensityFilter, setIntensityFilter] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setCurrentUserId(decoded.userId);
      console.log('👤 Current userId:', decoded.userId);
      fetchGroups();
    } else {
      alert("로그인 후 이용해주세요.");
      navigate("/");
    }
  }, [navigate]);

  // 监听筛选条件变化，自动刷新列表
  useEffect(() => {
    if (currentUserId) {
      handleSearch();
    }
  }, [districtFilter, intensityFilter]);

  const fetchGroups = (params = {}) => {
    let queryParams = new URLSearchParams(params);
    const url = `http://localhost:3010/group?${queryParams.toString()}`;
    
    console.log('🔍 Fetching groups...');
    console.log('   Params:', params);
    console.log('   URL:', url);
    
    fetch(url)
      .then(res => {
        console.log('📡 Response status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('📦 API Response:', data);
        console.log('📦 Groups count:', data.groups?.length || 0);
        if (data.groups && data.groups.length > 0) {
          console.log('📦 First group sample:', data.groups[0]);
        }
        setGroups(data.groups || []);
      })
      .catch(err => {
        console.error('❌ Fetch error:', err);
      });
  };

  const handleSearch = () => {
    let params = {};
    if (searchQuery.trim()) params.search = searchQuery.trim();
    if (districtFilter) params.district = districtFilter;
    if (intensityFilter) params.intensityLevel = intensityFilter;
    
    console.log('🔎 Search triggered!');
    console.log('   searchQuery:', searchQuery);
    console.log('   districtFilter:', districtFilter);
    console.log('   intensityFilter:', intensityFilter);
    console.log('   Final params:', params);
    
    fetchGroups(params);
  };

  const handleCardClick = (groupId) => {
    console.log('🖱️ Card clicked!');
    console.log('   groupId:', groupId);
    console.log('   type:', typeof groupId);
    console.log('   Will navigate to:', `/group/${groupId}`);
    navigate(`/group/${groupId}`);
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

  return (
    <Box sx={{ bgcolor: '#E2E2E2', minHeight: '100vh', pb: 10 }}>
      {/* 顶部搜索和筛选区域 */}
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
          러닝 팀 찾기
        </Typography>

        {/* 搜索框 */}
        <TextField
          placeholder="팀 이름이나 지역으로 검색..."
          size="small"
          fullWidth
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
                <IconButton 
                  size="small" 
                  onClick={() => { 
                    setSearchQuery(''); 
                    fetchGroups(); 
                  }}
                >
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

        {/* 筛选器 */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120, bgcolor: '#fff', borderRadius: '12px' }}>
            <InputLabel>지역</InputLabel>
            <Select
              value={districtFilter}
              label="지역"
              onChange={(e) => {
                console.log('🏙️ District filter changed to:', e.target.value);
                setDistrictFilter(e.target.value);
                // useEffect 会自动处理，不需要手动调用 handleSearch
              }}
              sx={{ borderRadius: '12px' }}
            >
              <MenuItem value="">전체</MenuItem>
              <MenuItem value="강남구">강남구</MenuItem>
              <MenuItem value="서초구">서초구</MenuItem>
              <MenuItem value="송파구">송파구</MenuItem>
              <MenuItem value="용산구">용산구</MenuItem>
              <MenuItem value="마포구">마포구</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120, bgcolor: '#fff', borderRadius: '12px' }}>
            <InputLabel>강도</InputLabel>
            <Select
              value={intensityFilter}
              label="강도"
              onChange={(e) => {
                console.log('💪 Intensity filter changed to:', e.target.value);
                setIntensityFilter(e.target.value);
                // useEffect 会自动处理，不需要手动调用 handleSearch
              }}
              sx={{ borderRadius: '12px' }}
            >
              <MenuItem value="">전체</MenuItem>
              <MenuItem value="beginner">초급</MenuItem>
              <MenuItem value="intermediate">중급</MenuItem>
              <MenuItem value="advanced">고급</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* 队伍列表 */}
      <Box sx={{ padding: '20px' }}>
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
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(150, 172, 193, 0.2)'
                    }
                  }}
                  onClick={() => handleCardClick(group.groupId)}
                >
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

                    {/* 队长信息和人数 */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: '1px solid #eee' }}>
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
                          {group.memberCount || group.currentMembers}/{group.maxMembers}
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
            <DirectionsRunIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
            <Typography variant="h6">등록된 팀이 없습니다</Typography>
            <Typography variant="body2">첫 팀을 만들어보세요!</Typography>
          </Box>
        )}
      </Box>

      {/* 创建队伍按钮 */}
      <Fab
        onClick={() => navigate('/group/create')}
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
    </Box>
  );
}

export default Groups;