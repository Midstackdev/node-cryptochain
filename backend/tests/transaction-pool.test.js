import {jest} from '@jest/globals';
import TransactionPool from '../app/wallet/transaction-pool.js';
import Transaction from '../app/wallet/transaction.js';
import Wallet from '../app/wallet/index.js';
import Blockchain from '../app/blockchain/index.js';

describe('TransactionPool', () => {
    let transactionPool, transaction, senderWallet;
    
    beforeEach(() => {
        transactionPool = new TransactionPool();
        senderWallet = new Wallet(),
        transaction = new Transaction({
            senderWallet,
            recipient: 'fake-recipient',
            amount: 50
        });
    });

    describe('setTransaction()', () => {
        it('adds a transaction', () => {
            transactionPool.setTransaction(transaction);

            expect(transactionPool.transactionMap[transaction.id])
                .toBe(transaction);
        });
    });
    
    describe('existingTransaction()', () => {
        it('returns an existing transaction given an input address', () => {
            transactionPool.setTransaction(transaction);

            expect(
                transactionPool.existingTransaction({ inputAddress: senderWallet.publicKey })
            ).toBe(transaction);
        });
    });
    
    describe('validTransactions()', () => {
        let validTransactions, errorMock;

        beforeEach(() => {
            validTransactions = [];
            errorMock = jest.fn();

            global.console.error = errorMock;

            for (let i = 0; i < 10; i++) {
                transaction = new Transaction({
                    senderWallet,
                    recipient: 'any-recipient',
                    amount: 30
                });

                if (i%3===0) {
                    transaction.input.amount = 999999;
                } else if (i%3===1) {
                    transaction.input.signature = new Wallet().sign('foo');
                }  else {
                    validTransactions.push(transaction);
                }
                
                transactionPool.setTransaction(transaction);
            }
        });

        it('returns valid transaction', () => {
            expect(transactionPool.validTransactions()).toEqual(validTransactions);
        });
        
        it('logs errors for the valid transaction', () => {
            transactionPool.validTransactions();
            expect(errorMock).toHaveBeenCalled();
        });
    });

    describe('clear()', () => {
        it('clears the transactions', () => {
            transactionPool.clear();

            expect(transactionPool.transactionMap).toEqual({})
        });
    });
    
    describe('clearBlockChainTransactions()', () => {
        it('clears the pool of any existing blockchain transactions', () => {
            const blockchain = new Blockchain();
            const expectedTransactionMap = {};

            for (let i = 0; i < 6; i++) {
                const transaction = new Wallet().createTransaction({
                    recipient: 'foo', amount: 20
                });

                transactionPool.setTransaction(transaction);

                if(i%2===0) {
                    blockchain.addBlock({ data: [transaction] });
                }else {
                    expectedTransactionMap[transaction.id] = transaction
                }
            }
            
            transactionPool.clearBlockChainTransactions({ chain: blockchain.chain });

            expect(transactionPool.transactionMap).toEqual(expectedTransactionMap);
        });
    });
});