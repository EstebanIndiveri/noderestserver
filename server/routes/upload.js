const express=require('express');
const fileUpload=require('express-fileupload');
const app=express();
const Usuario=require('../models/usuario');
app.use(fileUpload());

app.put('/upload/:tipo/:id',(req,res)=>{
    let tipo=req.params.tipo;
    let id=req.params.id;
    if(!req.files){
        return res.status(400).json({
            ok:false,
            err:{
                message:'no se ha seleccionado ningún archivo'
            }
        });
    };
    
    //valid type
    let tiposValidos=['productos','usuarios'];
    if(tiposValidos.indexOf(tipo)<0){
        return res.status(404).json({
            ok:false,
            err:{
                message:'tipo incorrecto, tipos validos: '+tiposValidos.join(', ')
            }
        })
    }



    let sampleFile=req.files.archivo;

    let nombreSplit=sampleFile.name.split('.');
    let extension=nombreSplit[nombreSplit.length-1];

    console.log(extension);
    //extends
    let extensionValid=['png','jpg','gif','jpeg'];

    if(extensionValid.indexOf(extension)<0){
        return res.status(400).json({
            ok:false,
            err:{
                message:'Las extensiones permitidas son ' + extensionValid.join(', '),
                ext:extension
            }
        })
    }

    sampleFile.mv(`uploads/${tipo}/${sampleFile.name}`,(err)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        };
        res.json({
            ok:true,
            message:'imagen subida correctamente'
        });
    });
});

module.exports=app;