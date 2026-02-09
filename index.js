const express=require('express');
require('dotenv').config();

const PORT= process.env.PORT ;
const app=express();
const {RunDockerContainer}=require('./Services/RunDocker');
const cors=require('cors');
const path=require('path');
const fs=require('fs');

app.use(express.json());
const allowedOrigins = [
     "http://localhost:5173",
      "http://localhost:5174",
     "https://front-end-code-editor-eight.vercel.app", 
     "https://front-end-code-editor-181a6cw7x-mohd-anas-projects-401cb4ec.vercel.app" 

]; 
app.use(
    cors(
        { origin: function (origin, callback) 
        { if (!origin || allowedOrigins.includes(origin)) {
            
            callback(null, true); } else { callback(new Error("Not allowed by CORS")); } 
        }, methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], credentials: true 
    })
); 
app.post('/api/runcode',async(req,res)=>{
    const {code,input,language}=req.body;

    const config2={
            python:{extension:'py'},
            cpp:{extension:'cpp'},
            java:{extension:'java'},
            javascript:{extension:'js'}

        }
        const fileend=config2[language].extension
  
    try{
        const codeFilePath=path.join(__dirname,'temp.'+fileend);
        const inputFilePath=path.join(__dirname,'input.txt');
        fs.writeFileSync(codeFilePath,code,'utf-8');
        fs.writeFileSync(inputFilePath,input,'utf-8');

        const x=await RunDockerContainer(codeFilePath,inputFilePath,language);

        return res.status(201).json({message:x});

    }
    catch(err){
     return res.status(400).json({message:err})
    }
})

app.listen(PORT || 8080,()=>console.log(`server started at ${PORT}`));