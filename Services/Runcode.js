const { execSync } = require('child_process');
const path=require('path');
const {v4 : uuidv4} = require('uuid')

const logger=require('./Log/log');
const fs=require('fs');

const langConfig={
            python:{extension:'py',image:'python:3.9-slim',run:'python'},
            cpp:{extension:'cpp',image:'gcc:latest',run:'g++ code.cpp -o a && ./a'}
}
const Runcode=(code,input,language)=>{
    const id=uuidv4();

    const folderPath = path.join(__dirname, `temp_${id}`);

    if(!fs.existsSync(folderPath)){
        fs.mkdirSync(folderPath,{recursive:true});

    }

    const fileend=langConfig[language].extension;
    const codefile=`./code.${fileend}`;

    fs.writeFileSync(path.join(folderPath,codefile),code);
    fs.writeFileSync(path.join(folderPath,'input.txt'),input);
    const dockerCmd = `docker run --rm \
            -v "${folderPath}":/app \
            -w /app \
            --memory="128m" \
            --cpus="0.5" \
            ${langConfig[language].image} \
            sh -c "timeout 5s ${langConfig[language].run} ${codefile} < input.txt"`;
    try{

        const output=execSync(dockerCmd,{
            encoding:'utf-8',
        })

        return {
            success:true,
            output:output,
            details:"Code executed successful",


        }
    }
    catch(error){

        if(error.status===124){
            return {
                success:false,
                error:"Time limit exceeded",
                details: "Your code ran for too long and was terminated."

            }
        }

        const stderr=error.stderr ? error.stderr.toString():"";
        const stdout=error.stdout ? error.stdout.toString():"";


        return {
            success:false,
            error:"Runtime/Syntax error",
            details:stderr || stdout || "Unknown error occured",

        }

    }
    finally{

        if (fs.existsSync(folderPath)) {
            // logger.info("folder deleted");
            fs.rmSync(folderPath, { recursive: true });
        }


    }

}


module.exports=Runcode;
