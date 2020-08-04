const express=require('express');
const fs=require('fs');
const path=require('path');
const {verificaToken} =require('../middlewares/authentication')
let app=express();

app.get('/imagen/:tipo/:img',verificaToken,(req,res)=>{

    let tipo=req.params.tipo;
    let img=req.params.img;

    let pathImage=path.resolve(__dirname,`../../uploads/${tipo}/${img}`);
    if(fs.existsSync(pathImage)){
        res.sendFile(pathImage);
    }else{
        let noImagePath=path.resolve(__dirname,'../assets/no-image.jpg');
        res.sendFile(noImagePath);
    };
    

});



module.exports=app;