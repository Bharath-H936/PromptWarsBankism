/**
 * bankCore.js - Core Banking System
 * 
 * Responsibilities:
 * - Manages bank ledger, customer balances, and immutable transaction audit logs.
 * - Auto-authenticates "testaccount" for frictionless testing (No PIN required for authorized users).
 * - Executes fund transfers, balance lookups, deposits, withdrawals, and interest calculation.
 * - Records both legitimate financial receipts and blocked security threat incidents.
 */

class BankCoreSystem {
  constructor() {
    // Pre-seeded accounts
    this.accounts = {
      "ACC-8839201": {
        username: "testaccount",
        fullName: "Test Account Holder",
        accountNumber: "ACC-8839201",
        balance: 10000.00,
        authenticated: true,
        tier: "Platinum Priority"
      },
      "ACC-1002341": {
        username: "alice",
        fullName: "Alice Smith",
        accountNumber: "ACC-1002341",
        balance: 5420.00,
        authenticated: false,
        tier: "Standard"
      },
      "ACC-2009812": {
        username: "bob",
        fullName: "Bob Miller",
        accountNumber: "ACC-2009812",
        balance: 3150.00,
        authenticated: false,
        tier: "Standard"
      },
      "ACC-3004567": {
        username: "charlie",
        fullName: "Charlie Davis",
        accountNumber: "ACC-3004567",
        balance: 1200.00,
        authenticated: false,
        tier: "Standard"
      },
      "ACC-4008923": {
        username: "diana",
        fullName: "Diana Prince",
        accountNumber: "ACC-4008923",
        balance: 8750.00,
        authenticated: false,
        tier: "Executive Preferred"
      },
      "ACC-5001289": {
        username: "edward",
        fullName: "Edward Norton",
        accountNumber: "ACC-5001289",
        balance: 4100.00,
        authenticated: false,
        tier: "Standard"
      },
      "ACC-6003412": {
        username: "fiona",
        fullName: "Fiona Gallagher",
        accountNumber: "ACC-6003412",
        balance: 6300.00,
        authenticated: false,
        tier: "Standard"
      }
    };

    // Immutable audit ledger
    this.ledger = [
      {
        id: "TXN-100001",
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        type: "ACCOUNT_OPENED",
        accountNumber: "ACC-8839201",
        amount: 10000.00,
        description: "Initial account provisioning & auto-authentication granted for testaccount.",
        status: "COMPLETED",
        balanceAfter: 10000.00
      }
    ];
  }

  /**
   * Resolves an account by either Account Number or Username (case-insensitive)
   */
  findAccount(identifier) {
    if (!identifier) return null;
    const clean = String(identifier).trim().toLowerCase();

    // Match exact account number
    for (const accNum in this.accounts) {
      if (accNum.toLowerCase() === clean) {
        return this.accounts[accNum];
      }
    }

    // Match username
    for (const accNum in this.accounts) {
      if (this.accounts[accNum].username.toLowerCase() === clean) {
        return this.accounts[accNum];
      }
    }

    return null;
  }

  /**
   * Retrieves active balance
   */
  getBalance(accountNumber) {
    const acc = this.findAccount(accountNumber);
    if (!acc) {
      return { success: false, message: `Account ${accountNumber} not found.` };
    }
    return {
      success: true,
      username: acc.username,
      accountNumber: acc.accountNumber,
      balance: acc.balance,
      formattedBalance: `$${acc.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    };
  }

  /**
   * Executes a fund transfer between accounts
   */
  transfer(fromAccountNum, toIdentifier, amount) {
    const sender = this.findAccount(fromAccountNum);
    if (!sender) {
      return { success: false, message: `Sender account not found.` };
    }

    const recipient = this.findAccount(toIdentifier);
    if (!recipient) {
      return { success: false, message: `Recipient '${toIdentifier}' not found in bank directory.` };
    }

    if (recipient.accountNumber === sender.accountNumber) {
      return { success: false, message: `Cannot transfer funds to the same account.` };
    }

    if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
      return { success: false, message: `Invalid transfer amount: $${amount}. Must be greater than zero.` };
    }

    if (sender.balance < amount) {
      return {
        success: false,
        message: `Insufficient funds. Transfer of $${amount.toFixed(2)} exceeds current balance of $${sender.balance.toFixed(2)}.`
      };
    }

    // Deduct & credit
    sender.balance -= amount;
    recipient.balance += amount;

    const txnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const record = {
      id: txnId,
      timestamp: new Date().toISOString(),
      type: "TRANSFER_OUT",
      accountNumber: sender.accountNumber,
      recipientAccount: recipient.accountNumber,
      recipientName: recipient.username,
      amount: -amount,
      description: `Transfer to ${recipient.username} (${recipient.accountNumber})`,
      status: "COMPLETED",
      balanceAfter: sender.balance
    };

    this.ledger.unshift(record);

    return {
      success: true,
      transactionId: txnId,
      amount: amount,
      recipient: recipient.username,
      recipientAccount: recipient.accountNumber,
      newBalance: sender.balance,
      formattedBalance: `$${sender.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      message: `Successfully transferred $${amount.toFixed(2)} to ${recipient.username} (${recipient.accountNumber}).`
    };
  }

  /**
   * Deposits money into an account
   */
  deposit(accountNumber, amount) {
    const acc = this.findAccount(accountNumber);
    if (!acc) return { success: false, message: "Account not found." };
    if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
      return { success: false, message: "Invalid deposit amount." };
    }

    acc.balance += amount;
    const txnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const record = {
      id: txnId,
      timestamp: new Date().toISOString(),
      type: "DEPOSIT",
      accountNumber: acc.accountNumber,
      amount: amount,
      description: `Cash deposit processed.`,
      status: "COMPLETED",
      balanceAfter: acc.balance
    };
    this.ledger.unshift(record);

    return {
      success: true,
      transactionId: txnId,
      amount: amount,
      newBalance: acc.balance,
      formattedBalance: `$${acc.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      message: `Successfully deposited $${amount.toFixed(2)}.`
    };
  }

  /**
   * Deducts / withdraws money from an account
   */
  withdraw(accountNumber, amount) {
    const acc = this.findAccount(accountNumber);
    if (!acc) return { success: false, message: "Account not found." };
    if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
      return { success: false, message: "Invalid withdrawal amount." };
    }

    if (acc.balance < amount) {
      return { success: false, message: `Insufficient funds for withdrawal of $${amount.toFixed(2)}.` };
    }

    acc.balance -= amount;
    const txnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const record = {
      id: txnId,
      timestamp: new Date().toISOString(),
      type: "WITHDRAWAL",
      accountNumber: acc.accountNumber,
      amount: -amount,
      description: `Cash withdrawal processed.`,
      status: "COMPLETED",
      balanceAfter: acc.balance
    };
    this.ledger.unshift(record);

    return {
      success: true,
      transactionId: txnId,
      amount: amount,
      newBalance: acc.balance,
      formattedBalance: `$${acc.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      message: `Successfully withdrew $${amount.toFixed(2)}.`
    };
  }

  /**
   * Applies interest to an account (default 5%)
   */
  addInterest(accountNumber, rate = 0.05) {
    const acc = this.findAccount(accountNumber);
    if (!acc) return { success: false, message: "Account not found." };

    const interestAmount = Math.round(acc.balance * rate * 100) / 100;
    acc.balance += interestAmount;

    const txnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const record = {
      id: txnId,
      timestamp: new Date().toISOString(),
      type: "INTEREST_CREDIT",
      accountNumber: acc.accountNumber,
      amount: interestAmount,
      description: `Monthly savings interest credited (${(rate * 100).toFixed(1)}%).`,
      status: "COMPLETED",
      balanceAfter: acc.balance
    };
    this.ledger.unshift(record);

    return {
      success: true,
      transactionId: txnId,
      interestAmount: interestAmount,
      ratePercentage: (rate * 100).toFixed(1) + "%",
      newBalance: acc.balance,
      formattedBalance: `$${acc.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      message: `Monthly interest of $${interestAmount.toFixed(2)} credited at ${(rate * 100).toFixed(1)}%.`
    };
  }

  /**
   * Logs a security block/incident into the ledger for statement audit
   */
  logSecurityIncident(accountNumber, details) {
    const txnId = `SEC-${Math.floor(100000 + Math.random() * 900000)}`;
    const record = {
      id: txnId,
      timestamp: new Date().toISOString(),
      type: "SECURITY_BLOCK",
      accountNumber: accountNumber,
      riskLevel: details["risk-level"] || "medium",
      riskCategory: details["risk-category"] || "unknown",
      description: `[BLOCKED] ${details["reason statement"] || "Unauthorized query rejected"}`,
      status: "REJECTED",
      balanceAfter: this.accounts[accountNumber] ? this.accounts[accountNumber].balance : null
    };
    this.ledger.unshift(record);
    return record;
  }

  /**
   * Gets chronological transaction statements for an account
   */
  getStatements(accountNumber) {
    const clean = String(accountNumber || "").toUpperCase();
    return this.ledger.filter(entry => entry.accountNumber === clean);
  }

  /**
   * Returns directory of valid transfer recipient accounts (excluding current user's account)
   */
  getRecipientDirectory(excludeAccount = "ACC-8839201") {
    const cleanExclude = String(excludeAccount || "").toUpperCase();
    const directory = [];

    for (const accNum in this.accounts) {
      if (accNum.toUpperCase() !== cleanExclude) {
        const acc = this.accounts[accNum];
        directory.push({
          username: acc.username,
          fullName: acc.fullName,
          accountNumber: acc.accountNumber,
          balance: acc.balance,
          formattedBalance: `$${acc.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
          tier: acc.tier
        });
      }
    }

    return directory;
  }
}

// Support Node.js CommonJS and browser window export
if (typeof module !== "undefined" && module.exports) {
  module.exports = BankCoreSystem;
} else if (typeof window !== "undefined") {
  window.BankCoreSystem = BankCoreSystem;
}
