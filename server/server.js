require('./config/config');
const express=require('express');
const mongoose=require('mongoose');
const app=express();
const bodyparser=require('body-parser');

app.use(bodyparser.urlencoded({extended:true,}));

app.use(bodyparser.json());

app.use(require('./routes/usuario'));



mongoose.connect(process.env.URLDB,{ useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex: true,useFindAndModify: false},(err,res)=>{
    if(err)throw err;
    console.log('base de datos UP');
});

app.listen(process.env.PORT,()=>{
    console.log('SERVER UP');
});