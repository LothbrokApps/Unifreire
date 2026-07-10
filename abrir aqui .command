#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"
lsof -ti:8000 | xargs kill -9 2>/dev/null
echo "Iniciando Servidor UNIFREIREWEBv0.1..."
python3 server.py
