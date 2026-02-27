const {Queue,QueueEvents}=require('bullmq');
const connection={host:'127.0.0.1',port:6379};

const queue=new Queue('code-runner',connection);
const queueEvents = new QueueEvents('code-runner', { connection });
queueEvents.setMaxListeners(50);

module.exports={connection,queue,queueEvents};
