// Prototyping thread-level CPU load

const { getLogicalProcessors, ClientWorkerProcess } = this;

// Total # of processors
const coresLen = getLogicalProcessors();

const createWorker = () => {
    return new ClientWorkerProcess(
        (proc) => {
            // Capture processor load, using heuristics
            let lastTime = Date.now();
            let idx = -1;
            setInterval(() => {
                idx++;
                const newTime = Date.now();

                const delta = newTime - lastTime;

                console.log(`${delta} @ ${idx}`);

                lastTime = newTime;
            }, 1000);

            let fib = (n) => {
                let arr = [0, 1];
                for (let i = 2; i < n + 1; i++) {
                    arr.push(arr[i - 2] + arr[i - 1])
                }
                return arr[n]
            };


            ///

            setInterval(() => {
                console.log('s0');
                let x = -1;
                do {
                    x++;
                 } while (x < 9999999999999999999999);
                 console.log('s1');
            }, 2000);
        }
    );
};

// Create a new worker for each processor
// for (let i = 0; i < coresLen; i++) {
createWorker();
// }