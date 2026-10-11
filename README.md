# PromptWars - Multi-Agent Banking Security Platform

## What Does This Project Do?
PromptWars is a multi-agent cybersecurity banking application that protects financial systems from adversarial spoken and written language attacks. It uses two coordinated agents:
* **Agent 1 (`bankism`)**: A Blue Team gatekeeper isolated in a zero-trust DMZ with no database access. It parses spoken queries, detects prompt injection threats (roleplay, forcing overrides, base64 jailbreaks, account spoofing), and outputs structured JSON telemetry.
* **Agent 2 (`BankHandler`)**: The operational dispatcher. It reviews `bankism`'s JSON. If safe, it validates parameters and executes banking actions; if flagged, it blocks the transaction and logs the security threat.

## Why Is This Project Helpful?
Modern banking is adopting AI voice and chat interfaces, exposing core systems to prompt injection and unauthorized overrides. This project demonstrates how an isolated cybersecurity gatekeeper prevents unauthorized transactions while providing frictionless conversational banking.

## What This Project Can Do (Core Capabilities)
* **Natural & Spoken Language Parsing**: Accepts typed text or voice input using browser Speech-to-Text (`Web Speech API`).
* **Threat Mitigation**: Blocks roleplay attacks, developer-mode overrides, Base64/cipher jailbreaks, and unauthorized account spoofing.
* **Core Banking Operations**: Executes balance checks, deposits, withdrawals, fund transfers, and monthly savings interest (+5%).
* **Auto-Authenticated Session**: Pre-loads `testaccount` (`ACC-8839201`, $10,000 balance) requiring zero PIN for authorized users, but rejecting any suspicious prompt.
* **Transfer Accounts Directory**: Leftmost middle button (`👥 Accounts`) opens a slide-out drawer showing 6 verified recipient accounts with one-click transfer chips.
* **Defensive Lockdown**: Freezes the account if 3 consecutive high-risk attacks occur until an unlock action is triggered.
* **Automated Red-Team Audit**: Agent `tester` executes 20 automated test cases with 100% test pass rate.

## Tech Stack Used
* **Backend**: Node.js (`server.js`) and Python (`server.py`) using native standard library HTTP modules (zero npm/pip dependencies required).
* **Frontend**: Pure HTML5 (`index.html`), CSS3 (`style.css` in classic dark banking theme), and modular Vanilla JavaScript (`js/bankism.js`, `js/bankCore.js`, `js/bankHandler.js`, `js/app.js`).
* **Testing**: Automated CLI auditor (`tester.js`).

## User Manual: How to Run and Use

### 1. Launch the Project
Run either backend server (both serve the full project on port 8000):
```powershell
node server.js        # Option A: Node.js server
python server.py      # Option B: Python server
```
* **Working Link**: [http://localhost:8000](http://localhost:8000)
* **Direct File Link**: [`index.html`](file:///c:/Users/chann/Downloads/PromptWars/index.html)

### 2. How to Use the Interface
1. **Submit Commands**: Type or click `🎙️ Speak` to speak a command (e.g., *"Transfer $500 to Bob"*, *"Check my balance"*, *"Add 5% interest"*). Click **Execute Command**.
2. **Review Security Telemetry**: The top-right division shows `bankism`'s real-time risk level badge, approval status, and formatted JSON telemetry.
3. **Inspect Banking Statements**: The bottom-right division displays the execution receipt and chronological statement ledger table.
4. **Browse Recipient Directory**: Click the gold **`👥 Accounts`** button docked at the leftmost middle edge to view transfer targets and use quick-transfer chips.
5. **Run Security Audit**: Click **`🧪 Run Automated Security Audit`** in the UI or run `node tester.js` in your terminal to test all 20 security scenarios.
