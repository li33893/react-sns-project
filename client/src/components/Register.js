import React, { useRef, useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Chip,
  Avatar,
  IconButton,
  Paper,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { PhotoCamera, Close, ArrowBack, Favorite, VisibilityOff } from '@mui/icons-material';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

function Register() {
  const [files, setFile] = useState([]);
  const [category, setCategory] = useState('group');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [companions, setCompanions] = useState([]);
  const titleRef = useRef();
  const contentRef = useRef();
  const navigate = useNavigate();

  const MAX_IMAGES = 9;

  React.useEffect(() => {
    if (category === 'group') {
      setCompanions(['김철수', '이영희', '박민수']);
    }
    if (category !== 'vent') {
      setIsAnonymous(false);
    }
  }, [category]);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    const currentFiles = Array.from(files);
    const totalFiles = currentFiles.concat(newFiles);

    if (totalFiles.length > MAX_IMAGES) {
      alert(`최대 ${MAX_IMAGES}개의 이미지만 업로드할 수 있습니다`);
      setFile(totalFiles.slice(0, MAX_IMAGES));
    } else {
      setFile(totalFiles);
    }
  };

  const removeImage = (index) => {
    const newFiles = Array.from(files).filter((_, i) => i !== index);
    setFile(newFiles);
  };

  function fnFeedAdd() {
    if (files.length === 0) {
      alert("이미지를 선택해주세요! (최소 1개)");
      return;
    }
    if (!contentRef.current.value.trim()) {
      alert("내용을 입력해주세요!");
      return;
    }

    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    let param = {
      title: titleRef.current.value || null,
      content: contentRef.current.value,
      userId: decoded.userId,
      feedType: category,
      isAnonymous: isAnonymous,
      groupId: null,
      routeId: null,
      historyId: null,
      location: null
    };

    fetch("http://localhost:3010/feed", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(param)
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        fnUploadFile(data.result[0].insertId);
      })
      .catch(err => {
        console.error(err);
        alert("등록 중 오류가 발생했습니다.");
      });
  }

  const fnUploadFile = (feedId) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }
    formData.append("feedId", feedId);
    fetch("http://localhost:3010/feed/upload", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        alert("등록이 완료되었습니다!");
        navigate("/feed");
      })
      .catch(err => {
        console.error(err);
        alert("업로드 중 오류가 발생했습니다.");
      });
  };

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
        <IconButton onClick={() => navigate('/feed')} sx={{ color: '#666' }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1A1A1A' }}>
          새 피드 등록
        </Typography>
        <Box sx={{ width: 40 }} />
      </Box>

      <Container maxWidth="sm" sx={{ mt: 3 }}>
        {/* 分类选择 */}
        <Paper elevation={0} sx={{ p: 3, mb: 2, borderRadius: '16px', bgcolor: '#fff' }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
            카테고리 선택
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label="운동구역"
              onClick={() => setCategory('group')}
              sx={{
                bgcolor: category === 'group' ? '#96ACC1' : '#F0F0F0',
                color: category === 'group' ? '#fff' : '#666',
                fontWeight: 500,
                px: 2,
                '&:hover': { bgcolor: category === 'group' ? '#7A94A8' : '#E5E5E5' }
              }}
            />
            <Chip
              label="일상구역"
              onClick={() => setCategory('daily')}
              sx={{
                bgcolor: category === 'daily' ? '#96ACC1' : '#F0F0F0',
                color: category === 'daily' ? '#fff' : '#666',
                fontWeight: 500,
                px: 2,
                '&:hover': { bgcolor: category === 'daily' ? '#7A94A8' : '#E5E5E5' }
              }}
            />
            <Chip
              label="발산구역"
              onClick={() => setCategory('vent')}
              sx={{
                bgcolor: category === 'vent' ? '#96ACC1' : '#F0F0F0',
                color: category === 'vent' ? '#fff' : '#666',
                fontWeight: 500,
                px: 2,
                '&:hover': { bgcolor: category === 'vent' ? '#7A94A8' : '#E5E5E5' }
              }}
            />
          </Box>
        </Paper>

        {/* 匿名开关 */}
        {category === 'vent' && (
          <Paper elevation={0} sx={{ p: 3, mb: 2, borderRadius: '16px', bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <VisibilityOff sx={{ color: '#666', fontSize: 22, mr: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
                  익명으로 작성
                </Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#96ACC1',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#96ACC1',
                      },
                    }}
                  />
                }
                label=""
              />
            </Box>
            {isAnonymous && (
              <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#999' }}>
                익명으로 작성하면 프로필 정보가 숨겨집니다
              </Typography>
            )}
          </Paper>
        )}

        {/* 今天一起跑步的人 */}
        {category === 'group' && companions.length > 0 && (
          <Paper elevation={0} sx={{ p: 3, mb: 2, borderRadius: '16px', bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Favorite sx={{ color: '#912121', fontSize: 22, mr: 1 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
                오늘 함께 달린 사람
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {companions.map((name, index) => (
                <Chip
                  key={index}
                  label={name}
                  size="small"
                  sx={{
                    bgcolor: '#F0F7FA',
                    color: '#96ACC1',
                    fontWeight: 500,
                    border: '1px solid #D6E8F0'
                  }}
                />
              ))}
            </Box>
          </Paper>
        )}

        {/* ⭐ 标题输入 */}
        <Paper elevation={0} sx={{ p: 3, mb: 2, borderRadius: '16px', bgcolor: '#fff' }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
            제목 (선택사항)
          </Typography>
          <TextField
            inputRef={titleRef}
            placeholder="제목을 입력하세요"
            variant="outlined"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                bgcolor: '#FAFAFA',
                '& fieldset': {
                  borderColor: '#E5E5E5'
                },
                '&:hover fieldset': {
                  borderColor: '#96ACC1'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#96ACC1'
                }
              }
            }}
          />
        </Paper>

        {/* ⭐ 图片上传 - 最多9张 */}
        <Paper elevation={0} sx={{ p: 3, mb: 2, borderRadius: '16px', bgcolor: '#fff' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
              이미지 첨부
            </Typography>
            <Typography variant="caption" sx={{ color: '#999' }}>
              {files.length}/{MAX_IMAGES}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {files.length > 0 && [...files].map((file, index) => (
              <Box
                key={index}
                sx={{
                  position: 'relative',
                  width: 100,
                  height: 100,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: index === 0 ? '3px solid #96ACC1' : 'none'
                }}
              >
                {index === 0 && (
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
                  src={URL.createObjectURL(file)}
                  sx={{ width: '100%', height: '100%' }}
                />
                <IconButton
                  size="small"
                  onClick={() => removeImage(index)}
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
                  <Close sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            ))}

            {files.length < MAX_IMAGES && (
              <>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  multiple
                />
                <label htmlFor="file-upload">
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
                      transition: 'all 0.3s',
                      '&:hover': {
                        borderColor: '#96ACC1',
                        bgcolor: '#F5F8FA'
                      }
                    }}
                  >
                    <PhotoCamera sx={{ fontSize: 32, color: '#96ACC1', mb: 0.5 }} />
                    <Typography variant="caption" sx={{ color: '#999' }}>
                      사진 추가
                    </Typography>
                  </Box>
                </label>
              </>
            )}
          </Box>

          {files.length > 0 && (
            <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#999' }}>
              💡 첫 번째 이미지가 대표 이미지로 설정됩니다
            </Typography>
          )}
        </Paper>

        {/* 内容输入 */}
        <Paper elevation={0} sx={{ p: 3, mb: 2, borderRadius: '16px', bgcolor: '#fff' }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
            내용 작성
          </Typography>
          <TextField
            inputRef={contentRef}
            placeholder="당신의 이야기를 들려주세요..."
            variant="outlined"
            fullWidth
            multiline
            rows={6}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                bgcolor: '#FAFAFA',
                '& fieldset': {
                  borderColor: '#E5E5E5'
                },
                '&:hover fieldset': {
                  borderColor: '#96ACC1'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#96ACC1'
                }
              }
            }}
          />
        </Paper>

        {/* 提交按钮 */}
        <Button
          onClick={fnFeedAdd}
          variant="contained"
          fullWidth
          sx={{
            bgcolor: '#96ACC1',
            color: '#fff',
            py: 1.5,
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: '0 4px 12px rgba(150, 172, 193, 0.3)',
            '&:hover': {
              bgcolor: '#7A94A8',
              boxShadow: '0 6px 16px rgba(150, 172, 193, 0.4)'
            }
          }}
        >
          등록하기
        </Button>
      </Container>
    </Box>
  );
}

export default Register;