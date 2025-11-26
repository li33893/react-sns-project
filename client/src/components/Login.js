import React, { useRef } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  let navigate = useNavigate();
  let idRef = useRef(null);
  let pwdRef = useRef();

  const handleLogin = () => {
    // 验证
    if (!idRef.current.value || idRef.current.value.trim() === '') {
      alert("아이디를 입력해 주세요.");
      return;
    }

    if (!pwdRef.current.value || pwdRef.current.value.trim() === '') {
      alert("비밀번호를 입력해 주세요.");
      return;
    }

    let param = {
      userId: idRef.current.value,
      pwd: pwdRef.current.value
    };

    fetch("http://localhost:3010/user/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(param)
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        alert(data.msg);
        if (data.result) {
          localStorage.setItem("token", data.token);
          navigate("/feed");
        }
      })
      .catch(err => {
        alert("로그인 중 오류가 발생했습니다.");
        console.error(err);
      });
  };

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
          borderRadius: { xs: '24px', sm: '32px' },
          padding: { xs: '32px 24px', sm: '48px 40px' },
          width: '100%',
          maxWidth: '450px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: '#1A1A1A',
            fontWeight: 600,
            textAlign: 'center',
            mb: 4
          }}
        >
          로그인
        </Typography>

        <TextField
          inputRef={idRef}
          label="아이디"
          variant="outlined"
          margin="normal"
          fullWidth
        />

        <TextField
          label="비밀번호"
          variant="outlined"
          margin="normal"
          fullWidth
          type="password"
          inputRef={pwdRef}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleLogin();
            }
          }}
        />

        <Button
          onClick={handleLogin}
          variant="contained"
          fullWidth
          sx={{
            bgcolor: '#96ACC1',
            color: '#FFFFFF',
            borderRadius: '16px',
            padding: '12px',
            marginTop: '20px',
            textTransform: 'none',
            fontSize: '16px',
            fontWeight: 500,
            '&:hover': {
              bgcolor: '#7A94A8'
            }
          }}
        >
          로그인
        </Button>

        <Typography
          variant="body2"
          sx={{
            marginTop: '16px',
            textAlign: 'center',
            color: '#666',
            '& a': {
              color: '#96ACC1',
              textDecoration: 'none',
              fontWeight: 600
            }
          }}
        >
          회원아니셤? <Link to="/join">회원가입</Link>
        </Typography>

         <Typography
          variant="body2"
          sx={{
            marginTop: '16px',
            textAlign: 'center',
            color: '#666',
            '& a': {
              color: '#96ACC1',
              textDecoration: 'none',
              fontWeight: 600
            }
          }}
        >
          비밀번호를 잊으셨나요? <Link to="/join">비밀번호 재설정하러 가기</Link>
        </Typography>
      </Box>
    </Box>
  );
}

export default Login;