//port
process.env.PORT=process.env.PORT || 8080;

//entorno:

process.env.NODE_ENV=process.env.NODE_ENV || 'dev';

//DB:
let urlDB;
if(process.env.NODE_ENV==='dev'){
    urlDB=process.env.URLDBLOCAL;
}else{
    urlDB=process.env.URLDBATLAS;
}





