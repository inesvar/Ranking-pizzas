#!/bin/bash
if [ -d "venv" ]; then
    echo "Virtual environment was already created"
    source venv/bin/activate
else
    echo "Creating virtual environment..."
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
fi
firefox 127.0.0.1:5000 --kiosk&
python app.py


