import Block from '../block/index.js';
import { cryptoHash } from '../../utils/index.js';
import { MINING_REWARD, REWARD_INPUT } from '../../config.js';
import Transaction from '../wallet/transaction.js';

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length-1],
            data
        });

        this.chain.push(newBlock);
    }

    replaceChain(chain, onSuccess) {
        if(chain.length <= this.chain.length) {
            console.error('The incomming chain must be longer');
            return;
        }
        
        if(!Blockchain.isValidChain(chain)) {
            console.error('The incomming chain must be valid');
            return;
        }

        if (onSuccess) onSuccess();
        console.log('replacing chain with', chain);
        this.chain = chain;
    }

    validTransactionData({ chain }) {
        for(let i=1; i<chain.length; i++) {
            const block = chain[i];
            let rewardTransactionCount = 0;

            for (let transaction of block.data) {
                if(transaction.input.address === REWARD_INPUT.address) {
                    rewardTransactionCount += 1;

                    if(rewardTransactionCount > 1) {
                        console.error('Miner reward exceed limit');
                        return false;
                    }
                    if(Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
                        console.error('Miner reward amount is invalid');
                        return false;
                    }
                }else {
                    if(!Transaction.validTransaction(transaction)) {
                        console.error('Invalid transaction');
                        return false;
                    }
                }
            }
        }
        return true;
    }

    static isValidChain(chain) {
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }

        for(let i=1; i<chain.length; i++) {
            const { timestamp, lastHash, hash, nonce, difficulty, data } = chain[i];
            const actualLastHash = chain[i-1].hash;
            const lastDifficulty = chain[i-1].difficulty;

            if(lastHash !== actualLastHash) return false;

            const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);

            if(hash !== validatedHash) return false;

            if(Math.abs(lastDifficulty - difficulty) > 1) return false;
        }
        return true;
    }
}

export default Blockchain;