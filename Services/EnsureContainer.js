const {exec} =require('child_process');

function EnsureContainer(workdir,language){
    return new Promise((resolve,reject)=>{

         const config={
            cpp:{image:'gcc:latest',name:'cpp_runner'},
            java:{image:'openjdk:11-jdk-slim',name:'java_runner'},
            python:{image:'python:3.9-slim',name:'python_runner'},
            javascript:{image:'node:20-alpine',name:"js_runner"}
         }

         const {image,name}=config[language];
         if (!image || !name) { 
            
          return reject(new Error(`Unsupported language: ${language}`));
    
       }



         exec(`docker ps -a --filter "name=${name}" --format "{{.Names}}"`,(err,stdout)=>{
            if(err){
                return reject(err);
                
            }
            if(stdout.trim()===name){

                exec(`docker ps --filter "name=${name}" --format "{{.Names}}"`,(err2,stdout2)=>{
                    if(err2)return reject(err2);
                    if(stdout2.trim()===name){
                        return resolve()
                    }
                    exec(`docker start ${name}`,(err3)=>{
                        if(err3)return reject(err3);
                        resolve();
                    });


                })
            }
            else{
           const cmd = `docker run -dit --name ${name} -m 256m --memory-swap=256m --cpus="1.0" -v ${workdir}:/app ${image} sh -c "sleep infinity"`;

             exec(cmd,(err4)=>{
                if(err4)return reject(err4);
                resolve();

             })
            }
        })
    })
};

module.exports={EnsureContainer};