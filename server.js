
const express = require('express');
const app = express();
//public 미들웨어 
const path = require('path');
const PublicPath = path.join(__dirname , '/Chat-app/public');
app.use(express.static(PublicPath))








const port = process.env.PORT || 5000;

app.listen(port , () => {
    console.log(`${port}포트 포트로 이동중.....`)
}) 

