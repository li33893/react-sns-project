// GroupApplications.js - 队长审核申请页面
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
  Box, Typography, Card, CardContent, Avatar, Button, IconButton,
  List,
  // List, ListItem, ListItemAvatar, ListItemText,  <- 删除这行
  Chip, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Tabs, Tab,
  Alert, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import PersonIcon from '@mui/icons-material/Person';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import WorkIcon from '@mui/icons-material/Work';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';

function GroupApplications() {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [currentUserId, setCurrentUserId] = useState('');
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0); // 0: 待审核, 1: 已处理
    const [selectedApp, setSelectedApp] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState(''); // 'approve' or 'reject'
    const [rejectionReason, setRejectionReason] = useState('');
    const [reassignSegmentId, setReassignSegmentId] = useState('');
    const [availableSegments, setAvailableSegments] = useState([]);

    const fetchApplications = React.useCallback((leaderId) => {
        fetch(`http://localhost:3010/group/${groupId}/applications?leaderId=${leaderId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.result === 'success') {
                    setApplications(data.applications || []);
                } else {
                    alert(data.msg);
                    navigate(`/group/${groupId}`);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch applications:', err);
                setLoading(false);
            });
    }, [groupId, navigate]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded = jwtDecode(token);
            setCurrentUserId(decoded.userId);
            fetchApplications(decoded.userId);
        } else {
            alert("로그인 후 이용해주세요.");
            navigate("/");
        }
    }, [groupId, navigate, fetchApplications]);


    const fetchAvailableSegments = () => {
        fetch(`http://localhost:3010/group/${groupId}?userId=${currentUserId}`)
            .then(res => res.json())
            .then(data => {
                if (data.result === 'success') {
                    const available = data.group.segments.filter(seg => !seg.userId);
                    setAvailableSegments(available);
                }
            })
            .catch(err => console.error(err));
    };

    const handleApproveClick = (app) => {
        setSelectedApp(app);
        setDialogType('approve');
        setReassignSegmentId(app.preferredSegmentId);
        fetchAvailableSegments();
        setDialogOpen(true);
    };

    const handleRejectClick = (app) => {
        setSelectedApp(app);
        setDialogType('reject');
        setRejectionReason('');
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedApp(null);
        setRejectionReason('');
        setReassignSegmentId('');
    };

    const handleSubmit = () => {
        if (dialogType === 'reject' && !rejectionReason.trim()) {
            alert('거절 사유를 입력해주세요.');
            return;
        }

        const payload = {
            reviewerId: currentUserId,
            status: dialogType === 'approve' ? 'approved' : 'rejected',
            rejectionReason: dialogType === 'reject' ? rejectionReason : null,
            assignedSegmentId: dialogType === 'approve' ? reassignSegmentId : null
        };

        fetch(`http://localhost:3010/group/application/${selectedApp.applicationId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                if (data.result === 'success') {
                    alert(data.msg);
                    handleDialogClose();
                    fetchApplications(currentUserId);
                } else {
                    alert(data.msg);
                }
            })
            .catch(err => {
                console.error('Review failed:', err);
                alert('심사 실패');
            });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return '#FF9800';
            case 'approved':
                return '#4CAF50';
            case 'rejected':
                return '#F44336';
            default:
                return '#9E9E9E';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending':
                return '대기 중';
            case 'approved':
                return '승인됨';
            case 'rejected':
                return '거절됨';
            default:
                return status;
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <PendingIcon />;
            case 'approved':
                return <CheckCircleIcon />;
            case 'rejected':
                return <CancelIcon />;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Typography>로딩 중...</Typography>
            </Box>
        );
    }

    const pendingApps = applications.filter(app => app.status === 'pending');
    const processedApps = applications.filter(app => app.status !== 'pending');
    const displayApps = tabValue === 0 ? pendingApps : processedApps;

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
                <IconButton onClick={() => navigate(`/group/${groupId}`)} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    가입 신청 관리
                </Typography>
            </Box>

            <Box sx={{ maxWidth: '800px', mx: 'auto', p: 3 }}>
                {/* Tabs */}
                <Card sx={{ borderRadius: '16px', mb: 3 }}>
                    <Tabs
                        value={tabValue}
                        onChange={(e, newValue) => setTabValue(newValue)}
                        sx={{
                            '& .MuiTab-root': {
                                fontWeight: 600,
                                fontSize: '16px',
                                flex: 1
                            },
                            '& .Mui-selected': {
                                color: '#96ACC1 !important'
                            },
                            '& .MuiTabs-indicator': {
                                bgcolor: '#96ACC1'
                            }
                        }}
                    >
                        <Tab
                            label={`대기 중 (${pendingApps.length})`}
                            icon={pendingApps.length > 0 ? <Chip label={pendingApps.length} size="small" sx={{ bgcolor: '#FF9800', color: '#fff' }} /> : null}
                            iconPosition="end"
                        />
                        <Tab label={`처리됨 (${processedApps.length})`} />
                    </Tabs>
                </Card>

                {/* 申请列表 */}
                {displayApps.length > 0 ? (
                    <List>
                        {displayApps.map((app) => (
                            <Card key={app.applicationId} sx={{ borderRadius: '16px', mb: 2 }}>
                                <CardContent sx={{ p: 3 }}>
                                    {/* 申请人信息 */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar
                                            src={app.profileImg}
                                            sx={{ width: 56, height: 56, mr: 2, bgcolor: '#96ACC1' }}
                                        >
                                            {app.nickname?.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                {app.nickname}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#666' }}>
                                                @{app.userId}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            icon={getStatusIcon(app.status)}
                                            label={getStatusLabel(app.status)}
                                            sx={{
                                                bgcolor: getStatusColor(app.status),
                                                color: '#fff',
                                                fontWeight: 600
                                            }}
                                        />
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    {/* 详细信息 */}
                                    <Box sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <DirectionsRunIcon sx={{ fontSize: 20, mr: 1, color: '#96ACC1' }} />
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                희망 구간: {app.segmentName} (순서: {app.segmentOrder})
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                                            <HealthAndSafetyIcon sx={{ fontSize: 20, mr: 1, color: '#4CAF50', mt: 0.5 }} />
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                                                    건강 상태:
                                                </Typography>
                                                <Typography variant="body2">
                                                    {app.healthInfo}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {app.occupation && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <WorkIcon sx={{ fontSize: 20, mr: 1, color: '#FF9800' }} />
                                                <Typography variant="body2">
                                                    직업: {app.occupation}
                                                </Typography>
                                            </Box>
                                        )}

                                        <Box sx={{ mt: 2, p: 2, bgcolor: '#F5F5F5', borderRadius: '12px' }}>
                                            <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 0.5 }}>
                                                신청 이유:
                                            </Typography>
                                            <Typography variant="body2">
                                                {app.applicationReason}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* 地址和共患 */}
                                    {(app.addr || app.comorbidity) && (
                                        <Box sx={{ mb: 2, p: 2, bgcolor: '#FFF3E0', borderRadius: '12px' }}>
                                            {app.addr && (
                                                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                                                    <strong>주소:</strong> {app.addr}
                                                </Typography>
                                            )}
                                            {app.comorbidity && (
                                                <Typography variant="caption" sx={{ display: 'block' }}>
                                                    <strong>기저질환:</strong> {app.comorbidity}
                                                </Typography>
                                            )}
                                        </Box>
                                    )}

                                    {/* 申请时间 */}
                                    <Typography variant="caption" sx={{ color: '#999', display: 'block', mb: 2 }}>
                                        신청 시간: {new Date(app.cdatetime).toLocaleString('ko-KR')}
                                    </Typography>

                                    {/* 操作按钮 */}
                                    {app.status === 'pending' && (
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                startIcon={<CheckCircleIcon />}
                                                onClick={() => handleApproveClick(app)}
                                                sx={{
                                                    bgcolor: '#4CAF50',
                                                    '&:hover': { bgcolor: '#45A049' }
                                                }}
                                            >
                                                승인
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                fullWidth
                                                startIcon={<CancelIcon />}
                                                onClick={() => handleRejectClick(app)}
                                                sx={{
                                                    color: '#F44336',
                                                    borderColor: '#F44336',
                                                    '&:hover': {
                                                        borderColor: '#D32F2F',
                                                        bgcolor: 'rgba(244, 67, 54, 0.1)'
                                                    }
                                                }}
                                            >
                                                거절
                                            </Button>
                                        </Box>
                                    )}

                                    {/* 已处理信息 */}
                                    {app.status !== 'pending' && (
                                        <Box sx={{ mt: 2, p: 2, bgcolor: '#F5F5F5', borderRadius: '12px' }}>
                                            <Typography variant="caption" sx={{ color: '#666' }}>
                                                처리 시간: {new Date(app.reviewedAt).toLocaleString('ko-KR')}
                                            </Typography>
                                            {app.status === 'rejected' && app.rejectionReason && (
                                                <Typography variant="body2" sx={{ mt: 1, color: '#F44336' }}>
                                                    거절 사유: {app.rejectionReason}
                                                </Typography>
                                            )}
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </List>
                ) : (
                    <Card sx={{ borderRadius: '16px', p: 4, textAlign: 'center' }}>
                        <PersonIcon sx={{ fontSize: 64, color: '#E0E0E0', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: '#999' }}>
                            {tabValue === 0 ? '대기 중인 신청이 없습니다' : '처리된 신청이 없습니다'}
                        </Typography>
                    </Card>
                )}
            </Box>

            {/* 审核弹窗 */}
            <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {dialogType === 'approve' ? '신청 승인' : '신청 거절'}
                </DialogTitle>
                <DialogContent>
                    {dialogType === 'approve' ? (
                        <>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                {selectedApp?.nickname}님의 신청을 승인하시겠습니까?
                            </Typography>

                            <Alert severity="info" sx={{ mb: 2 }}>
                                희망 구간: {selectedApp?.segmentName}
                            </Alert>

                            {availableSegments.length > 0 && availableSegments.every(seg => seg.segmentId !== selectedApp?.preferredSegmentId) && (
                                <>
                                    <Alert severity="warning" sx={{ mb: 2 }}>
                                        희망 구간이 이미 배정되었습니다. 다른 구간을 선택해주세요.
                                    </Alert>
                                    <TextField
                                        select
                                        fullWidth
                                        label="배정할 구간"
                                        value={reassignSegmentId}
                                        onChange={(e) => setReassignSegmentId(e.target.value)}
                                        SelectProps={{ native: true }}
                                    >
                                        <option value="">선택해주세요</option>
                                        {availableSegments.map((seg) => (
                                            <option key={seg.segmentId} value={seg.segmentId}>
                                                {seg.segmentName} ({seg.startPoint} → {seg.endPoint})
                                            </option>
                                        ))}
                                    </TextField>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                {selectedApp?.nickname}님의 신청을 거절하시겠습니까?
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="거절 사유 *"
                                placeholder="거절 사유를 입력해주세요"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>취소</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{
                            bgcolor: dialogType === 'approve' ? '#4CAF50' : '#F44336',
                            '&:hover': {
                                bgcolor: dialogType === 'approve' ? '#45A049' : '#D32F2F'
                            }
                        }}
                    >
                        {dialogType === 'approve' ? '승인' : '거절'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default GroupApplications;