 const langConfig = {
    python: {
        extension: 'py',
        image: 'python:3.9-slim',
        command: 'python3 code.py'
    },
    c: {
        extension: 'c',
        image: 'gcc:latest',
        command: 'gcc code.c -o out && ./out'
    },
    cpp: {
        extension: 'cpp',
        image: 'gcc:latest',
        command: 'g++ code.cpp -o out && ./out'
    },
    java: {
        extension: 'java',
        image: 'openjdk:17-slim',
        command: 'javac code.java && java code'
    },
    javascript: {
        extension: 'js',
        image: 'node:18-slim',
        command: 'node code.js'
    },
};

module.exports=langConfig;
