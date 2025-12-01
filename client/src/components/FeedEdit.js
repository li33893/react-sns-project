import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
  Box, Typography, Container, TextField, Button, IconButton,
  Paper, Avatar, Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

function FeedEdit() {
  const { feedId } = useParams();
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState('');
  const [feed, setFeed] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const MAX_TOTAL_IMAGES = 9;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setCurrentUserId(decoded.userId);
      fetchFeedDetail(feedId);
    } else {
      alert("로그인 후 이용해주세요.");
      navigate("/");
    }
  }, [feedId, navigate]);

  const fetchFeedDetail = (feedId) => {
    fetch(`http://localhost:3010/feed/detail/${feedId}`)
      .then(res => res.json())
      .then(data => {
        if (data.result === 'success') {
          setFeed(data.feed);
          setTitle(data.feed.title || '');
          setContent(data.feed.content || '');
          setExistingImages(data.feed.images || []);
        } else {
          alert('피드를 불러올 수 없습니다.');
          navigate('/feed');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert('피드 로딩 실패');
        navigate('/feed');
      });
  };

  const handleDeleteExistingImage = (imgId) => {
    if (!window.confirm('이 이미지를 삭제하시겠습니까?')) return;

    fetch(`http://localhost:3010/feed/image/${imgId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.result === 'success') {
          setExistingImages(existingImages.filter(img => img.imgId !== imgId));
        } else {
          alert('이미지 삭제 실패');
        }
      })
      .catch(err => {
        console.error(err);
        alert('이미지 삭제 실패');
      });
  };

  const handleNewFileChange = (event) => {
    const files = Array.from(event.target.files);
    const totalImages = existingImages.length + newFiles.length + files.length;

    if (totalImages > MAX_TOTAL_IMAGES) {
      alert(`최대 ${MAX_TOTAL_IMAGES}개의 이미지만 업로드할 수 있습니다`);
      return;
    }

    setNewFiles([...newFiles, ...files]);
  };

  const removeNewFile = (index) => {
    setNewFiles(newFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert('내용을 입력해주세요!');
      return;
    }

    try {
      // 1. 更新文本内容
      const updateRes = await fetch(`http://localhost:3010/feed/${feedId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: title || null,
          content: content
        })
      });

      const updateData = await updateRes.json();

      if (updateData.result !== 'success') {
        alert('수정 실패');
        return;
      }

      // 2. 上传新图片（如果有）
      if (newFiles.length > 0) {
        const formData = new FormData();
        newFiles.forEach(file => {
          formData.append('file', file);
        });

        await fetch(`http://localhost:3010/feed/upload-additional/${feedId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });
      }

      alert('수정이 완료되었습니다!');
      navigate('/mypage');
    } catch (err) {
      console.error(err);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>로딩 중...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#F5F5F5', minHeight: '100vh', pb: 4 }}>
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
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          피드 수정
        </Typography>
        <Box sx={{ width: 40 }} />
      </Box>

      <Container maxWidth="sm" sx={{ mt: 3 }}>
        {/* 标题 */}
        <Paper elevation={0} sx={{ p: 3, mb: 2, borderRadius: '16px', bgcolor: '#fff' }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            제목 (선택사항)
          </Typography>
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            variant="outlined"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                bgcolor: '#FAFAFA'
              }
            }}
          />
        </Paper>

        {/* 图片管理 */}
        <Paper elevation={0} sx={{ p: 3, mb: 2, borderRadius: '16px', bgcolor: '#fff' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              이미지 관리
            </Typography>
            <Typography variant="caption" sx={{ color: '#999' }}>
              {existingImages.length + newFiles.length}/{MAX_TOTAL_IMAGES}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {/* 现有图片 */}
            {existingImages.map((img, index) => (
              <Box
                key={img.imgId}
                sx={{
                  position: 'relative',
                  width: 100,
                  height: 100,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: img.isThumbnail ? '3px solid #96ACC1' : 'none'
                }}
              >
                {img.isThumbnail && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 4,
                      left: 4,
                      bgcolor: '#96ACC1',
                      color: '#fff',
                      px: 1,
                      py: 0.5,
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: 600,
                      zIndex: 1
                    }}
                  >
                    대표
                  </Box>
                )}
                <Avatar
                  variant="rounded"
                  src={img.filePath}
                  sx={{ width: '100%', height: '100%' }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleDeleteExistingImage(img.imgId)}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    width: 24,
                    height: 24,
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
                  }}
                >
                  <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            ))}

            {/* 新上传的图片 */}
            {newFiles.map((file, index) => (
              <Box
                key={`new-${index}`}
                sx={{
                  position: 'relative',
                  width: 100,
                  height: 100,
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}
              >
                <Avatar
                  variant="rounded"
                  src={URL.createObjectURL(file)}
                  sx={{ width: '100%', height: '100%' }}
                />
                <Chip
                  label="NEW"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 4,
                    left: 4,
                    bgcolor: '#4CAF50',
                    color: '#fff',
                    height: 20,
                    fontSize: '10px'
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => removeNewFile(index)}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    width: 24,
                    height: 24,
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
                  }}
                >
                  <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            ))}

            {/* 添加按钮 */}
            {(existingImages.length + newFiles.length) < MAX_TOTAL_IMAGES && (
              <>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="add-image-upload"
                  type="file"
                  onChange={handleNewFileChange}
                  multiple
                />
                <label htmlFor="add-image-upload">
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: '12px',
                      border: '2px dashed #D0D0D0',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      bgcolor: '#FAFAFA',
                      '&:hover': {
                        borderColor: '#96ACC1',
                        bgcolor: '#F5F8FA'
                      }
                    }}
                  >
                    <PhotoCamera sx={{ fontSize: 32, color: '#96ACC1', mb: 0.5 }} />
                    <Typography variant="caption" sx={{ color: '#999' }}>
                      추가
                    </Typography>
                  </Box>
                </label>
              </>
            )}
          </Box>
        </Paper>

        {/* 内容 */}
        <Paper elevation={0} sx={{ p: 3, mb: 2, borderRadius: '16px', bgcolor: '#fff' }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            내용 작성
          </Typography>
          <TextField
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="당신의 이야기를 들려주세요..."
            variant="outlined"
            fullWidth
            multiline
            rows={6}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                bgcolor: '#FAFAFA'
              }
            }}
          />
        </Paper>

        {/* 提交按钮 */}
        <Button
          onClick={handleSubmit}
          variant="contained"
          fullWidth
          sx={{
            bgcolor: '#96ACC1',
            py: 1.5,
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 600,
            '&:hover': { bgcolor: '#7A94A8' }
          }}
        >
          수정 완료
        </Button>
      </Container>
    </Box>
  );
}

export default FeedEdit;