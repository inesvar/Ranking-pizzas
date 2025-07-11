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
python app.py


