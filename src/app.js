import express from "express";
import router  from './routes/index.js';
import {connectbdd} from './config/mongoDb.config.js';
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.routes.js";
import __dirname from "./dirname.js";
import { Server } from "socket.io";

connectbdd();
const app = express();
const port = 8080;
//const ready = console.log('app ready on port ' +port);

//app.listen(port,ready);
app.use(express.json())                      //para manejar json
app.use(express.urlencoded({extended:true})) //para leer queries y params
app.use('/api', router)                      //para usar los endpoint configurados en /router/index.js


//Handlebars
app.engine("handlebars", handlebars.engine()); // Inicia el motor del la plantilla
app.set("views", __dirname + "/views"); // ruta donde se encuentras las vistas
app.set("view engine", "handlebars"); // Indicamos el motor vamos a usar para las vistas
app.use("/", viewsRouter);


const httpServer = app.listen(port, () => {
    console.log(`Server on port ${port}`);
  });
  
  // Configuración de socket
  
  const socketServer = new Server(httpServer);
  
  let messages = [];
  
  // Tarea: Intentar guardar los mensajes en un archivo JSON 
  
  socketServer.on("connection", (socket) => {
    console.log("Nuevo usuario conectado");
  
    socket.on("message", (data) => {
      // Guardar el mensaje del usuario en el array
      messages.push(data);
      // Enviamos el array de mensajes actualizado a todos los clientes
      socketServer.emit("messageLog", messages);
    })
  
    // Recibimos el usuario conectado
    socket.on("newUser", (data) => {
      
      // Enviamos el usuario recibido a todos los usuarios conectados menos al usuario que se acaba de conectar
      socket.broadcast.emit("newUser", data)
    })
  })