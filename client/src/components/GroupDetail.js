import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
    Box, Typography, Card, CardContent, Avatar, Chip, Button,
    IconButton, List, ListItem, ListItemAvatar, ListItemText,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Divider, Grid, Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

function GroupDetail() {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [group, setGroup] = useState(null);
    const [currentUserId, setCurrentUserId] = useState('');
    const [applyDialogOpen, setApplyDialogOpen] = useState(false);
    const [applicationForm, setApplicationForm] = useState({
        preferredSegmentId: '',
        healthInfo: '',
        occupation: '',
        applicationReason: ''
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            setCurrentUserId(decoded.userId);
            fetchGroupDetail(decoded.userId);
        } else {
            alert("로그인 후 이용해주세요.");
            navigate("/");
        }
    }, [groupId, navigate]);

    const fetchGroupDetail = (userId) => {
        fetch(`http://localhost:3010/group/${groupId}?userId=${userId}`)
            .then(res => res.json())
            .then(data => {
                if (data.result === 'success') {
                    setGroup(data.group);
                } else {
                    alert('팀 정보를 불러올 수 없습니다.');
                    navigate('/groups');
                }
            })
            .catch(err => {
                console.error('Failed to fetch group detail:', err);
            });
    };

    const handleApplyClick = () => {
        setApplyDialogOpen(true);
    };

    const handleApplySubmit = () => {
        if (!applicationForm.preferredSegmentId || !applicationForm.healthInfo || !applicationForm.applicationReason) {
            alert('필수 항목을 입력해주세요.');
            return;
        }

        fetch(`http://localhost:3010/group/${groupId}/apply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                userId: currentUserId,
                ...applicationForm
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.result === 'success') {
                    alert(data.msg);
                    setApplyDialogOpen(false);
                    fetchGroupDetail(currentUserId);
                } else {
                    alert(data.msg);
                }
            })
            .catch(err => {
                console.error('Apply failed:', err);
                alert('신청 실패');
            });
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

    if (!group) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Typography>로딩 중...</Typography>
            </Box>
        );
    }

    const canApply = !group.userStatus.isMember &&
        !group.userStatus.hasApplied &&
        group.status === 'recruiting';

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
                <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                    팀 상세정보
                </Typography>
            </Box>

            <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 3 }}>
                {/* 基本信息卡片 */}
                <Card sx={{ borderRadius: '16px', mb: 3, overflow: 'hidden' }}>
                    <CardContent sx={{ p: 3 }}>
                        {/* 标题和状态 */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: '#333' }}>
                                {group.groupName}
                            </Typography>
                            <Chip
                                label={getStatusLabel(group.status)}
                                sx={{
                                    bgcolor: group.status === 'recruiting' ? '#4CAF50' : '#FF9800',
                                    color: '#fff',
                                    fontWeight: 600
                                }}
                            />
                        </Box>

                        {/* 路线信息 */}
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#96ACC1' }}>
                                {group.routeName}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: '#666' }}>
                                <LocationOnIcon sx={{ fontSize: 20, mr: 1 }} />
                                <Typography variant="body2">
                                    {group.district} · {group.startLocation} → {group.endLocation}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: '#666' }}>
                                <DirectionsRunIcon sx={{ fontSize: 20, mr: 1 }} />
                                <Typography variant="body2">
                                    총 {group.totalDistance}km · 약 {group.estimatedTime}분
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                                <AccessTimeIcon sx={{ fontSize: 20, mr: 1 }} />
                                <Typography variant="body2">
                                    매주 {(() => {
                                        if (!group.weekDays) return '정보 없음';

                                        try {
                                            let weekDaysArray;

                                            // 如果已经是数组，直接使用
                                            if (Array.isArray(group.weekDays)) {
                                                weekDaysArray = group.weekDays;
                                            }
                                            // 如果是字符串，尝试解析
                                            else if (typeof group.weekDays === 'string') {
                                                weekDaysArray = JSON.parse(group.weekDays);
                                            }
                                            else {
                                                return '정보 없음';
                                            }

                                            const days = ['일', '월', '화', '수', '목', '금', '토'];
                                            return weekDaysArray.map(d => days[parseInt(d)]).join(', ');
                                        } catch (e) {
                                            console.error('weekDays 파싱 에러:', e);
                                            return '정보 없음';
                                        }
                                    })()} · {group.startTime?.slice(0, 5)}
                                </Typography>
                            </Box>
                        </Box>

                        {/* 强度和配速 */}
                        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                            <Chip
                                label={`${getIntensityLabel(group.intensityLevel)} ${group.avgPace ? `(${group.avgPace})` : ''}`}
                                sx={{
                                    bgcolor: getIntensityColor(group.intensityLevel),
                                    color: '#fff',
                                    fontWeight: 600
                                }}
                            />
                            <Chip
                                label={`${group.currentMembers}/${group.maxMembers}명`}
                                icon={<PeopleIcon sx={{ color: '#fff !important' }} />}
                                sx={{
                                    bgcolor: '#96ACC1',
                                    color: '#fff',
                                    fontWeight: 600
                                }}
                            />
                        </Box>

                        {/* 队长信息 */}
                        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: '#F5F5F5', borderRadius: '12px', mb: 3 }}>
                            <Avatar
                                src={group.leaderProfileImg}
                                sx={{ width: 48, height: 48, mr: 2, bgcolor: '#96ACC1' }}
                            >
                                {group.leaderNickname?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                                <Typography variant="caption" sx={{ color: '#666' }}>팀장</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    {group.leaderNickname}
                                </Typography>
                            </Box>
                        </Box>

                        {/* 描述 */}
                        {group.description && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.8 }}>
                                    {group.description}
                                </Typography>
                            </Box>
                        )}

                        {/* 申请按钮 */}
                        {canApply && (
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleApplyClick}
                                sx={{
                                    bgcolor: '#96ACC1',
                                    py: 1.5,
                                    borderRadius: '12px',
                                    fontWeight: 600,
                                    fontSize: '16px',
                                    '&:hover': { bgcolor: '#7A94A8' }
                                }}
                            >
                                팀 가입 신청하기
                            </Button>
                        )}

                        {group.userStatus.isMember && (
                            <Chip
                                label="이미 팀 멤버입니다"
                                icon={<CheckCircleIcon />}
                                sx={{ width: '100%', py: 2, bgcolor: '#E8F5E9', color: '#4CAF50', fontWeight: 600 }}
                            />
                        )}

                        {group.userStatus.hasApplied && group.userStatus.applicationStatus === 'pending' && (
                            <Chip
                                label="신청 대기 중"
                                icon={<PendingIcon />}
                                sx={{ width: '100%', py: 2, bgcolor: '#FFF3E0', color: '#FF9800', fontWeight: 600 }}
                            />
                        )}

                        {group.userStatus.hasApplied && group.userStatus.applicationStatus === 'rejected' && (
                            <Chip
                                label="신청이 거절되었습니다"
                                sx={{ width: '100%', py: 2, bgcolor: '#FFEBEE', color: '#F44336', fontWeight: 600 }}
                            />
                        )}
                    </CardContent>
                </Card>

                {/* 路线分段信息 */}
                <Card sx={{ borderRadius: '16px', mb: 3 }}>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            경로 구간 ({group.segments?.length || 0}구간)
                        </Typography>
                        <List>
                            {group.segments && group.segments.map((segment, index) => (
                                <React.Fragment key={segment.segmentId}>
                                    <ListItem
                                        sx={{
                                            borderRadius: '12px',
                                            bgcolor: segment.userId ? '#F5F5F5' : 'transparent',
                                            mb: 1
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar
                                                src={segment.profileImg}
                                                sx={{ bgcolor: segment.userId ? '#96ACC1' : '#E0E0E0' }}
                                            >
                                                {segment.userId ? segment.nickname?.charAt(0).toUpperCase() : index + 1}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                        {segment.segmentName || `제${index + 1}구간`}
                                                    </Typography>
                                                    {segment.role === 'leader' && (
                                                        <Chip label="팀장" size="small" sx={{ bgcolor: '#96ACC1', color: '#fff' }} />
                                                    )}
                                                </Box>
                                            }
                                            secondary={
                                                <>
                                                    <Typography variant="body2" sx={{ color: '#666' }}>
                                                        {segment.startPoint} → {segment.endPoint}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#999' }}>
                                                        {segment.segmentDistance}km · 예상 {segment.estimatedTime}분
                                                    </Typography>
                                                    {segment.userId && (
                                                        <Typography variant="caption" sx={{ display: 'block', color: '#96ACC1', fontWeight: 600 }}>
                                                            담당: {segment.nickname}
                                                        </Typography>
                                                    )}
                                                </>
                                            }
                                        />
                                        {!segment.userId && (
                                            <Chip
                                                label="모집 중"
                                                size="small"
                                                sx={{ bgcolor: '#4CAF50', color: '#fff' }}
                                            />
                                        )}
                                    </ListItem>
                                    {index < group.segments.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    </CardContent>
                </Card>

                {/* 队员列表 */}
                {group.members && group.members.length > 0 && (
                    <Card sx={{ borderRadius: '16px' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                팀 멤버 ({group.members.length}명)
                            </Typography>
                            <Grid container spacing={2}>
                                {group.members.map((member) => (
                                    <Grid item xs={12} sm={6} key={member.userId}>
                                        <Paper
                                            sx={{
                                                p: 2,
                                                borderRadius: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                bgcolor: '#F5F5F5'
                                            }}
                                        >
                                            <Avatar
                                                src={member.profileImg}
                                                sx={{ width: 40, height: 40, mr: 2, bgcolor: '#96ACC1' }}
                                            >
                                                {member.nickname?.charAt(0).toUpperCase()}
                                            </Avatar>
                                            <Box sx={{ flex: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                        {member.nickname}
                                                    </Typography>
                                                    {member.role === 'leader' && (
                                                        <Chip label="팀장" size="small" sx={{ height: 20, bgcolor: '#96ACC1', color: '#fff' }} />
                                                    )}
                                                </Box>
                                                <Typography variant="caption" sx={{ color: '#666' }}>
                                                    {member.segmentName || '미배정'}
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                )}
            </Box>

            {/* 申请弹窗 */}
            <Dialog
                open={applyDialogOpen}
                onClose={() => setApplyDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: '16px' } }}
            >
                <DialogTitle sx={{ fontWeight: 600 }}>팀 가입 신청</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
                        신청서를 작성해주세요. 팀장이 검토 후 승인합니다.
                    </Typography>

                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        희망 구간 선택 *
                    </Typography>
                    <TextField
                        select
                        fullWidth
                        margin="dense"
                        value={applicationForm.preferredSegmentId}
                        onChange={(e) => setApplicationForm({ ...applicationForm, preferredSegmentId: e.target.value })}
                        SelectProps={{ native: true }}
                        sx={{ mb: 2 }}
                    >
                        <option value="">선택해주세요</option>
                        {group.segments && group.segments.filter(s => !s.userId).map((segment) => (
                            <option key={segment.segmentId} value={segment.segmentId}>
                                {segment.segmentName} ({segment.startPoint} → {segment.endPoint})
                            </option>
                        ))}
                    </TextField>

                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        건강 상태 (특히 기저질환) *
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        margin="dense"
                        placeholder="기저질환이 있다면 자세히 적어주세요. 없다면 '없음'이라고 적어주세요."
                        value={applicationForm.healthInfo}
                        onChange={(e) => setApplicationForm({ ...applicationForm, healthInfo: e.target.value })}
                        sx={{ mb: 2 }}
                    />

                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        직업 (선택)
                    </Typography>
                    <TextField
                        fullWidth
                        margin="dense"
                        placeholder="예: 회사원, 학생, 프리랜서 등"
                        value={applicationForm.occupation}
                        onChange={(e) => setApplicationForm({ ...applicationForm, occupation: e.target.value })}
                        sx={{ mb: 2 }}
                    />

                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        신청 이유 *
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        margin="dense"
                        placeholder="이 팀에 가입하고 싶은 이유를 적어주세요."
                        value={applicationForm.applicationReason}
                        onChange={(e) => setApplicationForm({ ...applicationForm, applicationReason: e.target.value })}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setApplyDialogOpen(false)}>취소</Button>
                    <Button
                        onClick={handleApplySubmit}
                        variant="contained"
                        sx={{ bgcolor: '#96ACC1', '&:hover': { bgcolor: '#7A94A8' } }}
                    >
                        신청하기
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default GroupDetail;