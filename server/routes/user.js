const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require("../db");
const jwt = require('jsonwebtoken');
const multer = require('multer');


// 해시 함수 실행 위해 사용할 키로 아주 긴 랜덤한 문자를 사용하길 권장하며, 노출되면 안됨.
const JWT_KEY = "server_secret_key";


router.get("/:userId", async (req, res) => {
    let { userId } = req.params;
    try {
        // 1. 두개 쿼리 써서 리턴
        //    let [list] = await db.query("SELECT * FROM TBL_USER WHERE USERID = ?", [userId]);
        //    let [cnt] = await db.query("SELECT COUNT(*) FROM TBL_FEED WHERE USERID = ?", [userId]);
        //    res.json({
        //     user : list[0],
        //     cnt : cnt[0]
        //    }) 

        // 2. 조인쿼리 만들어서 하나로 리턴
        let sql =
            "SELECT U.*, IFNULL(T.CNT,0) cnt " +//cnt要和别的页面一致
            "FROM TBL_USER U " +
            "LEFT JOIN ( " +
            "    SELECT USERID, COUNT(*) CNT " +
            "    FROM TBL_FEED " +
            "    GROUP BY USERID " +
            ") T ON U.USERID = T.USERID " +
            "WHERE U.USERID = ?";



    } catch (error) {
        console.log(error);
    }
})

//id重复确认
router.post("/repCheck", async (req, res) => {
    let { userId } = req.body;
    try {
        let sql = "SELECT * FROM USERS_TBL WHERE USERID = ?";
        let [list] = await db.query(sql, [userId]);
        let msg = "";
        let result = "";
        if (list.length > 0) {
            msg = "이미 존재하는 아이디입니다. 다시 생각해주세요.";
            result = "fail";
        } else {
            msg = "사용가능한 아이디입니다!";
            result = "success";
        }
        res.json({ result, msg });
    } catch (error) {
        console.log(error);
    }
})



// 配置 multer 存储头像
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/avatars/'),  // 头像单独文件夹
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

//  头像上传路由
router.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ msg: "파일이 없습니다." });
        }

        const host = `${req.protocol}://${req.get("host")}/`;
        const avatarUrl = host + file.destination + file.filename;

        res.json({
            result: "success",
            avatarUrl: avatarUrl,
            msg: "아바타 업로드 성공"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "서버 오류" });
    }
});

//修改会员注册路由,保存头像 URL
router.post("/join", async (req, res) => {
    let { userId, pwd, nickName, email, address, comorbidity, avatarUrl } = req.body;

    try {
         const hashedPwd = await bcrypt.hash(pwd, 10);
        // ✅ 完全匹配你的表结构
        let sql = `INSERT INTO USERS_TBL 
                   (userId, email, pwd, nickName, addr, comorbidity, profileImg, completionRate, cdatetime, udatetime) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, 0.00, NOW(), NOW())`;

        let result = await db.query(sql, [
            userId,
            email,
            hashedPwd,
            nickName,
            address,
            comorbidity,
            avatarUrl || null
        ]);
        res.json({
            result: "success",
            msg: "회원가입 성공!"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            result: "fail",
            msg: "회원가입 실패"
        });
    }
});


router.post("/login", async (req, res) => {
    let { userId, pwd } = req.body;

    try {
        let sql = "SELECT * FROM USERS_TBL WHERE USERID = ?";
        let [list] = await db.query(sql, [userId]);

        let msg = "";
        let result = false;
        let token = null;

        // 用户不存在
        if (list.length === 0) {
            msg = "아이디가 존재하지 않습니다.";
            return res.json({ result, msg, token });
        }

        // 用户存在 → 检查密码
        let match = await bcrypt.compare(pwd, list[0].pwd);

        if (!match) {
            msg = "비밀번호가 틀렸습니다.";
            return res.json({ result, msg, token });
        }

        // 登录成功
        msg = list[0].nickName + "님 환영합니다!";
        result = true;

        let user = {
            userId: list[0].userId,
            nickName: list[0].nickName,
            status: "A"
        };

        token = jwt.sign(user, JWT_KEY, { expiresIn: '1h' });

        res.json({
            result,
            msg,
            token
        });

    } catch (error) {
        console.log(error);
    }
});


module.exports = router;