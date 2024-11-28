const express = require("express"); 
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;
const jwt = require('jsonwebtoken');
const SECRET_KEY = "CLAVE ULTRA SECRETA";

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.send("<h1>Bienvenid@ al servidor</h1>");
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "admin") {
      const token = jwt.sign({ username }, SECRET_KEY);
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: "Usuario y/o contraseña incorrecto" });
    }
  });

// Middleware
app.use("/people", (req, res, next) => {
    try {
      const decoded = jwt.verify(req.headers["access-token"], SECRET_KEY);
      console.log(decoded);
      next();
    } catch (err) {
      res.status(401).json({ message: "Usuario no autorizado" });
    }
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
