// Каждый класс miner будет иметь blockchain и transactionPool
// Основная задача - добавить блоки в цепочку, состоящую из транзакций в пуле транзакций
// затем очистить transactionPool
const Transaction = require('../wallet/transaction');

class Miner {
  constructor(blockchain, transactionPool, wallet, p2pServer) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  // Соединяем транзакции, blockchain и p2pServer
  mine() {
    const validTransactions = this.transactionPool.validTransactions();
    // включаем вознаграждение для майнера после каждой транзакции
    validTransactions.push(Transaction.rewardTransaction(this.wallet));
    // создаем блок, состоящий из действительных транзакций
    const block = this.blockchain.addBlock(validTransactions);
    // синхронизируем цепочки на одноранговом сервере
    this.p2pServer.syncChains();
    // очищаем пул транзакций
    // обращаемся к каждому майнеру с целью очитски их пулов транзакций
    this.transactionPool.clear();
    this.p2pServer.broadcastClearTransactions();

    return block;
  }
}

module.exports = Miner;