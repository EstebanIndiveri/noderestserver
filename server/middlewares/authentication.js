const jwt=require('jsonwebtoken');

//verf auth

let verificaToken=(req,res,next)=>{

    let token=req.get('Authorization');

    jwt.verify(token,process.env.SEED,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                err:{
                    message:'token no válido'
                }
            });
        }
        req.usuario=decoded.usuario;
        next();
    })
};

//verify role:
let verificaAdmin_role=(req,res,next)=>{
    let usuario=req.usuario;
    if(usuario.role==='ADMIN_ROLE'){
        next();
    }else{
        return res.status(401).json({
            ok:false,
            err:{
                message:'No tienes autorización'
            }
        });
    }
}

module.exports={
    verificaToken,
    verificaAdmin_role
}