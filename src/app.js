import express from "express"
import viewRouter from "./routes/view.router.js"
import productRouter from "./routes/products.router.js"
import cartRouter from "./routes/carts.router.js"
import {__dirname} from "./utils.js"
import handlebars from "express-handlebars"
import {Server} from "socket.io"
import "./dao/dbConfig.js"
import uploadRouter from "./routes/upload.router.js"

const app=express()
const PORT=process.env.PORT||8080;


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+"/public"))


//estructura de handlebars
app.engine("handlebars",handlebars.engine())
app.set('view engine', 'handlebars');
app.set("views",__dirname+"/views")


//rutas
app.use("/api",productRouter)
app.use("/api",cartRouter)
app.use("/",viewRouter)

//multer http://localhost:8080/upload//
app.use ("/upload", uploadRouter)


const httpServer=app.listen(PORT,()=>{
    console.log(`server escuchandoooo en ${PORT}`)
})


//const pmanager=new ProductManager(__dirname+"/database/products.json") ...ya no va//

const socketServer= new Server(httpServer)

// import ProductManager from "./dao/filemanagers/controllers/productManager.js"
// const pmanagersocket=new ProductManager(__dirname+"/dao/filemanagers/db/products.json")
import ProductManager from "./dao/mongomanagers/productManagerMongo.js"
const pmanagersocket=new ProductManager()

// Importar MessagesManager
import MessagesManager from "./dao/mongomanagers/messageManagerMongo.js";
const messagesManager = new MessagesManager();


//socket.io

socketServer.on("connection",async(socket)=>{
    console.log("cliente connectado con ID:",socket.id)
    const listadeproductos=await pmanagersocket.getProducts()
    socketServer.emit("enviodeproducts",listadeproductos)

    socket.on("addProduct",async(obj)=>{
    await pmanagersocket.addProduct(obj)
    const listadeproductos=await pmanagersocket.getProducts()
    socketServer.emit("enviodeproducts",listadeproductos)
    })

    socket.on("deleteProduct",async(id)=>{
        console.log(id)
       await pmanagersocket.deleteProduct(id)
        const listadeproductos=await pmanagersocket.getProducts({})
        socketServer.emit("enviodeproducts",listadeproductos)
        })


    socket.on("Nuevo-usuario",(usuario)=>{
        console.log("usuario" ,usuario)
        socket.broadcast.emit("broadcast",usuario)
        })
        socket.on("disconnect",()=>{
        console.log(`Usuario con ID : ${socket.id} esta desconectado `)
        })
       
        socket.on("mensaje", async (info) => {
        // Guardar el mensaje utilizando el MessagesManager
        console.log(info)
        await messagesManager.createMessage(info);
        // Envio el mensaje a todos los usuarios conectados
        socketServer.emit("chat", await messagesManager.getMessages());
        });
    
})