const TronWeb = require('tronweb');
const Web3 = require('web3');
const readline = require('readline');

async function processEth(web3, hash) {
    while (true) {
        try {
            const tx = await web3.eth.getTransactionReceipt(hash);
            const gasPrice = (tx && tx.effectiveGasPrice) ? web3.utils.fromWei("" + tx.effectiveGasPrice, 'ether') : 0;
            const fee = (tx && tx.gasUsed) ? tx.gasUsed * gasPrice: 0;
	    console.log(hash, fee);
        } catch (e) {
            console.log(e);
            continue;
        }
        break;
    }
}

async function processTron(tronWeb, hash) {
    while (true) {
        try {
            const tx = await tronWeb.trx.getTransactionInfo(hash);
            console.log(hash, tx.fee ? parseFloat(tronWeb.fromSun(tx.fee)) : 0);
        } catch (e) {
            console.log(e);
            continue;
        }
        break;
    }
}

async function main() {
    if (process.argv.length >= 3) {
        console.error('set an argument - ethereum or tron');
        process.exit(1);
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });
    
    if (process.argv[2] == 'ethereum') {
        if (process.argv.length >= 4) {
            console.error('pass also ethereum http provider full url');
            process.exit(1);
        }
        web3 = new Web3(new Web3.providers.HttpProvider(process.argv[3]));
	for await (const line of rl) {
            await processEth(web3, line);
        }
    } else if (process.argv[2] == 'tron') {
        const tronWeb = new TronWeb(new TronWeb.providers.HttpProvider("https://api.trongrid.io"), new TronWeb.providers.HttpProvider("https://api.trongrid.io"), new TronWeb.providers.HttpProvider("https://api.trongrid.io"));

	for await (const line of rl) {
            await processTron(tronWeb, line);
        }
    } else {
        console.log('wtf', process.argv[2]);
    }
}

main();
