const {Worker}=require('bullmq');
const {connection,queue}=require('./Producer');
const logger=require('./Log/log');
const Runcode = require('./Runcode');


const worker=new Worker('code-runner',async (job)=>{
    const {code,input,language}=job.data;

    return Runcode(code,input,language);

    
},{connection});


worker.on('completed',(job)=>{
    logger.info(`job completed with job id ${job.id}`);

})
worker.on('failed',(job,err)=>{

    logger.info(`job failed with job id ${job.id}`,err.message);

})