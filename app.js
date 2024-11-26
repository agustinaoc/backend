const express = require("express"); 
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.send("<h1>Bienvenid@ al servidor</h1>");
});

// Permite el acceso a los archivos almacenados en una carpeta específica del servidor.
app.use('/API', express.static(path.join(__dirname, 'API')));

// Accede a carpetas dentro de APIdata
app.get("/API/:folder", (req, res) => {
    let folder = req.params.folder;
    const folderPath = path.join(__dirname, 'API', folder);

    fs.readdir(folderPath, (err, files) => {
        if (err) {
            res.status(404).send("No se encontró la carpeta")
            return;
        } res.json({ files });
    })
});

app.get("/API/:folder/:file", (req, res) => {
    let folder = req.params.folder;
    let file = req.params.file;
    const folderPath = path.join(__dirname, 'API', folder, file);
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            res.status(404).send("No se encontró la carpeta")
            return;
        } res.json({ files });
    })
})

// Inicia el servidor para que escuche peticiones
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});