const express=require('express');
require('dotenv').config();
const Runcode=require('./Services/Runcode');

const PORT= process.env.PORT ;
const app=express();
const cors=require('cors');

app.use(express.json());

app.use(cors(
    {
        origin:['http://localhost:5173','http://localhost:5174']
    }


))


app.get('/',(req,res)=>{

    return res.status(200).json({
        message:"backend is running"
    })
})



app.post('/api/runcode',async(req,res)=>{
    const {code,input,language}=req.body;
    const result= Runcode(code,input,language);
    const {success,output,details}=result;
    console.log(output);
    if(success===true){

      return res.status(201).json(
        {
        text:details,
        message:output,
        }
        );


    }
    else{
        return res.status(400).json({
            message:details,

        })
    }

   
})

app.listen(PORT || 8080,()=>console.log(`server started at ${PORT}`));