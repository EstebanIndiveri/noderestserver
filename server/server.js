require('./config/config');
const express=require('express');
const mongoose=require('mongoose');
const app=express();
const path=require('path');
const bodyparser=require('body-parser');
app.use(bodyparser.urlencoded({extended:true,}));
app.use(bodyparser.json());

//routes config global
app.use(require('./routes/index'));

//carpeta public
app.use(express.static(path.resolve(__dirname,'../public')));

mongoose.set('useFindAndModify', false);

const port = process.env.PORT || 8080;

require('dotenv').config({path:'process.env'})

mongoose.connect(
    process.env.DB_MONGO,
    { useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex: true},
    (err,res)=>{
    if(err)throw err;
    console.log('base de datos UP');
});

app.listen(port,()=>{
    console.log('SERVER UP');
});