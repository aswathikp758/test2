const express=require("express");
const cors=require("cors");
const mongoose=require("mongoose");
const dotenv=require("dotenv").config();

const app=express();

app.use(cors());
app.use(express.json({limit:"10mb"}));

const PORT=process.env.PORT||8080;
//mongodb connection
console.log(process.env.MONGODB_URL)
mongoose.set('strictQuery',false);
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>console.log("Connect to Database"))
.catch((err)=>console.log(err))

const SchemaData=mongoose.Schema({
    name:String,
    email:String,
    mobile:String,
},{
    timeStamps:true
})
const userModel=mongoose.model("user",SchemaData)

//read
//http://localhost:8080/
app.get("/",async(req,res)=>{
    const data=await userModel.find({})
    res.json({success:true,data:data})
})

//create data //save data
//http://localhost:8080/create
/*
name,
email,
mobile
*/
app.post("/create", async(req,res)=>{
    console.log(req.body)
    const data=new userModel(req.body);
    await data.save()
    res.send({success:true,message:"data save successfully",data:data})
})

//update data
//http://localhost:8080/udpate
/*
name,
email,
mobile
*/
app.put("/update",async(req,res)=>{
    console.log(req.body);
    const {_id,...rest}=req.body

    console.log(rest);
    const data=await userModel.updateOne({_id:_id},rest)
    res.send({success:true,message:"data updated successfully",data:data})
})

//delete
//http://localhost:8080/delete/64afc6442138b1ec8d35b9c9
app.delete("/delete/:id",async(req,res)=>{
    const id=req.params.id
    console.log(id)
    const data=await userModel.deleteOne({_id:id})
     res.send({success:true,message:"data deleted successfully",data:data})
    
})


app.listen(PORT,()=>console.log("server is running at port:" + PORT))