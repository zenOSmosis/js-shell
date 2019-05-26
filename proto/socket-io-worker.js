const { ClientWorkerProcess } = this;

const worker = new ClientWorkerProcess(
    (proc) => {
        importScripts('https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js');
        
        const socket = io.connect('http://localhost:3001');

        socket.on('connect', () => {
            console.log('connected!!');
        });
    }
);