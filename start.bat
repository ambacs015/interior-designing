@echo off
echo ===================================================
echo Starting Interior Designing Application
echo ===================================================

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && call venv\Scripts\activate && python app.py"

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo Both servers have been launched in separate windows!
echo If there are any errors, the windows will stay open so you can read them.
echo ===================================================
pause
