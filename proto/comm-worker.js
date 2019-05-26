const { ClientWorkerProcess, ClientProcess } = this;

const worker = new ClientWorkerProcess(
    (proc) => {
        proc.on('message', (data) => {
            console.log('worker received message', data);

            // console.log('sending response');
            // proc.postMessage('Ok');
        });

        let fib = (n) => {
            let arr = [0, 1];
            for (let i = 2; i < n + 1; i++){
                arr.push(arr[i - 2] + arr[i -1])
            }
            return arr[n]
        };

        console.log('Starting Fib');
        console.log(fib(400));
        console.log('Ended fib');
    }
);

const local = new ClientProcess(
    (proc) => {
        worker.postMessage('I have a message!');
    }
);