require('./config/config');
const express=require('express');
const app=express();
const bodyparser=require('body-parser');

app.use(bodyparser.urlencoded({extended:true}));

app.use(bodyparser.json());

app.get('/',(req,res)=>{
    res.send('hello');
});
app.get('/usuarios',(req,res)=>{
    res.json('get usuario');
});

app.post('/usuario',(req,res)=>{
    let body=req.body;
    if(body.nombre===undefined){
        res.status(404).json({
            ok:false,
            message:'nombre necesario'
        });
    }else{
        res.json(body);
    }
});

app.put('/usuario/:id',(req,res)=>{
    let id=req.params.id;
    res.json({
        id,
        nombre:'user'
    });
});
app.delete('/usuario',(req,res)=>{
    res.json('delete usuario');
});

app.listen(process.env.PORT,()=>{
    console.log('SERVER UP');
});