const { execSync } = require('child_process');
const path=require('path');
const {v4 : uuidv4} = require('uuid')
const langConfig =require('./Utilities/utilities');
const logger=require('./Log/log');
const fs=require('fs');


const Runcode=(code,input,language)=>{

    const config=langConfig[language];

    const id=uuidv4();

    const folderPath = path.join(__dirname, `temp_${id}`);

    if(!fs.existsSync(folderPath)){
        fs.mkdirSync(folderPath,{recursive:true});

    }
    const codefile=`./code.${config.extension}`;
    fs.writeFileSync(path.join(folderPath,codefile),code);
    fs.writeFileSync(path.join(folderPath,'input.txt'),input);

   
   const dockerCmd = `docker run --rm \
            -v "${folderPath}":/app \
            -w /app \
            --network none \
            --memory="128m" \
            --cpus="0.5" \
            ${config.image} \
            sh -c "timeout 5s ${config.command} < input.txt"`;
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
            logger.info("Time limit exceeded");
            return {
                success:false,
                error:"Time limit exceeded",
                details: "Your code ran for too long and was terminated."

            }
        }

        const stderr=error.stderr ? error.stderr.toString():"";
        const stdout=error.stdout ? error.stdout.toString():"";

        logger.info("Runtime/Syntax error");

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
        else{
            logger.info("Error in deleting the folder");

        }


    }

}


module.exports=Runcode;
