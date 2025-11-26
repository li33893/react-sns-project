import React, { useEffect, useState } from 'react';
import { Typography, Box, Avatar, Grid, IconButton } from '@mui/material';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';

function MyPage() {
  let [user, setUser] = useState();
  let navigate = useNavigate();

  function fnGetUser() {
    const token = localStorage.getItem("token");
    if(token){
      const decoded = jwtDecode(token);
      console.log("decoded ==> ", decoded);

      fetch("http://localhost:3010/user/" + decoded.userId)
        .then(res => res.json())
        .then(data => {
          console.log(data);
          setUser(data.user);
        })
    } else {
      alert("로그인 후 이용해주세요.");
      navigate("/");
    }
  }

  useEffect(() => {
    fnGetUser();
  }, [])

  return (
    <Box
      sx={{
        bgcolor: '#E2E2E2',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <Box
        sx={{
          bgcolor: '#F0F0F0',
          borderRadius: '32px',
          padding: { xs: '32px 24px', sm: '48px 40px' },
          width: '100%',
          maxWidth: '500px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          position: 'relative'
        }}
      >
        {/* 顶部工具栏 */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: '#1A1A1A',
              fontWeight: 600,
              letterSpacing: '-0.5px'
            }}
          >
            Profile
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              sx={{ 
                bgcolor: '#96ACC1',
                color: 'white',
                width: 40,
                height: 40,
                '&:hover': { bgcolor: '#7A94A8' }
              }}
            >
              <EditIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <IconButton 
              sx={{ 
                bgcolor: '#96ACC1',
                color: 'white',
                width: 40,
                height: 40,
                '&:hover': { bgcolor: '#7A94A8' }
              }}
            >
              <SettingsIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </Box>

        {/* 头像区域 */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            mb: 4
          }}
        >
          <Box
            sx={{
              position: 'relative',
              mb: 2
            }}
          >
            <Avatar
              alt={user?.nickName}
              src={user?.profileImg || "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e"}
              sx={{ 
                width: 120, 
                height: 120,
                border: '4px solid #96ACC1',
                boxShadow: '0 8px 16px rgba(150, 172, 193, 0.3)'
              }}
            />
          </Box>
          
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 600,
              color: '#1A1A1A',
              mb: 0.5
            }}
          >
            {user?.nickName}
          </Typography>
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#666',
              fontSize: '14px'
            }}
          >
            @{user?.userId}
          </Typography>
        </Box>

        {/* 统计卡片 */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <Box
              sx={{
                bgcolor: '#FFFFFF',
                borderRadius: '16px',
                padding: '20px 16px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(150, 172, 193, 0.15)'
                }
              }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  color: '#96ACC1',
                  mb: 0.5
                }}
              >
                {user?.follower || 0}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#666',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                팔로워
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={4}>
            <Box
              sx={{
                bgcolor: '#FFFFFF',
                borderRadius: '16px',
                padding: '20px 16px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(150, 172, 193, 0.15)'
                }
              }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  color: '#96ACC1',
                  mb: 0.5
                }}
              >
                {user?.following || 0}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#666',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                팔로잉
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={4}>
            <Box
              sx={{
                bgcolor: '#FFFFFF',
                borderRadius: '16px',
                padding: '20px 16px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(150, 172, 193, 0.15)'
                }
              }}
            >
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  color: '#96ACC1',
                  mb: 0.5
                }}
              >
                {user?.cnt || 0}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#666',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                게시물
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* 个人简介卡片 */}
        <Box
          sx={{
            bgcolor: '#FFFFFF',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <Typography 
            variant="subtitle2" 
            sx={{ 
              color: '#96ACC1',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontSize: '11px',
              mb: 1.5
            }}
          >
            About Me
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#444',
              lineHeight: 1.8,
              fontSize: '14px'
            }}
          >
            {user?.intro || "아직 소개가 없습니다."}
          </Typography>
        </Box>

        {/* 额外信息区域 */}
        {user?.addr && (
          <Box
            sx={{
              bgcolor: '#FFFFFF',
              borderRadius: '20px',
              padding: '20px 24px',
              mt: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                bgcolor: '#96ACC1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px'
              }}
            >
              📍
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#999',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  display: 'block',
                  mb: 0.5
                }}
              >
                Location
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#444',
                  fontSize: '14px',
                  fontWeight: 500
                }}
              >
                {user.addr}
              </Typography>
            </Box>
          </Box>
        )}

        {user?.comorbidity && user.comorbidity !== '없음' && (
          <Box
            sx={{
              bgcolor: '#FFFFFF',
              borderRadius: '20px',
              padding: '20px 24px',
              mt: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                bgcolor: '#96ACC1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px'
              }}
            >
              💊
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#999',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  display: 'block',
                  mb: 0.5
                }}
              >
                Health Info
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#444',
                  fontSize: '14px',
                  fontWeight: 500
                }}
              >
                {user.comorbidity}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default MyPage;