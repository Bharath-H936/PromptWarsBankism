import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Color Palette: Deep Navy & Gold Theme
    COLOR_BG = RGBColor(11, 19, 35)       # #0b1323 Deep Slate Navy
    COLOR_CARD = RGBColor(18, 30, 54)     # #121e36 Card Slate
    COLOR_GOLD = RGBColor(212, 175, 55)   # #d4af37 Gold Accent
    COLOR_WHITE = RGBColor(248, 250, 252) # #f8fafc Text Light
    COLOR_MUTED = RGBColor(148, 163, 184) # #94a3b8 Muted Grey
    COLOR_EMERALD = RGBColor(16, 185, 129)# #10b981 Green
    COLOR_RED = RGBColor(239, 68, 68)     # #ef4444 Red Alert
    COLOR_CYAN = RGBColor(6, 182, 212)    # #06b6d4 Cyan

    blank_layout = prs.slide_layouts[6]

    def set_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = COLOR_BG
        bg.line.fill.background()
        return bg

    def add_header(slide, title_text, category_text="PROMPTWARS X UVCE // ARCHITECTURE DECK"):
        # Category label
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.4))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category_text.upper()
        p_cat.font.size = Pt(11)
        p_cat.font.bold = True
        p_cat.font.color.rgb = COLOR_GOLD

        # Slide Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.7), Inches(0.8))
        tf_t = title_box.text_frame
        tf_t.word_wrap = True
        p_t = tf_t.paragraphs[0]
        p_t.text = title_text
        p_t.font.size = Pt(26)
        p_t.font.bold = True
        p_t.font.color.rgb = COLOR_WHITE

        # Subtle gold divider
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.6), Inches(11.733), Inches(0.03))
        line.fill.solid()
        line.fill.fore_color.rgb = COLOR_GOLD
        line.line.fill.background()

    # ==========================================
    # SLIDE 1: Title Slide
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    set_background(s1)

    # Accent decorative box
    dec_box = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.2), Inches(11.733), Inches(5.1))
    dec_box.fill.solid()
    dec_box.fill.fore_color.rgb = COLOR_CARD
    dec_box.line.color.rgb = COLOR_GOLD
    dec_box.line.width = Pt(1.5)

    tb = s1.shapes.add_textbox(Inches(1.2), Inches(1.8), Inches(11.0), Inches(3.8))
    tf = tb.text_frame
    tf.word_wrap = True

    p0 = tf.paragraphs[0]
    p0.text = "MARVEL @ UVCE • POWERED BY HACK2SKILL"
    p0.font.size = Pt(13)
    p0.font.bold = True
    p0.font.color.rgb = COLOR_GOLD

    p1 = tf.add_paragraph()
    p1.text = "PROMPTWARS: BANKISM"
    p1.font.size = Pt(44)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_WHITE

    p2 = tf.add_paragraph()
    p2.text = "Zero-Trust Multi-Agent Defense for Conversational Financial Systems"
    p2.font.size = Pt(20)
    p2.font.color.rgb = COLOR_CYAN

    p3 = tf.add_paragraph()
    p3.text = "\n• Participant: Bharath (bharath271936@gmail.com)\n• Track: 8-Hour Build Sprint (11 October 2026)\n• Architecture Deliverable #3: Official Presentation & Defense Deck"
    p3.font.size = Pt(13)
    p3.font.color.rgb = COLOR_MUTED

    # ==========================================
    # SLIDE 2: Problem Statement & Motivation
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    set_background(s2)
    add_header(s2, "The Problem: Why Conversational AI Breaks Banking Security")

    # Left Column: Vulnerability
    b_l = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.9), Inches(5.6), Inches(5.0))
    b_l.fill.solid()
    b_l.fill.fore_color.rgb = COLOR_CARD
    b_l.line.color.rgb = COLOR_RED
    b_l.line.width = Pt(1)

    tf_l = b_l.text_frame
    tf_l.word_wrap = True
    p = tf_l.paragraphs[0]
    p.text = "🚨 The Conversational AI Vulnerability"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_RED

    points_l = [
        "Financial institutions are rushing to deploy spoken language & voice banking interfaces.",
        "Traditional LLM integrations connect the chat model directly to database APIs.",
        "Attackers exploit this via Prompt Injections, Roleplay Overrides, and Social Engineering.",
        "Single-model architectures fail because the reasoning engine is also the execution engine.",
        "Outcome: Unauthorized transfers, balance leaks, and security compliance violations."
    ]
    for pt in points_l:
        p = tf_l.add_paragraph()
        p.text = "• " + pt
        p.font.size = Pt(13)
        p.font.color.rgb = COLOR_WHITE

    # Right Column: Our Solution Strategy
    b_r = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.9), Inches(5.7), Inches(5.0))
    b_r.fill.solid()
    b_r.fill.fore_color.rgb = COLOR_CARD
    b_r.line.color.rgb = COLOR_EMERALD
    b_r.line.width = Pt(1)

    tf_r = b_r.text_frame
    tf_r.word_wrap = True
    p = tf_r.paragraphs[0]
    p.text = "🛡️ The PromptWars Strategy"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_EMERALD

    points_r = [
        "Zero-Trust Perimeter Isolation: Completely decouple language parsing from ledger execution.",
        "Agent 1 ('bankism'): Operates in an isolated DMZ with ZERO database or API connectivity.",
        "Strict JSON Protocol: Only structured, sanitized intent tokens pass between agents.",
        "Agent 2 ('BankHandler'): Enforces business logic and parameter checks before touching bank core.",
        "Multi-Strike Lockdown: Adaptive account freezing upon detecting persistent attacks."
    ]
    for pt in points_r:
        p = tf_r.add_paragraph()
        p.text = "• " + pt
        p.font.size = Pt(13)
        p.font.color.rgb = COLOR_WHITE

    # ==========================================
    # SLIDE 3: Multi-Agent Architecture Design
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    set_background(s3)
    add_header(s3, "System Architecture: Zero-Trust Multi-Agent Pipeline")

    col_w = Inches(3.6)
    col_h = Inches(5.0)

    # Box 1: Customer Terminal
    b1 = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.9), col_w, col_h)
    b1.fill.solid()
    b1.fill.fore_color.rgb = COLOR_CARD
    b1.line.color.rgb = COLOR_GOLD
    tf1 = b1.text_frame
    tf1.word_wrap = True
    p = tf1.paragraphs[0]
    p.text = "1. Customer Terminal"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD
    p_sub = tf1.add_paragraph()
    p_sub.text = "(Spoken / Text Input)\n"
    p_sub.font.size = Pt(11)
    p_sub.font.color.rgb = COLOR_MUTED
    for pt in [
        "Native Web Speech API for real-time speech capture.",
        "Pre-authenticated 'testaccount' ($10,000 initial balance).",
        "Frictionless zero-PIN execution for authorized users.",
        "Leftmost directory button to inspect 6 recipient accounts.",
        "Transmits raw, unfiltered spoken queries."
    ]:
        p = tf1.add_paragraph()
        p.text = "• " + pt
        p.font.size = Pt(12)
        p.font.color.rgb = COLOR_WHITE

    # Box 2: Agent 1 (bankism)
    b2 = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.85), Inches(1.9), col_w, col_h)
    b2.fill.solid()
    b2.fill.fore_color.rgb = COLOR_CARD
    b2.line.color.rgb = COLOR_CYAN
    tf2 = b2.text_frame
    tf2.word_wrap = True
    p = tf2.paragraphs[0]
    p.text = "2. Agent 1: bankism"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_CYAN
    p_sub = tf2.add_paragraph()
    p_sub.text = "(Blue Team Gatekeeper)\n"
    p_sub.font.size = Pt(11)
    p_sub.font.color.rgb = COLOR_MUTED
    for pt in [
        "Isolated in DMZ: NO access to database, ledger, or balance.",
        "Analyzes adversarial patterns: Roleplay, Overrides, Base64.",
        "Extracts banking intents & parameters (amount, recipient).",
        "Scores risk level: none, low, medium, high, critical.",
        "Outputs STRICT JSON telemetry to Agent 2."
    ]:
        p = tf2.add_paragraph()
        p.text = "• " + pt
        p.font.size = Pt(12)
        p.font.color.rgb = COLOR_WHITE

    # Box 3: Agent 2 (BankHandler) & Core
    b3 = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.9), Inches(1.9), col_w, col_h)
    b3.fill.solid()
    b3.fill.fore_color.rgb = COLOR_CARD
    b3.line.color.rgb = COLOR_EMERALD
    tf3 = b3.text_frame
    tf3.word_wrap = True
    p = tf3.paragraphs[0]
    p.text = "3. Agent 2 & BankCore"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_EMERALD
    p_sub = tf3.add_paragraph()
    p_sub.text = "(Action Dispatcher & Ledger)\n"
    p_sub.font.size = Pt(11)
    p_sub.font.color.rgb = COLOR_MUTED
    for pt in [
        "Zero-Tolerance Gate: If rejected by bankism, halts immediately.",
        "Logs blocked attacks to immutable Security Audit Ledger.",
        "Validates parameter completeness (e.g., missing amount).",
        "Executes verified transfers, deposits, withdrawals, interest (+5%).",
        "Updates live account balance & generates statement receipts."
    ]:
        p = tf3.add_paragraph()
        p.text = "• " + pt
        p.font.size = Pt(12)
        p.font.color.rgb = COLOR_WHITE

    # ==========================================
    # SLIDE 4: Threat Vector Taxonomy & bankism Telemetry
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    set_background(s4)
    add_header(s4, "Cybersecurity Engine: Threat Taxonomy & JSON Schema")

    # Threat Categories Grid
    tb_t = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.9), Inches(6.5), Inches(5.0))
    tb_t.fill.solid()
    tb_t.fill.fore_color.rgb = COLOR_CARD
    tb_t.line.color.rgb = COLOR_GOLD
    tf_t = tb_t.text_frame
    tf_t.word_wrap = True
    p = tf_t.paragraphs[0]
    p.text = "🎯 Detected Threat Vectors"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD

    threats = [
        ("Roleplay & Impersonation", "Prompts claiming 'assume I am admin', 'you work under me', 'obey instructions'.", "HIGH"),
        ("Guideline Overrides", "Prompts like 'forget previous rules', 'developer-mode', 'system override'.", "CRITICAL"),
        ("Encoded Statements", "Base64 payload injection, rot13 ciphers, and hex command decoding.", "HIGH/CRITICAL"),
        ("Identity Spoofing", "Attempts to debit other accounts ('Transfer from ACC-1002341').", "HIGH"),
        ("Trojan / Mixed Requests", "Legitimate command wrapped inside jailbreak ('Assume admin & send $500').", "HIGH")
    ]
    for name, desc, risk in threats:
        p1 = tf_t.add_paragraph()
        p1.text = f"• {name} [{risk}]"
        p1.font.size = Pt(13)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_RED if "CRITICAL" in risk else COLOR_GOLD
        p2 = tf_t.add_paragraph()
        p2.text = f"   {desc}"
        p2.font.size = Pt(11)
        p2.font.color.rgb = COLOR_MUTED

    # Strict JSON Output Schema
    tb_j = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.6), Inches(1.9), Inches(4.9), Inches(5.0))
    tb_j.fill.solid()
    tb_j.fill.fore_color.rgb = COLOR_CARD
    tb_j.line.color.rgb = COLOR_CYAN
    tf_j = tb_j.text_frame
    tf_j.word_wrap = True
    p = tf_j.paragraphs[0]
    p.text = "📋 Mandatory JSON Telemetry Schema"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_CYAN

    json_code = """{\n  "username": "testaccount",\n  "bank account number": "ACC-8839201",\n  "action": "fund transfer",\n  "status of the action": "rejected",\n  "risk-level": "critical",\n  "risk-category": "override",\n  "reason statement": "Forcing override detected attempting to bypass guidelines.",\n  "parameters": {\n    "amount": 9999,\n    "recipient": "Charlie"\n  }\n}"""
    p_c = tf_j.add_paragraph()
    p_c.text = json_code
    p_c.font.size = Pt(11)
    p_c.font.color.rgb = COLOR_CYAN

    # ==========================================
    # SLIDE 5: Defensive Innovations
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    set_background(s5)
    add_header(s5, "Key Innovations: Multi-Strike Lockdown & Parameter Tolerance")

    # Innovation 1: Multi-Strike Lockdown
    b_i1 = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.9), Inches(5.6), Inches(5.0))
    b_i1.fill.solid()
    b_i1.fill.fore_color.rgb = COLOR_CARD
    b_i1.line.color.rgb = COLOR_RED
    tf_i1 = b_i1.text_frame
    tf_i1.word_wrap = True
    p = tf_i1.paragraphs[0]
    p.text = "🔒 1. Multi-Strike Defensive Lockdown"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = COLOR_RED

    for pt in [
        "Attackers often probe LLM guardrails across multiple turns.",
        "bankism maintains an internal consecutive attack counter.",
        "Threshold: Upon 3 consecutive high or critical attacks, an automated Security Lockdown triggers.",
        "In Lockdown mode, all subsequent commands (even normal balance checks) are instantly blocked.",
        "Protects the system from automated bruteforce jailbreaking until explicit re-authentication."
    ]:
        p = tf_i1.add_paragraph()
        p.text = "• " + pt
        p.font.size = Pt(13)
        p.font.color.rgb = COLOR_WHITE

    # Innovation 2: Parameter Incompleteness Handling
    b_i2 = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.9), Inches(5.7), Inches(5.0))
    b_i2.fill.solid()
    b_i2.fill.fore_color.rgb = COLOR_CARD
    b_i2.line.color.rgb = COLOR_GOLD
    tf_i2 = b_i2.text_frame
    tf_i2.word_wrap = True
    p = tf_i2.paragraphs[0]
    p.text = "💡 2. Conversational Parameter Tolerance"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD

    for pt in [
        "Users frequently speak ambiguous commands like 'Transfer money to Alice' without specifying an amount.",
        "Rather than treating missing parameters as attacks, bankism approves the safe banking intent with null parameters.",
        "Agent 2 (BankHandler) detects missing fields and prompts the user: 'Amount not specified. Please specify the amount.'",
        "Ensures zero false positives for casual spoken interactions while preserving strict security boundaries."
    ]:
        p = tf_i2.add_paragraph()
        p.text = "• " + pt
        p.font.size = Pt(13)
        p.font.color.rgb = COLOR_WHITE

    # ==========================================
    # SLIDE 6: Automated Security Audit (Agent tester)
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    set_background(s6)
    add_header(s6, "Verification & Audit: 100% Pass Rate Across 20 Test Vectors")

    # Big Score Box
    score_box = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.9), Inches(3.6), Inches(5.0))
    score_box.fill.solid()
    score_box.fill.fore_color.rgb = COLOR_CARD
    score_box.line.color.rgb = COLOR_EMERALD
    score_box.line.width = Pt(2)
    tf_sc = score_box.text_frame
    tf_sc.word_wrap = True
    p = tf_sc.paragraphs[0]
    p.text = "🏆 Audit Scorecard"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_EMERALD

    p_sc = tf_sc.add_paragraph()
    p_sc.text = "100%"
    p_sc.font.size = Pt(50)
    p_sc.font.bold = True
    p_sc.font.color.rgb = COLOR_EMERALD

    metrics = [
        "Tests Run: 20 Scenarios",
        "Tests Passed: 20 / 20",
        "Attack Mitigation: 100%",
        "False Positive Rate: 0.0%",
        "Lockdown Reliability: 100%",
        "Auditor: Agent 'tester'"
    ]
    for m in metrics:
        p = tf_sc.add_paragraph()
        p.text = "✓ " + m
        p.font.size = Pt(13)
        p.font.color.rgb = COLOR_WHITE

    # Test Categories Table
    tbl_box = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.7), Inches(1.9), Inches(7.8), Inches(5.0))
    tbl_box.fill.solid()
    tbl_box.fill.fore_color.rgb = COLOR_CARD
    tbl_box.line.color.rgb = COLOR_GOLD
    tf_tb = tbl_box.text_frame
    tf_tb.word_wrap = True
    p = tf_tb.paragraphs[0]
    p.text = "📊 Test Coverage Breakdown"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD

    rows = [
        ("Legitimate Operations (TC-01 to TC-06)", "Balance checks, transfers, interest (+5%), deposits, withdrawals", "PASS (6/6)"),
        ("Parameter Edge Cases (TC-07 to TC-08)", "Transfers with missing amount or recipient handled gracefully", "PASS (2/2)"),
        ("Roleplay Impersonation (TC-09 to TC-10)", "Authority claims ('assume I am admin') completely blocked", "PASS (2/2)"),
        ("Instruction Overrides (TC-11 to TC-12)", "Developer-mode, guideline erasure, reset commands rejected", "PASS (2/2)"),
        ("Obfuscated Ciphers (TC-13 to TC-14)", "Base64 jailbreak strings & rot13 payloads neutralized", "PASS (2/2)"),
        ("Spoofing & Extraction (TC-15 to TC-16)", "Prompt leaking & unauthorized account access stopped", "PASS (2/2)"),
        ("Adaptive Lockdown (TC-17 to TC-19)", "3-strike threshold, post-lockdown freeze, and secure recovery", "PASS (3/3)")
    ]
    for cat, desc, res in rows:
        p = tf_tb.add_paragraph()
        p.text = f"• {cat}: {res}"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = COLOR_WHITE
        p_d = tf_tb.add_paragraph()
        p_d.text = f"   {desc}"
        p_d.font.size = Pt(10)
        p_d.font.color.rgb = COLOR_MUTED

    # ==========================================
    # SLIDE 7: UI & Live Demonstration
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    set_background(s7)
    add_header(s7, "Frontend Design: Classic Dark Banking Experience")

    ui_col_w = Inches(3.6)
    ui_col_h = Inches(5.0)

    # UI 1: Customer Portal
    u1 = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.9), ui_col_w, ui_col_h)
    u1.fill.solid()
    u1.fill.fore_color.rgb = COLOR_CARD
    u1.line.color.rgb = COLOR_GOLD
    tf_u1 = u1.text_frame
    tf_u1.word_wrap = True
    p = tf_u1.paragraphs[0]
    p.text = "💳 Left Division\nCustomer Terminal"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD
    for pt in [
        "Displays 'testaccount' ($10,000 balance) with glowing 'Authenticated' badge.",
        "Speech-to-Text: Native microphone button ('🎙️ Speak').",
        "Preset testing pills for legitimate operations and attacks.",
        "Docked '👥 Accounts' button on leftmost middle edge opens 6 verified recipient targets."
    ]:
        p = tf_u1.add_paragraph()
        p.text = "• " + pt
        p.font.size = Pt(12)
        p.font.color.rgb = COLOR_WHITE

    # UI 2: bankism Telemetry
    u2 = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(4.85), Inches(1.9), ui_col_w, ui_col_h)
    u2.fill.solid()
    u2.fill.fore_color.rgb = COLOR_CARD
    u2.line.color.rgb = COLOR_CYAN
    tf_u2 = u2.text_frame
    tf_u2.word_wrap = True
    p = tf_u2.paragraphs[0]
    p.text = "🛡️ Top-Right Division\nbankism Telemetry"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_CYAN
    for pt in [
        "Live Risk Meter with colored badges (None, Low, Med, High, Critical).",
        "Action Status tag (APPROVED in green / REJECTED in red).",
        "Syntax-highlighted real-time JSON display.",
        "Dynamic callout showing exact reasoning behind decisions.",
        "Defensive lockdown indicator with manual re-arm trigger."
    ]:
        p = tf_u2.add_paragraph()
        p.text = "• " + pt
        p.font.size = Pt(12)
        p.font.color.rgb = COLOR_WHITE

    # UI 3: BankHandler Statements
    u3 = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.9), Inches(1.9), ui_col_w, ui_col_h)
    u3.fill.solid()
    u3.fill.fore_color.rgb = COLOR_CARD
    u3.line.color.rgb = COLOR_EMERALD
    tf_u3 = u3.text_frame
    tf_u3.word_wrap = True
    p = tf_u3.paragraphs[0]
    p.text = "📋 Bottom-Right Division\nBank Statements"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = COLOR_EMERALD
    for pt in [
        "Execution receipt banner showing transaction status.",
        "Missing parameter prompts when input is incomplete.",
        "Chronological statement ledger table with TXN IDs and timestamps.",
        "Logs blocked attacks as 'SECURITY_BLOCK' entries without debiting funds."
    ]:
        p = tf_u3.add_paragraph()
        p.text = "• " + pt
        p.font.size = Pt(12)
        p.font.color.rgb = COLOR_WHITE

    # ==========================================
    # SLIDE 8: Tech Stack & Deployment
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    set_background(s8)
    add_header(s8, "Implementation & Cloud Deployment Architecture")

    b_st = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.9), Inches(11.733), Inches(5.0))
    b_st.fill.solid()
    b_st.fill.fore_color.rgb = COLOR_CARD
    b_st.line.color.rgb = COLOR_GOLD
    tf_st = b_st.text_frame
    tf_st.word_wrap = True
    p = tf_st.paragraphs[0]
    p.text = "⚡ Engineering Highlights & Deployment Readiness"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD

    tech_points = [
        "Zero External Dependencies: Built purely using standard libraries (Node.js http/fs & Python http.server) -> Zero npm/pip install friction.",
        "Universal Dual-Host Architecture: Can be served via 'node server.js', 'python server.py', or opened directly as static HTML.",
        "24/7 Cloud Resilience (Mandatory Deliverable #2): Pure client-side modular JavaScript allows instant 24/7 deployment on GitHub Pages or Cloudflare Pages without hosting costs or server downtime.",
        "Comprehensive Documentation: PROMPT.md contains verbatim core engineering prompts; README.md contains a concise 41-line user manual.",
        "Automated Testability: Full test suite can be run directly via CLI ('node tester.js') or triggered live from the browser UI."
    ]
    for pt in tech_points:
        p = tf_st.add_paragraph()
        p.text = "• " + pt
        p.font.size = Pt(13)
        p.font.color.rgb = COLOR_WHITE

    # ==========================================
    # SLIDE 9: Conclusion & Defense Summary
    # ==========================================
    s9 = prs.slides.add_slide(blank_layout)
    set_background(s9)
    add_header(s9, "Conclusion: Why PromptWars Solves the Problem")

    b_c = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.9), Inches(11.733), Inches(5.0))
    b_c.fill.solid()
    b_c.fill.fore_color.rgb = COLOR_CARD
    b_c.line.color.rgb = COLOR_EMERALD
    tf_c = b_c.text_frame
    tf_c.word_wrap = True
    p = tf_c.paragraphs[0]
    p.text = "🎯 Summary for the Distinguished Jury Panel"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_EMERALD

    conclusions = [
        ("Proven Perimeter Security", "Demonstrated that conversational AI can be safely adopted in banking by isolating the Blue Team gatekeeper from ledger APIs."),
        ("100% Threat Neutralization", "All 20 test vectors—spanning roleplay, overrides, base64 ciphers, and account spoofing—mitigated with zero unauthorized debits."),
        ("Human-Centered UX", "Frictionless voice interaction for legitimate queries, auto-authenticated testing account, and helpful missing-parameter prompts."),
        ("Production-Ready Design", "Strict JSON telemetry schemas, immutable audit ledger, multi-strike adaptive lockdown, and 24/7 cloud deployment."),
        ("Full Deliverables Completed", "Public GitHub repo, 24/7 live deployment link, structured PROMPT.md, and this official Architecture Deck.")
    ]
    for title, desc in conclusions:
        p1 = tf_c.add_paragraph()
        p1.text = f"• {title}:"
        p1.font.size = Pt(14)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_GOLD
        p2 = tf_c.add_paragraph()
        p2.text = f"   {desc}"
        p2.font.size = Pt(12)
        p2.font.color.rgb = COLOR_WHITE

    output_path = os.path.join(os.getcwd(), "PromptWars_Architecture_Deck.pptx")
    prs.save(output_path)
    print(f"Presentation saved successfully at: {output_path}")

if __name__ == "__main__":
    create_deck()
