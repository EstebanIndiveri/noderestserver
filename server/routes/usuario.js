const express=require('express');
const Usuario = require('../models/usuario');
const app=express();
const bcrypt = require('bcrypt');
const _=require('underscore');

app.get('/',(req,res)=>{
    res.send('hello');
});

app.get('/usuarios',(req,res)=>{
    res.json('get usuario');
});

app.post('/usuario',(req,res)=>{
    
    let body=req.body;

    let usuario=new Usuario({
        nombre:body.nombre,
        email:body.email,
        password:bcrypt.hashSync(body.password,10),
        // img:body.img,
        role:body.role
    });

    usuario.save((err,usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        // usuarioDB.password=null;
        res.json({
            ok:true,
            usuario:usuarioDB
        })
    })
});

app.put('/usuario/:id',(req,res)=>{
    let id=req.params.id;
    let body=_.pick(req.body,['nombre','email','img','role','estado']);

    Usuario.findByIdAndUpdate(id,body,{new:true,runValidators:true},(err,usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json({
                ok:true,
                usuario:usuarioDB
            });
    })

    
});
app.delete('/usuario',(req,res)=>{
    res.json('delete usuario');
});

module.exports=app;