
const path = require('path');

const LanguageConfig = {
  cpp: {
    image: 'gcc:latest',
    container: 'cpp_runner',
    workdir: path.resolve('./cpp_runner_workdir'),
    runCommand: (codeFile) =>
      `g++ /app/${path.basename(codeFile)} -o /app/a.out && /app/a.out < /app/input.txt`
  },
  python: {
    image: 'python:3.9-slim',
    container: 'python_runner',
    workdir: path.resolve('./python_runner_workdir'),
    runCommand: (codeFile) =>
      `python3 /app/${path.basename(codeFile)} < /app/input.txt`
  },
  java: {
    image: 'eclipse-temurin:11-jre-slim', // safer replacement for openjdk:11-jdk-slim
    container: 'java_runner',
    workdir: path.resolve('./java_runner_workdir'),
    runCommand: (codeFile) => {
      const className = path.basename(codeFile, '.java');
      return `javac /app/${className}.java && java -cp /app ${className} < /app/input.txt`;
    }
  },
  javascript: { image: 'node:20-alpine', container: 'js_runner', workdir: path.resolve('./js_runner_workdir'), runCommand: (codeFile) => `node /app/${path.basename(codeFile)} < /app/input.txt` }
};

module.exports = { LanguageConfig };