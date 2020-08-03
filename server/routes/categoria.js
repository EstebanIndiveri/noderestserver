const express=require('express');

let{verificaToken, verificaAdmin_role}=require('../middlewares/authentication');

let app = express();


let Categoria=require('../models/categoria');
const { rest } = require('underscore');
const { json } = require('body-parser');
const usuario = require('../models/usuario');

app.get('/categoria',verificaToken,(req,res)=>{
    let desde=req.query.desde || 0;
    desde=Number(desde);
    let limite=req.query.limite || 5;
    limite=Number(limite);
    Categoria.find({})
    .sort('description')
    .populate('usuario','nombre email')
    .skip(desde).limit(limite)
    .exec((err,categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        };
        if(!categoriaDB){
            return res.status(404).json({
                ok:false,
                message:'no se encontro esa categoría intenta nuevamente'
            });
        };
        Categoria.countDocuments({},(err,conteo)=>{
            if(err){
                return res.status(404).json({
                    ok:false,
                    err
                });
            };
            res.json({
                ok:true,
                categorias:categoriaDB,
                cuantos:conteo
            });
        });
    });
});

app.get('/categoria/:id',verificaToken,(req,res)=>{
    // Categoria.findbyId();
    let id=req.params.id;
    Categoria.findById(id,(err,categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        };
        if(!categoriaDB){
            return res.status(404).json({
                ok:false,
                message:'no se encontró esa categoría'
            });
        };
        return res.json({
            ok:true,
            categoria:categoriaDB
        });
    });
});

app.post('/categoria',verificaToken,(req,res)=>{
    // req.usuario._id:
    let body=req.body;
    let categoria=new Categoria({
        description:body.description,
        usuario:req.usuario._id
    });
    categoria.save((err,categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        };
        if(!categoriaDB){
            return res.status(404).json({
                ok:false,
                message:'No se pudo guardar la categoría, intenta nuevamente'
            });
        };
        res.json({
            ok:true,
            categoria:categoriaDB
        });
    });
});

app.put('/categoria/:id',verificaToken,(req,res)=>{
    let id=req.params.id;
    let body=req.body;
    let descriptionCat={
        description:body.description
    }

    Categoria.findByIdAndUpdate(id,descriptionCat,{new:true,runValidators:true},(err,categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        };
        if(!categoriaDB){
            return res.status(404).json({
                ok:false,
                message:'No se pudo actualizar la categoría intenta nuevamente'
            });
        };
        return res.json({
            ok:true,
            categoria:categoriaDB
        })
    });

});

app.delete('/categoria/:id',[verificaToken,verificaAdmin_role],(req,res)=>{
    // Categoria.findandIdAndRemove()
    let id=req.params.id;
    Categoria.findByIdAndRemove(id,(err,categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        };
        if(!categoriaDB){
            return res.status(404).json({
                ok:false,
                message:'la categoría no se encontró para eliminar, intente nuevamente'
            });
        };
        return res.json({
            ok:false,
            categoria:categoriaDB,
            message:'categoría borrada'
        })
    })
});



module.exports=app;