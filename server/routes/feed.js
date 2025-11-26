const express = require('express');
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../auth");
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });


router.post('/upload', upload.array('file'), async (req, res) => {
    let {feedId} = req.body;
    const files = req.files;
    // const filename = req.file.filename; 
    // const destination = req.file.destination; 
    try{
        let results = [];
        let host = `${req.protocol}://${req.get("host")}/`;
        for(let file of files){
            let filename = file.filename;
            let destination = file.destination;
            let query = "INSERT INTO TBL_FEED_IMG VALUES(NULL, ?, ?, ?)";
            let result = await db.query(query, [feedId, filename, host+destination+filename]);
            results.push(result);
        }
        res.json({
            message : "result",
            result : results
        });
    } catch(err){
        console.log(err);
        res.status(500).send("Server Error");
    }
});

router.get("/:userId", async (req, res)=>{
    console.log(`${req.protocol}://${req.get("host")}`);
    let { userId } = req.params;
    try {
        let sql = "SELECT * "
                + "FROM TBL_FEED F "
                + "INNER JOIN TBL_FEED_IMG I ON F.ID = I.FEEDID "
                + "WHERE F.USERID = ? ";
        let [list] = await db.query(sql, [userId]);
        res.json({
            list,
            result : "success"
        })

    } catch (error) {
        console.log(error);
    }
})

router.delete("/:feedId", authMiddleware, async (req, res) => {
    let {feedId} = req.params;
    
    try {
        let sql = "DELETE FROM TBL_FEED WHERE ID = ?";
        let result = await db.query(sql, [feedId]);
        res.json({
            result : result,
            msg : "삭제 완료"
        });
    } catch (error) {
        console.log("에러 발생!");
    }
})

router.post("/", async (req, res)=>{
    let { userId, content } = req.body;
    try {
        let sql = "INSERT INTO TBL_FEED VALUES(NULL, ?, ? , NOW())";
        let result = await db.query(sql, [userId, content]);
        console.log(result);
        res.json({
            result,
            msg : "success"
        })

    } catch (error) {
        console.log(error);
    }
})

module.exports = router;