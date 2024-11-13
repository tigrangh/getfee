const readline = require('readline');

async function print(line, sleepAmount) {
    await new Promise(r => setTimeout(r, sleepAmount));

    console.log(line);
}

async function main() {
    if (process.argv.length !== 3) {
        console.error('pass sleep time in milliseconds as additional argument');
        process.exit(1);
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: null,
        terminal: false
    });

    const sleepAmount = Math.abs(parseInt(process.argv[2]));

    for await (const line of rl) {
        await print(line, sleepAmount);
    }
}

main();
