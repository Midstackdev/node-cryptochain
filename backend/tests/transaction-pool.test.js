import TransactionPool from '../app/wallet/transaction-pool.js';
import Transaction from '../app/wallet/transaction.js';
import Wallet from '../app/wallet/index.js';

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
        it('retuns an existing transaction given an input address', () => {
            transactionPool.setTransaction(transaction);

            expect(
                transactionPool.existingTransaction({ inputAddress: senderWallet.publicKey })
            ).toBe(transaction);
        });
    });
});