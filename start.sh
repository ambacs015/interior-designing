#!/bin/bash
echo "==================================================="
echo "Starting Interior Designing Application"
echo "==================================================="

# Start backend in background
echo "Starting Backend Server..."
cd backend
source venv/bin/activate
python app.py &
BACKEND_PID=$!
cd ..

# Start frontend in background
echo "Starting Frontend Server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "Both servers have been launched in the background!"
echo "Press Ctrl+C to stop both servers."
echo "==================================================="

# Wait for any termination signal to kill both servers
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
