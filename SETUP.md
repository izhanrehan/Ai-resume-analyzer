# Quick Start Setup Guide

## System Requirements

- **Python**: 3.8 or higher
- **Node.js**: 14 or higher (includes npm)
- **RAM**: 2GB minimum (4GB recommended)
- **Disk Space**: 500MB

## One-Time Setup

### Step 1: Clone/Download the Project

```bash
cd D:\Ai-resume Analyzer
```

### Step 2: Backend Setup

#### 2.1 Create Virtual Environment

**Windows:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

#### 2.2 Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**This will install:**
- fastapi
- uvicorn
- pdfplumber (PDF parsing)
- spacy (NLP)
- scikit-learn (ML)
- pydantic (validation)
- And other dependencies

#### 2.3 Download spaCy Model

```bash
python -m spacy download en_core_web_sm
```

**What it does:** Downloads the English NLP model for skill extraction and keyword analysis.

#### 2.4 Test Backend

```bash
python main.py
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

**Visit in browser:**
- Main API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- API Interactive Docs: http://localhost:8000/redoc

### Step 3: Frontend Setup

#### 3.1 Open New Terminal/Command Prompt

Keep the backend running in its own terminal!

```bash
cd frontend
```

#### 3.2 Install Dependencies

```bash
npm install
```

**This will install:**
- react and react-dom
- react-router-dom (routing)
- axios (API calls)
- tailwindcss (styling)
- react-icons (icons)

**Duration:** 2-5 minutes depending on internet speed

#### 3.3 Start Frontend Development Server

```bash
npm start
```

**Expected output:**
```
Local:            http://localhost:3000
```

**Browser will open automatically** showing the home page.

### Step 4: Test the Application

1. **Go to home page:** http://localhost:3000

2. **Upload a resume:**
   - Click "Select PDF" or drag-drop a PDF
   - Use the example resume below or create your own

3. **Add job description:**
   - Click "Load Example" for a sample job description
   - Or paste your own

4. **Analyze:**
   - Click "Analyze My Resume"
   - Wait for results (usually 5-10 seconds)

5. **View Results:**
   - Match score
   - Skill breakdown
   - Missing skills
   - Improvement suggestions

## Daily Usage

### Starting the Application

**Terminal 1 (Backend):**
```bash
cd backend
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

python main.py
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

The application will open at http://localhost:3000

### Stopping the Application

- **Backend:** Press `CTRL+C` in the backend terminal
- **Frontend:** Press `CTRL+C` in the frontend terminal

## Troubleshooting

### Issue: "Python command not found"
**Solution:** 
- Ensure Python is installed: `python --version`
- On macOS/Linux, try `python3` instead of `python`

### Issue: "npm: command not found"
**Solution:**
- Install Node.js from https://nodejs.org/
- Restart terminal after installation

### Issue: "ModuleNotFoundError: No module named 'spacy'"
**Solution:**
```bash
cd backend
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

### Issue: "Port 8000 is already in use"
**Solution:**
```bash
# Find and kill process on port 8000
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :8000
kill -9 <PID>
```

### Issue: "Port 3000 is already in use"
**Solution:**
```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Issue: "Cannot read properties of undefined (reading 'state')"
**Solution:**
- Make sure you're uploading and analyzing from the home page
- Don't refresh the page after analysis

### Issue: PDF upload fails
**Solution:**
- Ensure PDF is not corrupted
- Try with the example resume first
- Check file size (should be < 10MB)

## Example Resume for Testing

See `EXAMPLE_RESUME.txt` in the project root for a complete example resume you can use for testing.

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000
```

### Backend (.env) - Optional
```
DATABASE_URL=postgresql://user:password@localhost/dbname
DEBUG=True
```

## API Testing

### Using Swagger UI
1. Keep backend running
2. Visit http://localhost:8000/docs
3. Try out endpoints directly in the browser

### Using curl (Windows PowerShell)
```powershell
# Health check
Invoke-WebRequest -Uri "http://localhost:8000/health"

# Get example job
Invoke-WebRequest -Uri "http://localhost:8000/example-job"
```

### Using curl (macOS/Linux bash)
```bash
# Health check
curl http://localhost:8000/health

# Get example job
curl http://localhost:8000/example-job
```

## File Structure After Setup

```
AI-resume Analyzer/
├── frontend/
│   ├── node_modules/     (created by npm install)
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── .env
│
├── backend/
│   ├── venv/            (created by python -m venv venv)
│   ├── main.py
│   ├── requirements.txt
│   └── .gitignore
│
└── README.md
```

## Performance Tips

1. **First Run:** Initial startup may take longer as spaCy model is loaded
2. **Large PDFs:** Processing large PDFs (5MB+) may take 10-15 seconds
3. **Clear Cache:** If having issues, clear browser cache (Ctrl+Shift+Delete)
4. **Check Resources:** Ensure you have at least 2GB free RAM

## Common Workflows

### Analyze a Resume
1. Start both servers
2. Upload PDF resume
3. Paste job description
4. Click Analyze
5. View results

### Compare Multiple Jobs
1. Analyze resume once
2. Go back to home
3. Load different job description
4. Re-analyze
5. Compare results

### Update Resume and Re-test
1. Update your actual resume file
2. Export to PDF
3. Upload new version
4. Re-analyze with same job
5. Check improvement

## Getting Help

- **API Issues:** Visit http://localhost:8000/docs for API documentation
- **Code Issues:** Check console (F12) and terminal for error messages
- **Installation Issues:** Review the README.md file
- **Python Issues:** Ensure virtual environment is activated (see `(venv)` in terminal)

## Next Steps

1. ✅ Complete setup above
2. 📄 Create or use example resume
3. 🔍 Upload and analyze
4. 💡 Read suggestions
5. ✏️ Update your actual resume
6. 🚀 Apply to jobs!

## Uninstalling/Cleanup

To remove the application:

```bash
# Remove backend virtual environment
rm -rf backend/venv

# Remove frontend dependencies
cd frontend
rm -rf node_modules package-lock.json

# Remove .env files
rm frontend/.env
```

## Additional Resources

- **FastAPI Documentation:** https://fastapi.tiangolo.com/
- **React Documentation:** https://react.dev/
- **spaCy Documentation:** https://spacy.io/
- **Tailwind CSS Documentation:** https://tailwindcss.com/

---

**Enjoy using AI Resume Analyzer! 🎉**
