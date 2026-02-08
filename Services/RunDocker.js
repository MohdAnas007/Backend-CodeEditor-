const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { EnsureContainer } = require('./EnsureContainer');
const {LanguageConfig}=require('./LanguageConfig')
const RunDockerContainer = async (codeFilePath, InputFilePath,language) => {
  return new Promise(async (resolve, reject) => {
    try {
        const config=LanguageConfig[language];
        if(!config){
            return reject(new Error(`Unsupported language: ${language}`));
        }
        if (!fs.existsSync(config.workdir)) 
        { fs.mkdirSync(config.workdir, { recursive: true }); }


      await EnsureContainer(config.workdir,language);
      
      fs.copyFileSync(codeFilePath, path.join(config.workdir, path.basename(codeFilePath)));
      fs.copyFileSync(InputFilePath, path.join(config.workdir, 'input.txt'));

      const cmd = `docker exec ${config.container} sh -c "${config.runCommand(codeFilePath)}"`;

      exec(cmd, { timeout: 5000 }, (err, stdout, stderr) => {
        if (err) {
          if (err.killed) return reject("Time Limit Exceeded");
          if (stderr.includes("Killed")) return reject("Memory Limit Exceeded");
          return reject(stderr || err.message);
        }
        if(stderr){
          return reject(stderr);

        }
        resolve(stdout);
        
        
      });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { RunDockerContainer };
