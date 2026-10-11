/**
 * bankHandler.js - Agent 2: BankHandler Action Dispatcher
 * 
 * Responsibilities:
 * - Coordinates directly with BankCoreSystem.
 * - Receives structured JSON from Agent 1 (bankism).
 * - Enforces zero-tolerance: if bankism rejected the query, BankHandler halts immediately and logs incident.
 * - If approved, validates required banking parameters (e.g. missing amount/recipient).
 * - Executes the verified transaction on the bank ledger and outputs the statement receipt.
 */

class BankHandlerAgent {
  /**
   * @param {BankCoreSystem} bankCoreInstance - Reference to core bank system
   */
  constructor(bankCoreInstance) {
    this.name = "BankHandler";
    this.bank = bankCoreInstance;
  }

  /**
   * Processes the verified payload from Agent 1 (bankism)
   * @param {Object} bankismPayload - The structured JSON received from bankism
   * @returns {Object} Structured execution output and banking statement
   */
  processAction(bankismPayload) {
    const accNumber = bankismPayload["bank account number"] || "ACC-8839201";
    const status = bankismPayload["status of the action"];
    const action = bankismPayload.action;
    const params = bankismPayload.parameters || {};

    // 1. If bankism rejected the query: Block immediately!
    if (status !== "approved") {
      // Record security alert in the bank ledger
      const incident = this.bank.logSecurityIncident(accNumber, bankismPayload);

      return {
        status: "REJECTED_BY_GATEKEEPER",
        executed: false,
        action: action,
        message: `[SECURITY BLOCK] Transaction cancelled. Agent 1 (bankism) flagged this query as ${bankismPayload["risk-level"].toUpperCase()} risk (${bankismPayload["risk-category"]}).`,
        details: bankismPayload["reason statement"],
        incidentId: incident.id,
        statementReceipt: {
          reference: incident.id,
          timestamp: incident.timestamp,
          type: "SECURITY_BLOCK",
          notes: bankismPayload["reason statement"]
        }
      };
    }

    // 2. Query was APPROVED by bankism: Validate banking parameters
    switch (action) {
      case "check balance": {
        const balResult = this.bank.getBalance(accNumber);
        return {
          status: "SUCCESS",
          executed: true,
          action: "check balance",
          message: `Current balance for ${balResult.username} (${balResult.accountNumber}) is ${balResult.formattedBalance}.`,
          data: balResult
        };
      }

      case "fund transfer": {
        // Parameter check 1: Amount specified?
        if (params.amount === null || params.amount === undefined || isNaN(params.amount) || params.amount <= 0) {
          return {
            status: "MISSING_PARAMETERS",
            executed: false,
            action: "fund transfer",
            message: "Amount not specified. Please specify the amount you wish to transfer.",
            missingField: "amount"
          };
        }

        // Parameter check 2: Recipient specified?
        if (!params.recipient) {
          return {
            status: "MISSING_PARAMETERS",
            executed: false,
            action: "fund transfer",
            message: "Recipient not specified. Please specify the recipient account or username.",
            missingField: "recipient"
          };
        }

        // Dispatch transfer to Bank Core
        const txn = this.bank.transfer(accNumber, params.recipient, params.amount);
        if (!txn.success) {
          return {
            status: "FAILED_BANK_VALIDATION",
            executed: false,
            action: "fund transfer",
            message: txn.message
          };
        }

        return {
          status: "SUCCESS",
          executed: true,
          action: "fund transfer",
          message: txn.message,
          data: txn
        };
      }

      case "add interest": {
        const rate = params.rate || 0.05;
        const interestTxn = this.bank.addInterest(accNumber, rate);
        return {
          status: "SUCCESS",
          executed: true,
          action: "add interest",
          message: interestTxn.message,
          data: interestTxn
        };
      }

      case "deposit funds": {
        if (!params.amount || params.amount <= 0) {
          return {
            status: "MISSING_PARAMETERS",
            executed: false,
            action: "deposit funds",
            message: "Amount not specified. Please specify the amount to deposit."
          };
        }
        const depTxn = this.bank.deposit(accNumber, params.amount);
        return {
          status: "SUCCESS",
          executed: true,
          action: "deposit funds",
          message: depTxn.message,
          data: depTxn
        };
      }

      case "withdraw funds": {
        if (!params.amount || params.amount <= 0) {
          return {
            status: "MISSING_PARAMETERS",
            executed: false,
            action: "withdraw funds",
            message: "Amount not specified. Please specify the amount to withdraw."
          };
        }
        const withTxn = this.bank.withdraw(accNumber, params.amount);
        if (!withTxn.success) {
          return {
            status: "FAILED_BANK_VALIDATION",
            executed: false,
            action: "withdraw funds",
            message: withTxn.message
          };
        }
        return {
          status: "SUCCESS",
          executed: true,
          action: "withdraw funds",
          message: withTxn.message,
          data: withTxn
        };
      }

      default: {
        return {
          status: "INVALID_OPERATION",
          executed: false,
          action: action,
          message: `Unrecognized action '${action}' cannot be processed by BankHandler.`
        };
      }
    }
  }
}

// Support Node.js CommonJS and browser window export
if (typeof module !== "undefined" && module.exports) {
  module.exports = BankHandlerAgent;
} else if (typeof window !== "undefined") {
  window.BankHandlerAgent = BankHandlerAgent;
}
