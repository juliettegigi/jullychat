const jwt=require('jsonwebtoken');

const generarJWT=async(id='')=>{
    return new Promise((resolve,reject)=>{
        const payload={userId:id};
        jwt.sign(payload,
                 process.env.SECRETORPRIVATEKEY,
                 {expiresIn:'1h'},
                 (err,token)=>{
                    if(err){
                        console.log(err)
                        reject('No se pudo generar el token.')
                    }
                    else resolve(token)

                 })
    })
}

module.exports={generarJWT}
