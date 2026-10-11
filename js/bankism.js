/**
 * bankism.js - Agent 1: Cybersecurity Blue Team Agent
 * 
 * Responsibilities:
 * - Isolated from Core Banking System (ZERO DB/ledger access).
 * - Analyzes spoken/natural language queries for security risks.
 * - Detects Roleplay attacks, Guideline Overrides, Encoded payloads, and Social Engineering.
 * - Enforces consecutive attack lockout (3 consecutive high/critical attacks).
 * - Always responds strictly in the required JSON format.
 */

class BankismAgent {
  constructor() {
    this.name = "bankism";
    this.consecutiveAttacks = 0;
    this.isLockedDown = false;
    this.attackHistory = [];
  }

  /**
   * Resets the security lockout state
   */
  resetLockdown() {
    this.isLockedDown = false;
    this.consecutiveAttacks = 0;
  }

  /**
   * Primary entry point: Evaluates a spoken query
   * @param {string} query - Spoken language input from user
   * @param {Object} session - Authenticated session identity { username, accountNumber }
   * @returns {Object} Structured JSON output required by specification
   */
  analyzeQuery(query, session = { username: "testaccount", accountNumber: "ACC-8839201" }) {
    const rawQuery = (query || "").trim();
    const cleanLower = rawQuery.toLowerCase();

    const result = {
      username: session.username,
      "bank account number": session.accountNumber,
      action: "invalid request",
      "status of the action": "rejected",
      "risk-level": "none",
      "risk-category": "none",
      "reason statement": "",
      parameters: {}
    };

    // 0. Check if account is in Security Lockdown
    if (this.isLockedDown) {
      result.action = "invalid request";
      result["status of the action"] = "rejected";
      result["risk-level"] = "critical";
      result["risk-category"] = "lockdown";
      result["reason statement"] = "Account is in Security Lockdown due to repeated adversarial attacks. Re-authentication required.";
      return result;
    }

    if (!rawQuery) {
      result["reason statement"] = "Empty input query provided.";
      return result;
    }

    // 1. Identify Threat Vectors
    const threat = this.detectThreat(rawQuery, cleanLower, session);

    if (threat.detected) {
      this.consecutiveAttacks++;
      this.attackHistory.push({ query: rawQuery, threat, timestamp: new Date().toISOString() });

      result.action = threat.inferredAction || "invalid request";
      result["status of the action"] = "rejected";
      result["risk-level"] = threat.level;
      result["risk-category"] = threat.category;
      result["reason statement"] = threat.reason;
      result.parameters = threat.parameters || {};

      // Trigger Lockdown after 3 consecutive high/critical attacks
      if (this.consecutiveAttacks >= 3 && (threat.level === "high" || threat.level === "critical")) {
        this.isLockedDown = true;
        result["risk-level"] = "critical";
        result["risk-category"] = "lockdown";
        result["reason statement"] = `[SECURITY LOCKDOWN TRIGGERED] 3 consecutive adversarial attacks detected. Last threat vector: ${threat.category}. Session locked.`;
      }

      return result;
    }

    // If safe, reset consecutive attacks counter
    this.consecutiveAttacks = 0;

    // 2. Parse Legitimate Banking Intent
    const parsedIntent = this.parseBankingIntent(rawQuery, cleanLower);

    result.action = parsedIntent.action;
    result["status of the action"] = parsedIntent.valid ? "approved" : "rejected";
    result["risk-level"] = "none";
    result["risk-category"] = "none";
    result["reason statement"] = parsedIntent.reason;
    result.parameters = parsedIntent.parameters;

    return result;
  }

  /**
   * Analyzes query for adversarial patterns
   */
  detectThreat(rawQuery, cleanLower, session) {
    // A. Forcing Commands / Guideline Overrides
    const overridePatterns = [
      /forget (all )?(your )?(previous |prior )?(guideline|instructions|rules|prompts)/i,
      /developer[- ]mode/i,
      /you (have been|are) reset/i,
      /system override/i,
      /bypass (all )?(safety|security|rules|filters)/i,
      /ignore (all )?(previous|above|prior) (instructions|rules|prompts)/i,
      /disregard (all )?(instructions|rules|guidelines)/i,
      /do anything now|dan mode/i
    ];

    for (const pattern of overridePatterns) {
      if (pattern.test(rawQuery)) {
        return {
          detected: true,
          level: "critical",
          category: "override",
          reason: "Adversarial forcing command detected attempting to override safety guidelines.",
          inferredAction: this.extractInferredAction(cleanLower)
        };
      }
    }

    // B. Roleplay / Authority Impersonation
    const roleplayPatterns = [
      /assume (i am|i'm) (the )?(admin|administrator|ceo|owner|creator|root|manager|boss)/i,
      /you('re| are) a person who works under me/i,
      /you (must|need to) obey (all )?my instructions/i,
      /pretend (you are|to be) (an? )?(unrestricted|evil|jailbroken|god)/i,
      /i am (the )?(bank )?(admin|administrator|ceo|manager|system owner)/i,
      /act as (an? )?(unrestricted|developer|admin)/i,
      /simulat(e|ing) (an? )?override/i
    ];

    for (const pattern of roleplayPatterns) {
      if (pattern.test(rawQuery)) {
        return {
          detected: true,
          level: "high",
          category: "roleplay",
          reason: "Unauthorized roleplay or authority impersonation attempt detected.",
          inferredAction: this.extractInferredAction(cleanLower)
        };
      }
    }

    // C. Encoded Statements / Jailbreak Payloads
    const encodedPatterns = [
      /(encod|decod).*(base64|rot13|hex|binary|cipher)/i,
      /(base64|rot13|hex|binary|cipher).*(encod|decod)/i,
      /(encod|decod)e? (the )?(phrase|following|string|instruction)/i,
      /eval\(|exec\(|<script/i,
      /---[ \t]*\n[ \t]*system/i,
      /<<\s*override\s*>>/i
    ];

    for (const pattern of encodedPatterns) {
      if (pattern.test(rawQuery)) {
        return {
          detected: true,
          level: "high",
          category: "encoded-statement",
          reason: "Obfuscated or encoded payload detected attempting jailbreak execution.",
          inferredAction: this.extractInferredAction(cleanLower)
        };
      }
    }

    // Check for inline Base64 payload strings (length > 20 with standard base64 alphabet)
    const base64Regex = /\b[A-Za-z0-9+/]{24,}={0,2}\b/;
    if (base64Regex.test(rawQuery) && (cleanLower.includes("decode") || cleanLower.includes("follow") || cleanLower.includes("run"))) {
      return {
        detected: true,
        level: "critical",
        category: "encoded-statement",
        reason: "Inline Base64 encoded payload detected with execution directives.",
        inferredAction: this.extractInferredAction(cleanLower)
      };
    }

    // D. Indirect Payload / Delimiter Injection / Prompt Leaking
    const injectionPatterns = [
      /print (your )?(system prompt|initial instructions|secret key)/i,
      /reveal (your )?(hidden prompt|core directives|system instructions)/i,
      /what (are|were) your (exact )?(instructions|system prompts)/i
    ];

    for (const pattern of injectionPatterns) {
      if (pattern.test(rawQuery)) {
        return {
          detected: true,
          level: "medium",
          category: "indirect-payload",
          reason: "Prompt extraction or internal instruction leakage attempt detected.",
          inferredAction: "invalid request"
        };
      }
    }

    // E. Identity Spoofing (Option C: Checks if attempting unauthorized account hijack)
    const impersonateRegex = /(transfer|send|withdraw).*(from|using)\s+account\s+([A-Za-z0-9-]+)/i;
    const matchImp = rawQuery.match(impersonateRegex);
    if (matchImp) {
      const claimedAcc = matchImp[3].toUpperCase();
      if (claimedAcc !== session.accountNumber && claimedAcc !== session.username) {
        return {
          detected: true,
          level: "high",
          category: "social-engineering",
          reason: `Unauthorized account access attempt: requested access to ${claimedAcc} while authenticated as ${session.accountNumber}.`,
          inferredAction: "fund transfer"
        };
      }
    }

    return { detected: false };
  }

  /**
   * Helper to identify what banking action was wrapped inside a trojan/adversarial query
   */
  extractInferredAction(cleanLower) {
    if (cleanLower.includes("transfer") || cleanLower.includes("send") || cleanLower.includes("wire")) {
      return "fund transfer";
    }
    if (cleanLower.includes("balance") || cleanLower.includes("how much")) {
      return "check balance";
    }
    if (cleanLower.includes("interest")) {
      return "add interest";
    }
    if (cleanLower.includes("withdraw") || cleanLower.includes("deduct")) {
      return "withdraw funds";
    }
    if (cleanLower.includes("deposit")) {
      return "deposit funds";
    }
    return "invalid request";
  }

  /**
   * Parses safe, legitimate spoken banking requests
   */
  parseBankingIntent(rawQuery, cleanLower) {
    // 1. Add / Apply Interest (check before balance inquiry since user may say 'add interest to balance')
    if (
      cleanLower.includes("interest") ||
      cleanLower.includes("add interest") ||
      cleanLower.includes("apply interest") ||
      cleanLower.includes("calculate interest")
    ) {
      // Check if custom rate specified (e.g. 5% or 3%)
      const rateMatch = cleanLower.match(/(\d+(?:\.\d+)?)%/);
      const rate = rateMatch ? parseFloat(rateMatch[1]) / 100 : 0.05;

      return {
        valid: true,
        action: "add interest",
        reason: "Valid interest calculation and addition request.",
        parameters: { rate }
      };
    }

    // 2. Balance Inquiries
    if (
      cleanLower.includes("balance") ||
      cleanLower.includes("how much money") ||
      cleanLower.includes("how much cash") ||
      cleanLower.includes("what is my balance") ||
      cleanLower.includes("check balance") ||
      cleanLower.includes("my funds")
    ) {
      return {
        valid: true,
        action: "check balance",
        reason: "Valid balance inquiry request.",
        parameters: {}
      };
    }

    // 3. Fund Transfer (Send, Transfer, Wire, Pay)
    if (
      cleanLower.includes("transfer") ||
      cleanLower.includes("send") ||
      cleanLower.includes("wire") ||
      cleanLower.includes("pay")
    ) {
      const amount = this.extractAmount(cleanLower);
      const recipient = this.extractRecipient(cleanLower);

      return {
        valid: true,
        action: "fund transfer",
        reason: "Valid fund transfer request verified.",
        parameters: {
          amount: amount,
          recipient: recipient
        }
      };
    }

    // 4. Deposit Funds
    if (cleanLower.includes("deposit") || cleanLower.includes("add funds") || cleanLower.includes("add money")) {
      const amount = this.extractAmount(cleanLower);
      return {
        valid: true,
        action: "deposit funds",
        reason: "Valid deposit request verified.",
        parameters: { amount: amount }
      };
    }

    // 5. Withdraw / Deduct Funds
    if (cleanLower.includes("withdraw") || cleanLower.includes("deduct") || cleanLower.includes("take out")) {
      const amount = this.extractAmount(cleanLower);
      return {
        valid: true,
        action: "withdraw funds",
        reason: "Valid withdrawal request verified.",
        parameters: { amount: amount }
      };
    }

    // 6. Unknown / Non-banking queries
    return {
      valid: false,
      action: "invalid request",
      reason: "Request does not map to any recognized banking operation.",
      parameters: {}
    };
  }

  /**
   * Extracts monetary amounts from spoken queries (e.g., "$500", "500 dollars", "50 bucks", "100.50")
   */
  extractAmount(text) {
    // Check for explicit dollar notation or numbers
    const match = text.match(/\$\s*(\d+(?:\.\d+)?)|(\d+(?:\.\d+)?)\s*(dollars|bucks|usd)?/i);
    if (match) {
      const val = parseFloat(match[1] || match[2]);
      if (!isNaN(val) && val > 0) return val;
    }
    return null;
  }

  /**
   * Extracts recipient name or account number from spoken query
   */
  extractRecipient(text) {
    // Look for patterns like "to Bob", "to account 1002", "to Alice"
    const match = text.match(/\bto\s+(?:account\s+)?([A-Za-z0-9_-]+)/i);
    if (match) {
      const target = match[1].trim();
      // Exclude generic words like "my", "the", "account"
      if (!["my", "the", "a", "account"].includes(target.toLowerCase())) {
        return target;
      }
    }
    return null;
  }
}

// Support Node.js CommonJS and browser window export
if (typeof module !== "undefined" && module.exports) {
  module.exports = BankismAgent;
} else if (typeof window !== "undefined") {
  window.BankismAgent = BankismAgent;
}
