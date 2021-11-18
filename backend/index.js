import express from "express";
import got from 'got';
import Blockchain from './app/blockchain/index.js';
import PubSub from "./app/pubsub.js";
import Wallet from "./app/wallet/index.js";
import TransactionPool from "./app/wallet/transaction-pool.js";

const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain, transactionPool });

const DEFAULT_PORT = 5000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
    const {data} = req.body;

    blockchain.addBlock({ data });

    pubsub.broadcastChain();

    res.redirect('/api/blocks');
});

app.post('/api/transact', (req, res) => {
    const { amount, recipient } = req.body;
    
    let transaction = transactionPool
        .existingTransaction({ inputAddress: wallet.publicKey });

    try {
        if(transaction) {
            transaction.update({ senderWallet: wallet, recipient, amount });
        }else {
            transaction = wallet.createTransaction({ recipient, amount });
        }
    } catch (error) {
        return res.status(400).json({ type: 'error', message: error.message });
    }

    transactionPool.setTransaction(transaction);

    pubsub.broadcastTransaction(transaction);

    res.json({ type: 'success', transaction });
});

app.get('/api/transaction-pool-map', (req, res) => {
    res.json(transactionPool.transactionMap);
});

const syncChains = async() => {
    try {
		const response = await got(`${ROOT_NODE_ADDRESS}/api/blocks`);
		const rootChain = JSON.parse(response.body);

		console.log('replace chain on async with ', rootChain);
		blockchain.replaceChain(rootChain);
	} catch (error) {
		console.log(error.response.body);
		//=> 'Internal server error ...'
	}
}


let PEER_PORT;

if(process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;

app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`)
    
    if(PORT !== DEFAULT_PORT) {
        syncChains();
    }
});