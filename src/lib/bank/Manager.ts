import { GAMESTATE_KEYS } from "../constants";
import { loadGameState } from "../gameState";

interface Bank {
  balance: number;
}

let _instance: BankManager;

class BankManager {
  private _bank: Bank;

  constructor() {
    if (_instance) {
      throw new Error("Attempted to create a second instance of BankManager");
    }
    this._bank = loadGameState(GAMESTATE_KEYS.BANK, {
      balance: 1000,
    });
  }

  static getInstance() {
    console.time("BankManager.getInstance");
    if (!_instance) {
      _instance = new BankManager();
    }
    console.timeEnd("BankManager.getInstance");
    return _instance;
  }

  get balanceDisplay() {
    return document.getElementById("cash-display");
  }

  updateBalanceDisplay() {
    const display = this.balanceDisplay;
    if (!display) {
      return console.error("Bank balance display not found");
    }
    display.textContent = `$${this.balance}`;
  }

  get balance() {
    return this._bank.balance;
  }

  withdraw(amount: number) {
    this._bank.balance -= amount;
    this.updateBalanceDisplay();
  }

  deposit(amount: number) {
    this._bank.balance += amount;
    this.updateBalanceDisplay();
  }

  reset() {
    this._bank.balance = 0;
    this.updateBalanceDisplay();
  }

  save() {
    localStorage.setItem(GAMESTATE_KEYS.BANK, JSON.stringify(this._bank));
  }
}

export default BankManager.getInstance();
