const Block = require('./block');

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock(data) {
    const block = Block.mineBlock(this.chain[this.chain.length-1], data);
    this.chain.push(block);
    return block;
  }

  /* заменить цепь на новую если она:
    a) действительная
    b) длинне текущей цепи
  */
  replaceChain(newChain) {
    if (newChain.length <= this.chain.length) {
      console.log('Received chain is not longer than the current chain.');
      return;
    } else

    if (!this.isValidChain(newChain)) {
      console.log('The received chain is not valid.');
      return;
    }

    console.log('Replacing blockchain with the new chain.');
    this.chain = newChain;
  }


  isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;
    // тогда проверяем каждый следующий блок
    for (let i=1; i<chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i-1];

      if (
        block.lastHash !== lastBlock.hash
        ||
        // эта часть гарантирует, что узел подключения к блокчейн не
        // имеет неправильный калькулятор хэш-функции
        block.hash !== Block.blockHash(block)
      ) {
        return false;
      }
    }

    return true;
  }

  // выводим длину цепочки и форматируем в String каждый блок цепочки
  toString() {
    let string = `Length of chain: ${this.chain.length}\n`;
    this.chain.forEach(block => {
      string += `${block.toString()}\n`;
    });
    return string;
  }
}

module.exports = Blockchain;
