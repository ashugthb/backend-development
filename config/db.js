import mongoose from 'mongoose'

const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`Connected to Mongodb Databse ${conn.connection.host}   `.yellow)
    }catch(err){
        console.log(`error in MOngodb${err}`)
    }
}

export default connectDB