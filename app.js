const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;
const jwt = require('jsonwebtoken');
const SECRET_KEY = "CLAVE ULTRA SECRETA";
const mysql = require('mysql2');

app.use(cors());

app.use(express.json());

// Crear la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Aquí va tu contraseña
  database: 'ecommerce',
});

app.get("/", (req, res) => {
    res.send("<h1>Bienvenid@ al servidor</h1>");
});

// Autentificar el usuario
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
app.use("/API", (req, res, next) => {
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

// Accede a carpetas dentro de API
app.get("/API/:folder", (req, res) => {
    const folder = req.params.folder;
    const folderPath = path.join(__dirname, 'API', folder);

    fs.readdir(folderPath, (err, files) => {
        if (err) {
            res.status(404).send("No se encontró la carpeta")
            return;
        } res.json({ files });
    })
});

// Accede a los archivos dentro de las carpetas
app.get("/API/:folder/:file", (req, res) => {
    const folder = req.params.folder;
    const file = req.params.file;
    const folderPath = path.join(__dirname, 'API', folder, file);
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            res.status(404).send("No se encontró la carpeta")
            return;
        } res.json({ files });
    })
})

// Para subir la información de los productos a la base de datos
app.post('/cart', (req, res) => {
  const products = req.body; // Aquí se recibe un array de productos
  const token = req.headers["access-token"];

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  try {

    db.beginTransaction((err) => {
      if (err) {
        return res.status(500).json({ error: 'Error al iniciar la transacción' });
      }

      const cartQuery = `
        INSERT INTO cart (user, productName, productCost, productCount)
        VALUES ?
      `;

      // Construimos los valores para la consulta SQL
      const values = products.map(product => [
        product.user,
        product.productName,
        product.productCost,
        product.productCount
      ]);

      // Ejecutamos la consulta con los valores
      db.query(cartQuery, [values], (err, result) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: 'Error al insertar datos en la tabla cart' });
          });
        }

        // Si la consulta fue exitosa, confirmamos la transacción
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ error: 'Error al confirmar la transacción' });
            });
          }

          // Respondemos si todo salió bien
          res.status(200).json({ message: "Productos guardados con éxito" });
        });
      });
    });
  } catch (err) {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
});

// Inicia el servidor para que escuche peticiones
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
