import mongoose from "mongoose"

const URI="mongodb+srv://KatiaV:123@cluster0.y9v3q8o.mongodb.net/"

await mongoose.connect(URI,{
    serverSelectionTimeoutMS:5000,
})
console.log("Base de datos conectada....")


