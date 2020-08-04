const express=require('express');
const fileUpload=require('express-fileupload');
const app=express();
const Usuario=require('../models/usuario');
const Producto=require('../models/producto')
const fs=require('fs');
const path=require('path');
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

    // console.log(extension);
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

        //change file name:
        let nombreArchivo=`${id}-${new Date().getMilliseconds()}.${extension}`

    sampleFile.mv(`uploads/${tipo}/${nombreArchivo}`,(err)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        };
        //image upload:
        if(tipo==='usuarios'){
            imagenUser(id,res,nombreArchivo);
        }else{
            imageProduct(id,res,nombreArchivo);
        }
    });
});

function imagenUser(id,res,nombreArchivo){
    Usuario.findById(id,(err,userDB)=>{
        if(err){
            deleteFile(nombreArchivo,'usuarios');
            return res.status(500).json({
                ok:false,
                err
            });
        };
        if(!userDB){
            deleteFile(nombreArchivo,'usuarios');
            return res.status(404).json({
                ok:false,
                err:{
                    message:'Usuario no econtrado, intente nuevamente'
                }
            });
        };
        
        deleteFile(userDB.img,'usuarios');

        userDB.img=nombreArchivo;
        userDB.save((err,userSaveDB)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                });
            };
            res.status(200).json({
                ok:true,
                usuario:userSaveDB,
                img:nombreArchivo
            });
        });
    });
};
function imageProduct(id,res,nombreArchivo){
    Producto.findById(id,(err,productoDB)=>{
        if(err){
            deleteFile(nombreArchivo,'productos');
            return res.status(500).json({
                ok:false,
                err
            });
        };
        if(!productoDB){
            deleteFile(nombreArchivo,'productos');
            return res.status(404).json({
                ok:false,
                err:{
                    message:'Producto no econtrado, intente nuevamente'
                }
            });
        };
        
        deleteFile(productoDB.img,'usuarios');

        productoDB.img=nombreArchivo;
        productoDB.save((err,ProductSaveDB)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                });
            };
            res.status(200).json({
                ok:true,
                producto:ProductSaveDB,
                img:nombreArchivo
            });
        });
    });
}
function deleteFile(nombreimagen,tipo){
    let pathImage=path.resolve(__dirname,`../../uploads/${tipo}/${nombreimagen}`);
    if(fs.existsSync(pathImage)){
        fs.unlinkSync(pathImage);
    }
}
module.exports=app;