import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
  Box, Typography, Card, CardContent, TextField, Button, IconButton,
  Stepper, Step, StepLabel, MenuItem, Chip, Grid, Paper, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

function CreateGroup() {
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [userCompletionRate, setUserCompletionRate] = useState(0);

  // 路线表单
  const [routeForm, setRouteForm] = useState({
    routeName: '',
    district: '',
    startLocation: '',
    endLocation: '',
    totalDistance: '',
    estimatedTime: '',
    intensityLevel: 'intermediate',
    avgPace: '',
    description: '',
    segments: [
      { segmentName: '제1구간', startPoint: '', endPoint: '', segmentDistance: '', estimatedTime: '', maxTime: '' }
    ]
  });

  // 队伍表单
  const [groupForm, setGroupForm] = useState({
    groupName: '',
    scheduleType: 'weekly',
    weekDays: [],
    startTime: '',
    description: ''
  });

  const steps = ['경로 정보', '구간 설정', '팀 정보'];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setCurrentUserId(decoded.userId);
      
      // 检查完成率
      fetch(`http://localhost:3010/user/${decoded.userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setUserCompletionRate(data.user.completionRate);
            if (data.user.completionRate < 90.0) {
              alert('팀장이 되려면 완료율이 90% 이상이어야 합니다.');
              navigate('/groups');
            }
          }
        })
        .catch(err => console.error(err));
    } else {
      alert("로그인 후 이용해주세요.");
      navigate("/");
    }
  }, [navigate]);

  const handleNext = () => {
    if (activeStep === 0) {
      // 验证路线基本信息
      if (!routeForm.routeName || !routeForm.district || !routeForm.startLocation || 
          !routeForm.endLocation || !routeForm.totalDistance || !routeForm.estimatedTime) {
        alert('필수 항목을 입력해주세요.');
        return;
      }
    } else if (activeStep === 1) {
      // 验证分段信息
      for (let seg of routeForm.segments) {
        if (!seg.startPoint || !seg.endPoint || !seg.segmentDistance || !seg.estimatedTime) {
          alert('모든 구간 정보를 입력해주세요.');
          return;
        }
      }
    } else if (activeStep === 2) {
      // 验证队伍信息
      if (!groupForm.groupName || !groupForm.startTime || groupForm.weekDays.length === 0) {
        alert('필수 항목을 입력해주세요.');
        return;
      }
      // 提交
      handleSubmit();
      return;
    }
    
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const addSegment = () => {
    setRouteForm({
      ...routeForm,
      segments: [
        ...routeForm.segments,
        {
          segmentName: `제${routeForm.segments.length + 1}구간`,
          startPoint: '',
          endPoint: '',
          segmentDistance: '',
          estimatedTime: '',
          maxTime: ''
        }
      ]
    });
  };

  const removeSegment = (index) => {
    if (routeForm.segments.length <= 1) {
      alert('최소 1개의 구간이 필요합니다.');
      return;
    }
    const newSegments = routeForm.segments.filter((_, i) => i !== index);
    setRouteForm({ ...routeForm, segments: newSegments });
  };

  const updateSegment = (index, field, value) => {
    const newSegments = [...routeForm.segments];
    newSegments[index][field] = value;
    
    // 自动计算 maxTime
    if (field === 'estimatedTime') {
      newSegments[index].maxTime = parseInt(value) + 2;
    }
    
    setRouteForm({ ...routeForm, segments: newSegments });
  };

  const toggleWeekDay = (day) => {
    const newWeekDays = groupForm.weekDays.includes(day)
      ? groupForm.weekDays.filter(d => d !== day)
      : [...groupForm.weekDays, day];
    setGroupForm({ ...groupForm, weekDays: newWeekDays });
  };

  const handleSubmit = async () => {
    try {
      // 1. 先创建路线
      const routeResponse = await fetch('http://localhost:3010/group/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...routeForm,
          createdBy: currentUserId
        })
      });

      const routeData = await routeResponse.json();
      
      if (routeData.result !== 'success') {
        alert(routeData.msg || '경로 생성 실패');
        return;
      }

      // 2. 创建队伍
      const groupResponse = await fetch('http://localhost:3010/group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...groupForm,
          routeId: routeData.routeId,
          leaderId: currentUserId,
          district: routeForm.district
        })
      });

      const groupData = await groupResponse.json();
      
      if (groupData.result === 'success') {
        alert('팀이 생성되었습니다!');
        navigate(`/group/${groupData.groupId}`);
      } else {
        alert(groupData.msg || '팀 생성 실패');
      }
    } catch (error) {
      console.error('Submit failed:', error);
      alert('생성 실패');
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
          새 팀 만들기
        </Typography>
      </Box>

      <Box sx={{ maxWidth: '800px', mx: 'auto', p: 3 }}>
        {/* 步骤指示器 */}
        <Card sx={{ borderRadius: '16px', mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Stepper activeStep={activeStep}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>

        {/* 步骤内容 */}
        <Card sx={{ borderRadius: '16px' }}>
          <CardContent sx={{ p: 3 }}>
            {/* 第1步：路线基本信息 */}
            {activeStep === 0 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  경로 기본 정보
                </Typography>

                <TextField
                  label="경로 이름"
                  fullWidth
                  margin="normal"
                  required
                  placeholder="예: 강남 야간 러닝 코스"
                  value={routeForm.routeName}
                  onChange={(e) => setRouteForm({ ...routeForm, routeName: e.target.value })}
                />

                <TextField
                  label="지역 (구)"
                  fullWidth
                  margin="normal"
                  required
                  select
                  value={routeForm.district}
                  onChange={(e) => setRouteForm({ ...routeForm, district: e.target.value })}
                >
                  <MenuItem value="강남구">강남구</MenuItem>
                  <MenuItem value="서초구">서초구</MenuItem>
                  <MenuItem value="송파구">송파구</MenuItem>
                  <MenuItem value="용산구">용산구</MenuItem>
                  <MenuItem value="마포구">마포구</MenuItem>
                  <MenuItem value="종로구">종로구</MenuItem>
                  <MenuItem value="중구">중구</MenuItem>
                </TextField>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="출발지"
                      fullWidth
                      margin="normal"
                      required
                      placeholder="예: 논현역 3번 출구"
                      value={routeForm.startLocation}
                      onChange={(e) => setRouteForm({ ...routeForm, startLocation: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="도착지"
                      fullWidth
                      margin="normal"
                      required
                      placeholder="예: 강남역 2번 출구"
                      value={routeForm.endLocation}
                      onChange={(e) => setRouteForm({ ...routeForm, endLocation: e.target.value })}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="총 거리 (km)"
                      fullWidth
                      margin="normal"
                      required
                      type="number"
                      placeholder="예: 5.2"
                      value={routeForm.totalDistance}
                      onChange={(e) => setRouteForm({ ...routeForm, totalDistance: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="예상 시간 (분)"
                      fullWidth
                      margin="normal"
                      required
                      type="number"
                      placeholder="예: 35"
                      value={routeForm.estimatedTime}
                      onChange={(e) => setRouteForm({ ...routeForm, estimatedTime: e.target.value })}
                    />
                  </Grid>
                </Grid>

                <TextField
                  label="강도"
                  fullWidth
                  margin="normal"
                  required
                  select
                  value={routeForm.intensityLevel}
                  onChange={(e) => setRouteForm({ ...routeForm, intensityLevel: e.target.value })}
                >
                  <MenuItem value="beginner">초급 (편안한 속도)</MenuItem>
                  <MenuItem value="intermediate">중급 (적당한 속도)</MenuItem>
                  <MenuItem value="advanced">고급 (빠른 속도)</MenuItem>
                </TextField>

                <TextField
                  label="평균 페이스 (선택)"
                  fullWidth
                  margin="normal"
                  placeholder="예: 6min/km (한글x)"
                  value={routeForm.avgPace}
                  onChange={(e) => setRouteForm({ ...routeForm, avgPace: e.target.value })}
                />

                <TextField
                  label="경로 설명 (선택)"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                  placeholder="이 경로에 대해 간단히 설명해주세요"
                  value={routeForm.description}
                  onChange={(e) => setRouteForm({ ...routeForm, description: e.target.value })}
                />
              </Box>
            )}

            {/* 第2步：分段设置 */}
            {activeStep === 1 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    구간 설정 ({routeForm.segments.length}구간)
                  </Typography>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={addSegment}
                    sx={{ color: '#96ACC1' }}
                  >
                    구간 추가
                  </Button>
                </Box>

                <Typography variant="body2" sx={{ mb: 3, color: '#666' }}>
                  각 구간마다 1명의 러너가 배정됩니다. 거리와 시간을 직접 입력해주세요.
                </Typography>

                {routeForm.segments.map((segment, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 2.5,
                      mb: 2,
                      borderRadius: '12px',
                      bgcolor: '#F5F5F5',
                      position: 'relative'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {segment.segmentName}
                      </Typography>
                      {routeForm.segments.length > 1 && (
                        <IconButton
                          size="small"
                          onClick={() => removeSegment(index)}
                          sx={{ color: '#F44336' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="시작점"
                          fullWidth
                          size="small"
                          required
                          placeholder="예: 논현역"
                          value={segment.startPoint}
                          onChange={(e) => updateSegment(index, 'startPoint', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="끝점"
                          fullWidth
                          size="small"
                          required
                          placeholder="예: 신논현역"
                          value={segment.endPoint}
                          onChange={(e) => updateSegment(index, 'endPoint', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          label="거리 (km)"
                          fullWidth
                          size="small"
                          required
                          type="number"
                          placeholder="1.5"
                          value={segment.segmentDistance}
                          onChange={(e) => updateSegment(index, 'segmentDistance', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          label="예상 시간 (분)"
                          fullWidth
                          size="small"
                          required
                          type="number"
                          placeholder="10"
                          value={segment.estimatedTime}
                          onChange={(e) => updateSegment(index, 'estimatedTime', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          label="최대 시간 (분)"
                          fullWidth
                          size="small"
                          type="number"
                          placeholder="12"
                          value={segment.maxTime}
                          onChange={(e) => updateSegment(index, 'maxTime', e.target.value)}
                          helperText="초과 시 지각"
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </Box>
            )}

            {/* 第3步：队伍信息 */}
            {activeStep === 2 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  팀 정보
                </Typography>

                <TextField
                  label="팀 이름"
                  fullWidth
                  margin="normal"
                  required
                  placeholder="예: 강남 야간 러닝 크루"
                  value={groupForm.groupName}
                  onChange={(e) => setGroupForm({ ...groupForm, groupName: e.target.value })}
                />

                <Box sx={{ mt: 3, mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    활동 요일 선택 *
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                      <Chip
                        key={index}
                        label={day}
                        onClick={() => toggleWeekDay(String(index))}
                        sx={{
                          bgcolor: groupForm.weekDays.includes(String(index)) ? '#96ACC1' : '#E0E0E0',
                          color: groupForm.weekDays.includes(String(index)) ? '#fff' : '#666',
                          fontWeight: 600,
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: groupForm.weekDays.includes(String(index)) ? '#7A94A8' : '#D0D0D0'
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <TextField
                  label="시작 시간"
                  fullWidth
                  margin="normal"
                  required
                  type="time"
                  value={groupForm.startTime}
                  onChange={(e) => setGroupForm({ ...groupForm, startTime: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  label="팀 소개 (선택)"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                  placeholder="팀에 대해 소개하고 어떤 사람들을 찾는지 적어주세요"
                  value={groupForm.description}
                  onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
                />

                <Divider sx={{ my: 3 }} />

                <Typography variant="subtitle2" sx={{ mb: 2, color: '#666' }}>
                  생성 요약
                </Typography>
                <Box sx={{ bgcolor: '#F5F5F5', p: 2, borderRadius: '12px' }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>경로:</strong> {routeForm.routeName}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>총 거리:</strong> {routeForm.totalDistance}km · 약 {routeForm.estimatedTime}분
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>구간:</strong> {routeForm.segments.length}개
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>최대 인원:</strong> {routeForm.segments.length}명
                  </Typography>
                  <Typography variant="body2">
                    <strong>활동 일정:</strong> 매주{' '}
                    {groupForm.weekDays.map(d => ['일', '월', '화', '수', '목', '금', '토'][d]).join(', ')}{' '}
                    {groupForm.startTime}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* 按钮 */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ minWidth: 100 }}
              >
                이전
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{
                  minWidth: 100,
                  bgcolor: '#96ACC1',
                  '&:hover': { bgcolor: '#7A94A8' }
                }}
              >
                {activeStep === steps.length - 1 ? '팀 생성' : '다음'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default CreateGroup;