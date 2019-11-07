const crypto = require('crypto');

class Block {
  
    constructor(index, timestamp, transactions, previousHash = '') {
      this.index = index;
      this.previousHash = previousHash;
      this.timestamp = timestamp;
      this.transactions = transactions;
      this.hash = this.calculateHash();
      this.nonce = 0;
    }
  
    calculateHash() {
      return crypto.createHash('sha256').update(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).digest('hex');
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
          this.nonce++;
          this.hash = this.calculateHash();
        }
    
        console.log("Block mined: " + this.hash);
      }
  
  }
  
  class Blockchain {
    constructor() {
      this.chain = [this.createGenesisBlock()];
      this.difficulty = 5;
      this.pendingTransactions = [];
      this.miningReward = 100;
    }
  
    createGenesisBlock() {
      return new Block(0, Date.parse('2017-01-01'), [], '0');
    }
  
    getLatestBlock() {
      return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
      // Check if the Genesis block hasn't been tampered with by comparing
      // the output of createGenesisBlock with the first block on our chain
      const realGenesis = JSON.stringify(this.createGenesisBlock());
  
      if (realGenesis !== JSON.stringify(this.chain[0])) {
        return false;
      }
  
      // Check the remaining blocks on the chain to see if there hashes and
      // signatures are correct
      for (let i = 1; i < this.chain.length; i++) {
        const currentBlock = this.chain[i];
        const previousBlock = this.chain[i-1];

        if (currentBlock.hash !=  currentBlock.calculateHash()) {
          return false;
        }
  
        if (currentBlock.previousHash !== previousBlock.hash) {
          return false;
        }
      }
  
      return true;
    }
  
  }

  let mycoin = new Blockchain();

  console.log('Mining Block 1...')
  mycoin.addBlock(new Block(1, "03/11/2019", {amount: 10}));

  console.log('Mining Block 2...')
  mycoin.addBlock(new Block(2, "04/11/2019", {amount: 40}));

