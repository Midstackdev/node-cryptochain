

class TransactionMiner {
    constructor({ blockchain, transactionPool, wallet, pubsub }) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.pubsub = pubsub;
    }

    mineTransactions() {
        // get the transaction pool's valid transactions

        // generate the miner's reward

        // add a block consistig of these transactions to the blockchain

        // broadcast the update blockchain

        // clear the pool
    }
}

export default TransactionMiner;