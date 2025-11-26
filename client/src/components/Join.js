import React, { useRef, useState } from 'react';
import { TextField, Button, Container, Typography, Box, IconButton, Avatar, Checkbox, FormControlLabel } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PhotoCamera from '@mui/icons-material/PhotoCamera';


function Join() {
  let navigate = useNavigate();
  let userId = useRef();
  let pwd = useRef();
  let confirmPwdRef = useRef();
  let nickName = useRef();
  let email = useRef();
  let comorbidity = useRef();

  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);  // 新增:保存头像文件
  const [avatarUrl, setAvatarUrl] = useState('');      // 新增:保存服务器返回的头像URL
  const [noComorbidity, setNoComorbidity] = useState(false);
  const [address, setAddress] = useState("");

  // 密码验证相关状态
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [hasNumber, setHasNumber] = useState(false);
  const [hasAlphabet, setHasAlphabet] = useState(false);
  const [hasSpecial, setHasSpecial] = useState(false);
  const [lenEnough, setLenEnough] = useState(false);
  const [withoutInvalidChar, setWithoutInvalidChar] = useState(false);

  // 密码验证函数
  const validatePassword = (pwd) => {
    setPassword(pwd);
    setLenEnough(pwd.length >= 8);
    setHasNumber(/[0-9]/.test(pwd));
    setHasAlphabet(/[A-Za-z]/.test(pwd));
    setHasSpecial(/[^A-Za-z0-9]/.test(pwd));
    setWithoutInvalidChar(/^[A-Za-z0-9!@#$%^&*]+$/.test(pwd));
  };

  // 查重按钮点击
  const handleCheckDuplicate = () => {
    if (!userId.current.value || userId.current.value.trim() === '') {
      alert("아이디를 입력해 주세요.");
      return;
    }

    fetch("http://localhost:3010/user/repCheck", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userId.current.value })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.msg);
      })
  };

  // ✅ 处理头像选择(本地预览)
  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file);  // 保存文件对象
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);  // 本地预览
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ 上传头像到服务器
  const uploadAvatar = async () => {
    if (!avatarFile) {
      return null;  // 没有选择头像,返回null
    }

    const formData = new FormData();
    formData.append('avatar', avatarFile);

    try {
      const response = await fetch("http://localhost:3010/user/upload-avatar", {
        method: "POST",
        body: formData
      });
      const data = await response.json();

      if (data.result === "success") {
        console.log("아바타 업로드 성공:", data.avatarUrl);
        return data.avatarUrl;  // 返回服务器头像URL
      } else {
        alert("아바타 업로드 실패");
        return null;
      }
    } catch (err) {
      console.error("아바타 업로드 오류:", err);
      alert("아바타 업로드 중 오류가 발생했습니다.");
      return null;
    }
  };

  // 地址搜索
  const handleSelectAddress = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setAddress(data.roadAddress);
      }
    }).open();
  };

  // ✅ 회원가입 제출 (先上传头像,再提交用户信息)
  const handleJoin = async () => {
    // 1. 아이디 체크
    if (!userId.current.value || userId.current.value.trim() === '') {
      alert("아이디를 입력해 주세요.");
      return;
    }

    // 2. 비밀번호 입력 체크
    if (!password || password.trim() === '') {
      alert("비밀번호를 입력해 주세요.");
      return;
    }

    // 3. 비밀번호 길이 체크
    if (password.length < 8) {
      alert("비밀번호는 8글자 이상이어야 합니다.");
      return;
    }

    // 4. 비밀번호 강도 체크
    if (!(hasNumber && hasAlphabet && hasSpecial && lenEnough && withoutInvalidChar)) {
      alert("비밀번호가 요구조건을 만족하지 않습니다. (숫자, 영문, 특수문자, 길이 8자 이상 등)");
      return;
    }

    // 5. 비밀번호 확인 입력 체크
    if (!confirmPwd || confirmPwd.trim() === '') {
      alert("비밀번호 확인을 입력해 주세요.");
      return;
    }

    // 6. 비밀번호 일치 체크
    if (password !== confirmPwd) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 7. 이름 체크
    if (!nickName.current.value || nickName.current.value.trim() === '') {
      alert("이름을 입력해 주세요.");
      return;
    }

    // 8. 이메일 체크
    if (!email.current.value || email.current.value.trim() === '') {
      alert("이메일을 입력해 주세요.");
      return;
    }

    // 9. 공병/기저질환 체크
    if (!noComorbidity && (!comorbidity.current.value || comorbidity.current.value.trim() === '')) {
      alert("공병/기저질환을 입력하거나 '없음'을 선택해 주세요.");
      return;
    }

    // 10. 주소 체크
    if (!address || address.trim() === '') {
      alert("주소를 검색해 주세요.");
      return;
    }

    // ✅ 11. 先上传头像(如果有)
    let uploadedAvatarUrl = null;
    if (avatarFile) {
      uploadedAvatarUrl = await uploadAvatar();
      if (!uploadedAvatarUrl) {
        alert("아바타 업로드 실패, 다시 시도해주세요.");
        return;
      }
    }

    // ✅ 12. 提交用户信息
    let param = {
      userId: userId.current.value,
      pwd: password,
      nickName: nickName.current.value,
      email: email.current.value,
      address: address,
      comorbidity: noComorbidity ? '없음' : comorbidity.current.value,
      avatarUrl: uploadedAvatarUrl  // 保存头像URL,没有则为null
    };

    fetch("http://localhost:3010/user/join", {
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
        if (data.result === "success") {
          navigate("/");
        }
      })
      .catch(err => {
        alert("회원가입 중 오류가 발생했습니다.");
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
            mb: 3
          }}
        >
          회원가입
        </Typography>

        {/* 头像上传 */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={avatarPreview}
              sx={{
                width: 100,
                height: 100,
                bgcolor: '#96ACC1'
              }}
            />
            <IconButton
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: '#96ACC1',
                color: 'white',
                '&:hover': { bgcolor: '#7A94A8' },
                width: 35,
                height: 35
              }}
              component="label"
            >
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleAvatarUpload}
              />
              <PhotoCamera sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </Box>

        {/* ID输入框和查重按钮 */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
          <TextField
            inputRef={userId}
            label="아이디를 입력하고 꼭 중복체크~"
            variant="outlined"
            margin="normal"
            fullWidth
          />

          <Button
            variant="contained"
            onClick={handleCheckDuplicate}
            sx={{
              bgcolor: '#96ACC1',
              color: 'white',
              '&:hover': { bgcolor: '#7A94A8' },
              textTransform: 'none',
              whiteSpace: 'nowrap',
              padding: '14px 16px',
              fontSize: '0.875rem',
              mt: '0 !important',
              height: '56px',
            }}
          >
            ID 중복확인
          </Button>
        </Box>

        {/* 密码输入 + 验证提示 */}
        <TextField
          label="비번을 입력"
          variant="outlined"
          margin="normal"
          fullWidth
          type="password"
          inputRef={pwd}
          value={password}
          onChange={(e) => validatePassword(e.target.value)}
        />

        {/* 密码验证提示列表 */}
        {password && (
          <Box sx={{ mt: 1, mb: 1, pl: 2 }}>
            <Typography
              variant="caption"
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: hasNumber ? 'green' : 'red',
                mb: 0.5
              }}
            >
              {hasNumber ? <CheckCircleIcon sx={{ fontSize: 16, mr: 0.5 }} /> : <CancelIcon sx={{ fontSize: 16, mr: 0.5 }} />}
              숫자 포함
            </Typography>
            <Typography
              variant="caption"
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: hasAlphabet ? 'green' : 'red',
                mb: 0.5
              }}
            >
              {hasAlphabet ? <CheckCircleIcon sx={{ fontSize: 16, mr: 0.5 }} /> : <CancelIcon sx={{ fontSize: 16, mr: 0.5 }} />}
              영어문자 포함
            </Typography>
            <Typography
              variant="caption"
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: hasSpecial ? 'green' : 'red',
                mb: 0.5
              }}
            >
              {hasSpecial ? <CheckCircleIcon sx={{ fontSize: 16, mr: 0.5 }} /> : <CancelIcon sx={{ fontSize: 16, mr: 0.5 }} />}
              특수문자 포함
            </Typography>
            <Typography
              variant="caption"
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: lenEnough ? 'green' : 'red',
                mb: 0.5
              }}
            >
              {lenEnough ? <CheckCircleIcon sx={{ fontSize: 16, mr: 0.5 }} /> : <CancelIcon sx={{ fontSize: 16, mr: 0.5 }} />}
              길이 8자 이상
            </Typography>
            <Typography
              variant="caption"
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: withoutInvalidChar ? 'green' : 'red',
                mb: 0.5
              }}
            >
              {withoutInvalidChar ? <CheckCircleIcon sx={{ fontSize: 16, mr: 0.5 }} /> : <CancelIcon sx={{ fontSize: 16, mr: 0.5 }} />}
              허용되지 않은 문자 없음
            </Typography>
          </Box>
        )}

        {/* 确认密码 */}
        <TextField
          label="비번을 다시 한번!"
          variant="outlined"
          margin="normal"
          fullWidth
          type="password"
          inputRef={confirmPwdRef}
          value={confirmPwd}
          onChange={(e) => setConfirmPwd(e.target.value)}
        />

        {/* 密码匹配提示 */}
        {confirmPwd && (
          <Box sx={{ mt: 1, mb: 1, pl: 2 }}>
            <Typography
              variant="caption"
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: password === confirmPwd ? 'green' : 'red'
              }}
            >
              {password === confirmPwd ? (
                <>
                  <CheckCircleIcon sx={{ fontSize: 16, mr: 0.5 }} />
                  비밀번호 일치
                </>
              ) : (
                <>
                  <CancelIcon sx={{ fontSize: 16, mr: 0.5 }} />
                  비밀번호 불일치
                </>
              )}
            </Typography>
          </Box>
        )}

        <TextField
          inputRef={nickName}
          label="이쁜 이름을 지어주세요~"
          variant="outlined"
          margin="normal"
          fullWidth
        />

        {/* 邮箱输入框 */}
        <TextField
          inputRef={email}
          label="이메일!!!"
          variant="outlined"
          margin="normal"
          fullWidth
          type="email"
        />

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 2 }}>
          {/* 输入框 */}
          <TextField
            inputRef={comorbidity}
            label="공병 / 기저질환"
            variant="outlined"
            margin="normal"
            fullWidth
            disabled={noComorbidity}
          />

          {/* "없음" + checkbox 组合 */}
          <FormControlLabel
            control={
              <Checkbox
                checked={noComorbidity}
                onChange={(e) => setNoComorbidity(e.target.checked)}
              />
            }
            label="없음"
            sx={{ whiteSpace: "nowrap" }}
          />
        </Box>

        {/* 地址输入框和选择按钮 */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
          <TextField
            value={address}
            label="주소를 검색하세요"
            variant="outlined"
            margin="normal"
            fullWidth
            disabled
          />
          <Button
            variant="contained"
            sx={{
              bgcolor: '#96ACC1',
              color: 'white',
              textTransform: 'none',
              '&:hover': { bgcolor: '#7A94A8' },
              mt: '0 !important',
              height: '56px',
              fontSize: "clamp(12px, 1.2vw, 14px)",
              whiteSpace: "nowrap"
            }}
            onClick={handleSelectAddress}
          >
            주소검색
          </Button>
        </Box>

        <Button
          variant="contained"
          fullWidth
          sx={{
            bgcolor: '#96ACC1',
            color: '#FFFFFF',
            borderRadius: '16px',
            padding: '12px',
            marginTop: '20px',
            textTransform: 'none',
            '&:hover': {
              bgcolor: '#7A94A8'
            }
          }}
          onClick={handleJoin}
        >
          회원가입
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
          이미 회원이라면? <Link to="/">로그인</Link>
        </Typography>
      </Box>
    </Box>
  );
}

export default Join;