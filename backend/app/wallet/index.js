import { STARTING_BALANCE } from "../../config.js";
import { ec, cryptoHash } from "../../utils/index.js";
import Transaction from "./transaction.js";

class Wallet {
    constructor() {
        this.balance = STARTING_BALANCE;

        this.keyPair = ec.genKeyPair();

        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    sign(data) {
        return this.keyPair.sign(cryptoHash(data));
    }

    createTransaction({ recipient, amount }) {
        if(amount > this.balance) {
            throw new Error('Amount exceeds balance');
        }

        return new Transaction({ senderWallet: this, recipient, amount });
    }

}

export default Wallet;