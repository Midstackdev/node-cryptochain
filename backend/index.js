import express from "express";
import Blockchain from './blockchain.js';
import PubSub from "./pubsub.js";

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });

setTimeout(() => pubsub.broadcastChain(), 1000);

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

const DEFAULT_PORT = 5000;
let PEER_PORT;
console.log(process.env.GENERATE_PEER_PORT)
if(process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;

app.listen(PORT, () => console.log(`listening on port: ${PORT}`));