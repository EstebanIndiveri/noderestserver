require('./config/config');
const express=require('express');
const mongoose=require('mongoose');
const app=express();
const bodyparser=require('body-parser');
app.use(bodyparser.urlencoded({extended:true,}));
app.use(bodyparser.json());
app.use(require('./routes/usuario'));
mongoose.set('useFindAndModify', false);
require('dotenv').config({path:'process.env'})
const port = process.env.PORT || 8080;

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