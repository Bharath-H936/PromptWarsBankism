#!/usr/bin/env python3
"""
server.py - Python HTTP Server for PromptWars Multi-Agent Banking System
Runs out-of-the-box with Python standard library (zero external dependencies).
"""

import http.server
import socketserver
import os
import sys

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

if __name__ == '__main__':
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"=========================================================")
        print(f"PromptWars Banking System Server Running!")
        print(f"Working Link: http://localhost:{PORT}")
        print(f"Serving directory: {DIRECTORY}")
        print(f"Press Ctrl+C to stop.")
        print(f"=========================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
            sys.exit(0)
