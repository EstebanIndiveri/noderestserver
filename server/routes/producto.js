const express=require('express');

const {verificaToken}=require('../middlewares/authentication');
const _=require('underscore');

let app = express();

let Producto=require('../models/producto');


app.get('/productos',(req,res)=>{
    //populate: usuario y categoria
    //paginado
    let desde=req.query.desde || 0;
    desde=Number(desde);
    let limite=req.query.limite || 5;
    limite=Number(limite);
    Producto.find({disponible:true})
    .sort('description')
    .populate('usuario','nombre email')
    .populate('categoria','description')
    .skip(desde).limit(limite)
    .exec((err,productosDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        };
        if(!productosDB){
            return res.status(404).json({
                ok:false,
                message:'No se encontró el producto, intente nuevamente'
            });
        };
        Producto.countDocuments({},(err,conteo)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                });
            };
            return res.json({
                ok:true,
                productos:productosDB,
                cuantos:conteo
    
            });
        });
    });

});

app.get('/productos/:id',(req,res)=>{
    //populate?
    let id=req.params.id;
    Producto.findById(id)
                    .populate('usuario','nombre email')
                    .populate('categoria','nombre')
                    .exec((err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        };
        if(!productoDB){
            return res.status(404).json({
                ok:false,
                message:'No se encontró el producto'
            });
        };
        return res.json({
            ok:true,
            producto:productoDB
        });
    });
});

//search
app.get('/productos/buscar/:termino',verificaToken,(req,res)=>{
    let termino=req.params.termino;
    let regex=new RegExp(termino,'i');
    Producto.find({nombre:regex})
    .populate('categoria','nombre')
    .exec((err,productosDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        };
        return res.json({
            ok:true,
            productos:productosDB
        })
    })
});

app.post('/productos',verificaToken,(req,res)=>{
    // verificaToken
    //grabar user,categoria del listado

    let body=req.body;
    let producto=new Producto({
        nombre:body.nombre,
        precioUni:body.precioUni,
        description:body.description,
        disponible:body.disponible,
        categoria:body.categoria,
        usuario:req.usuario._id
    });
    producto.save((err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        };
        if(!productoDB){
            return res.status(404).json({
                ok:false,
                err:{
                    message:'no se pudo cargar el producto, intente nuevamente'
                }
            });
        };
        return res.json({
            ok:true,
            producto:productoDB
        });
    });
});

app.put('/productos/:id',verificaToken,(req,res)=>{
    let id=req.params.id;
    let body=_.pick(req.body,['nombre','precioUni','description','disponible','categoria',]);
    Producto.findByIdAndUpdate(id,body,{new:true,runValidators:true},(err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        };
        if(!productoDB){
            return res.status(404).json({
                ok:false,
                err:{
                    message:'No se pudo actualizar el producto, intenta nuevamente'
                }
            });
        };
        return res.json({
            ok:true,
            producto:productoDB
        });
    });

});

app.delete('/productos/:id',verificaToken,(req,res)=>{
    //cambiar estado disponible
    let id=req.params.id;
    let cambiaEstado={
        disponible:false
    };
    Producto.findByIdAndUpdate(id,cambiaEstado,{new:true},(err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        };
        if(!productoDB){
            return res.status(404).json({
                ok:false,
                err:{
                    message:'El producto no existe, intenta nuevamente'
                }
            });
        };
        return res.json({
            ok:true,
            producto:productoDB,
            message:'Producto eliminado'
        });
    });
});

module.exports=app;