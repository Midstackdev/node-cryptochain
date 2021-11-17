import { STARTING_BALANCE } from "../../config.js";
import cryptoHash from "../../utils/crypto-hash.js";
import { ec } from "../../utils/index.js";

class Wallet {
    constructor() {
        this.balance = STARTING_BALANCE;

        this.keyPair = ec.genKeyPair();

        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    sign(data) {
        return this.keyPair.sign(cryptoHash(data));
    }

}

export default Wallet;