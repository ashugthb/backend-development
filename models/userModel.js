import mongoose from 'mongoose'


const userSchema = new mongoose.Schema({

    name:{
        type:String,
        require: true,
        trim:true
    },
    phone:{
        type:Number,
        require:true
    },
    address:{
        type:String,
        require:true
    }
    
},{timestamps:true})

//exporting userSchema
export default mongoose.model('users',userSchema)