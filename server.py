import http.server
import socketserver
import webbrowser
import threading
import time

PORT = 8000
Handler = http.server.SimpleHTTPRequestHandler

def start_server():
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Servidor sirviendo en http://localhost:{PORT}")
        httpd.serve_forever()

if __name__ == "__main__":
    t = threading.Thread(target=start_server)
    t.daemon = True
    t.start()
    
    # Open browser automatically
    time.sleep(1)
    webbrowser.open(f'http://localhost:{PORT}/')
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Servidor detenido.")
