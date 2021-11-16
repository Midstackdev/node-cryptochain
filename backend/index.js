import express from "express";
import Blockchain from './blockchain.js';

const app = express();
const blockchain = new Blockchain();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
    const {data} = req.body;

    blockchain.addBlock({ data });

    res.redirect('/api/blocks');
});

const PORT = 5000;

app.listen(PORT, () => console.log(`listening on port: ${PORT}`));