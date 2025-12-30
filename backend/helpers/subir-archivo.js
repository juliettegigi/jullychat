const path = require('path')
const fs = require('fs');
const { v4: uuidv4 } = require('uuid')



const subirArchivo = (files,extensionesValidas=['png', 'jpg', 'jpeg', 'gif','.jfif'],carpeta='') => {

    return new Promise((resolve, reject) => {        
        //valido extension 
        const { archivo } = files; 
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];
        if (!extensionesValidas.includes(extension)) {
            return reject( {msg:`La extensión ${extension} no es válida`,
                            extensiones:extensionesValidas});
            }
        

        //  le pongo un nuevo nombre
        const nombre = uuidv4() + '.' + extension;
        console.log("Nombre del archivo: ",nombre);
        console.log("Que es el __dirname?  ",__dirname);
        const uploadPath = path.join(__dirname, '../uploads/',carpeta, nombre);

        // ✅ Crear carpeta si no existe
        const carpetaDestino = path.dirname(uploadPath);
        if (!fs.existsSync(carpetaDestino)) {
            fs.mkdirSync(carpetaDestino, { recursive: true });
        }


        // Use the mv() method to place the file somewhere on your server
        archivo.mv(uploadPath, function (err) {
            if (err)
              reject('error al mover file')
           resolve(nombre);
        });

    })

}

module.exports = {
    subirArchivo
}
