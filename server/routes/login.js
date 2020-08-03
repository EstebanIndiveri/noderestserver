const express=require('express');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');

const app=express();

app.post('/login',(req,res)=>{

    let body=req.body;
    Usuario.findOne({email:body.email},(err,userDB)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        };

        if(!userDB){
            return res.status(404).json({
                ok:false,
                message:'usuario no encontrado'
            });
        };

        if(!bcrypt.compareSync(body.password,userDB.password)){
            return res.status(404).json({
                ok:false,
                message:'Contraseña incorrecta'
            });
        };
        let token=jwt.sign({
            usuario:userDB
        },process.env.SEED,{expiresIn:process.env.CADUCIDAD_TOKEN});

        res.json({
            ok:true,
            usuario:userDB,
            token
        });

    });
});


//google config
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    
    return{
        nombre:payload.name,
        email:payload.email,
        img:payload.picture,
        google:true
    }
  }


app.post('/google',async(req,res)=>{
    let token=req.body.idtoken
    let googleUser=await verify(token).catch(err=>{
        return res.status(403).json({
            ok:false,
            err
        });
    });
    Usuario.findOne({email:googleUser.email},(err,usuarioDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if(!usuarioDB){
            let usuario=new Usuario();
            usuario.nombre=googleUser.nombre;
            usuario.email=googleUser.email;
            usuario.img=googleUser.img,
            usuario.google=true,
            usuario.password='//';
            usuario.save((err,usuarioDB)=>{
                if(err){
                    return res.status(500).json({
                        ok:true,
                        err
                    });
                };
                let token=jwt.sign({
                    usuario:usuarioDB
                },process.env.SEED,{expiresIn:process.env.CADUCIDAD_TOKEN})

                return res.json({
                    ok:true,
                    usuario:usuarioDB,
                    token
                });
            });
        }
        if(usuarioDB){
            if(usuarioDB.google===false){
                return res.status(400).json({
                    ok:false,
                    message:'Debe usar su autenticación de google'
                });
            }else{
                let token=jwt.sign({
                    usuario:usuarioDB
                },process.env.SEED,{expiresIn:process.env.CADUCIDAD_TOKEN})
            }
            return res.json({
                ok:true,
                usuario:usuarioDB,
                token
            });
        }
    })
    // res.json({
    //     usuario:googleUser
    // });
});


module.exports=app;