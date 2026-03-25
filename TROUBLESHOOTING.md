# Troubleshooting Guide

## Installation Issues

### Issue 1: Python Version Mismatch
**Error:** `This Python interpreter version (x.x) is not compatible`

**Solutions:**
1. Check Python version: `python --version`
2. Ensure you have Python 3.8 or higher
3. Download from: https://www.python.org/
4. On macOS/Linux, use `python3` instead of `python`

```bash
# Check version
python --version

# If below 3.8, download and install newer version
# Then remove old Python from PATH
```

---

### Issue 2: Virtual Environment Not Activating
**Error:** `'venv' is not recognized as an internal command`

**Windows Solution:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux Solution:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

**Verify activation:** Look for `(venv)` at the start of terminal prompt

---

### Issue 3: pip Install Fails
**Error:** `ERROR: Could not find a version that satisfies the requirement`

**Solutions:**
```bash
# Upgrade pip first
python -m pip install --upgrade pip

# Clear cache and retry
pip cache purge
pip install -r requirements.txt

# Install packages individually
pip install fastapi==0.104.1
pip install uvicorn==0.24.0
# ... etc
```

---

### Issue 4: spaCy Model Download Fails
**Error:** `OSError: [E050] Can't find model 'en_core_web_sm'`

**Solutions:**
```bash
# Ensure internet connection
# Try downloading again
python -m spacy download en_core_web_sm

# If still fails, download manually
python -m spacy download en_core_web_sm --user

# Check installation
python -c "import spacy; print(spacy.load('en_core_web_sm'))"
```

---

### Issue 5: Node.js Not Installed
**Error:** `npm: command not found`

**Solutions:**
1. Download Node.js from: https://nodejs.org/
2. Install LTS version (recommended)
3. Restart your terminal
4. Verify: `node --version` and `npm --version`

---

### Issue 6: npm install Takes Too Long
**Error:** Installation hangs or is very slow

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Try installing with legacy peer deps
npm install --legacy-peer-deps

# Use different registry
npm install --registry https://registry.npmjs.org/

# Install packages one by one
npm install react react-dom axios react-router-dom
```

---

## Backend Issues

### Issue 7: Port 8000 Already in Use
**Error:** `Address already in use: ('0.0.0.0', 8000)`

**Windows Solution:**
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual number)
taskkill /PID 12345 /F

# Or run on different port
# Edit main.py: uvicorn.run(..., port=8001)
```

**macOS/Linux Solution:**
```bash
# Find process
lsof -i :8000

# Kill process
kill -9 <PID>

# Or run on different port
python main.py --port 8001
```

---

### Issue 8: ModuleNotFoundError When Running Backend
**Error:** `ModuleNotFoundError: No module named 'fastapi'`

**Solutions:**
```bash
# Ensure you're in backend directory
cd backend

# Verify virtual environment is activated
# Should see (venv) in terminal prompt

# Install dependencies
pip install -r requirements.txt

# Verify installation
python -c "import fastapi; print(fastapi.__version__)"
```

---

### Issue 9: PDF Upload Fails
**Error:** `Could not extract text from PDF`

**Solutions:**
1. **Check file is valid PDF:**
   ```bash
   file resume.pdf  # on Mac/Linux
   # Should show: PDF document, version 1.x
   ```

2. **PDF might be corrupted:**
   - Try re-saving PDF
   - Try different PDF
   - Verify file size < 10MB

3. **PDF might be image-based (scanned):**
   - Use OCR tool first
   - Or convert to text-based PDF

4. **Check permissions:**
   - Ensure file is readable
   - Try copying to desktop and uploading

---

### Issue 10: API Returns Empty Response
**Error:** Empty response from `/analyze-resume`

**Solutions:**
```python
# Verify resume_text is not empty
if not resume_text or len(resume_text) < 10:
    print("Resume text is too short")

# Verify job_description is provided
if not job_description:
    print("Job description is required")

# Check backend logs for errors
# Look for tracebacks in terminal
```

---

### Issue 11: CORS Error in Frontend
**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Backend Fix (main.py):**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Frontend Fix (.env):**
```
REACT_APP_API_URL=http://localhost:8000
```

---

### Issue 12: Backend Crashes with Memory Error
**Error:** `MemoryError` or `Segmentation fault`

**Solutions:**
```bash
# Process large PDF in chunks
# Edit resume_parser.py:
# Limit text to 500,000 characters

# Increase system memory limit
ulimit -v unlimited  # macOS/Linux

# Restart backend with more memory (Windows)
# Or reduce concurrent uploads
```

---

## Frontend Issues

### Issue 13: Port 3000 Already in Use
**Error:** `Could not listen on port 3000`

**Windows Solution:**
```bash
netstat -ano | findstr :3000
taskkill /PID 12345 /F
```

**macOS/Linux Solution:**
```bash
lsof -i :3000
kill -9 <PID>
```

**Or use different port:**
```bash
PORT=3001 npm start
```

---

### Issue 14: React Development Server Won't Start
**Error:** `Error: ENOENT: no such file or directory`

**Solutions:**
```bash
cd frontend

# Clear node_modules and package-lock
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Try again
npm start
```

---

### Issue 15: Blank Page or 404 Error
**Error:** White screen or "localhost:3000 refused to connect"

**Solutions:**
1. **Check if npm server is running:**
   ```bash
   # Should see: "Local: http://localhost:3000"
   ```

2. **Check if API is running:**
   ```bash
   # Visit http://localhost:8000 in browser
   # Should see JSON response
   ```

3. **Clear cache:**
   - Press F12 for DevTools
   - Right-click refresh button → "Empty cache and hard refresh"
   - Or: Ctrl+Shift+Delete (clear cache)

4. **Check console for errors:**
   - F12 → Console tab
   - Look for red errors
   - Note error message and fix

---

### Issue 16: API Connection Fails (frontend Can't Reach Backend)
**Error:** `Network Error` or `Cannot POST to http://localhost:8000`

**Checklist:**
- [ ] Backend is running: `python main.py`
- [ ] Frontend's .env has: `REACT_APP_API_URL=http://localhost:8000`
- [ ] URL is correct (check for typos)
- [ ] No firewall blocking port 8000
- [ ] Restart frontend after changing .env

**Debug:**
```bash
# Check backend is responding
curl http://localhost:8000/health

# Should return: {"status":"healthy"}
```

---

### Issue 17: File Upload Button Not Working
**Error:** Click upload button, nothing happens

**Solutions:**
1. **Check browser console (F12):**
   - Look for JavaScript errors
   - Note error message

2. **Verify PDF file:**
   - Ensure it's actual PDF (not renamed file)
   - Try with example resume

3. **Check file size:**
   - Should be < 10MB
   - Smaller files upload faster

4. **Try different browser:**
   - Firefox, Chrome, Safari
   - Some browsers have file upload restrictions

---

### Issue 18: Results Page Shows No Data
**Error:** Blank results page after analysis

**Causes:**
1. **Refreshed page accidentally:**
   - Results are stored in memory only
   - Go back to home and re-analyze

2. **API returned error:**
   - Check browser console (F12)
   - Look for error messages
   - Check backend logs

3. **Navigation issue:**
   - Don't manually navigate to `/results`
   - Always navigate through "Analyze" button

---

### Issue 19: Styling Looks Broken (No Colors/Layout)
**Error:** Page loads but looks ugly/unstyled

**Solutions:**
```bash
# Rebuild CSS (in frontend directory)
npm run build

# Or restart dev server
npm start

# Check if CSS file is loaded (F12 → Network tab)

# Force refresh browser
Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

---

### Issue 20: Browser Says "Cannot find module"
**Error:** Console shows webpack compilation errors

**Solutions:**
```bash
cd frontend

# Clear cache and rebuild
npm cache clean --force
npm install
npm start

# If still fails, check for typos in imports
# grep -r "from.*components" src/
# Verify all imported files exist
```

---

## Analysis Issues

### Issue 21: Match Score Always 0 or 100
**Error:** Score doesn't seem reasonable

**Solutions:**
1. **Verify inputs:**
   - Resume text should be 100+ characters
   - Job description should be 100+ characters

2. **Check for common issues:**
   - Empty resume or job text
   - Text encoding issues (try copying differently)
   - Special characters might not extract properly

3. **Debug:**
   ```python
   # Check extracted text
   print(len(resume_text))
   print(len(job_description))
   # Both should be > 100
   ```

---

### Issue 22: Skills Not Being Detected
**Error:** "Your Technical Skills" section is empty

**Causes:**
1. **Resume doesn't mention common skills:**
   - Make sure resume has actual skill names
   - E.g., "Python", "React", "AWS"

2. **Skill names are too different:**
   - e.g., "Python programming" won't match "Python"
   - Use standard skill names

3. **Text extraction failed:**
   - Check if resume_text is populated
   - Verify PDF is text-based (not scanned image)

**Solution:**
- Add standard skill names to resume
- Or add new skills to `backend/skill_extractor.py`

---

### Issue 23: Too Many Missing Skills Listed
**Error:** Missing 50+ skills when expecting 5-10

**Causes:**
1. **Job description is too long:**
   - Very detailed job posts list many skills
   - This is normal

2. **Skills are spelled differently:**
   - E.g., "node" vs "Node.js"
   - Affects matching

**Solution:**
- Review missing skills list
- Focus on top missing skills
- Ignore skill variations

---

### Issue 24: Suggestions are Generic/Not Helpful
**Error:** Suggestions don't match resume

**Causes:**
1. **Suggestions are template-based:**
   - System provides general tips
   - Not personalized to resume details

2. **Text extraction issue:**
   - Resume text might be incomplete
   - Affects suggestions quality

**Solution:**
- Consider suggestions as general guidance
- Manually review resume for improvements
- Add specific skills you're missing

---

## Performance Issues

### Issue 25: Analysis Takes Too Long (> 30 seconds)
**Error:** Spinning forever on analysis

**Possible Causes:**
1. **Large PDF file:**
   - System processing 5MB+ files
   - Normal to take 15-30 seconds

2. **Slow internet/computer:**
   - Older machines take longer
   - Network latency affects uploads

3. **Backend hung:**
   - Restart backend server
   - Kill and restart process

**Solutions:**
```bash
# Increase timeout in frontend
# Edit HomePage.js, increase timeout to 60000ms

# Use smaller PDF
# Split large resume into multiple pages

# Restart backend
# Kill current process and run again
```

---

### Issue 26: Browser/Computer Running Slow
**Error:** Page is laggy when interacting

**Solutions:**
```bash
# Clear browser cache
Ctrl+Shift+Delete

# Close other browser tabs
# Reduces memory usage

# Restart browser
# Clears memory leaks

# Check system resources
# Task Manager (Windows) or Activity Monitor (Mac)
# Ensure you have 2GB+ RAM available
```

---

## Data/Results Issues

### Issue 27: Results Different Each Time
**Error:** Same resume + job gives different scores

**Causes:**
1. **Normal variation:**
   - Similarity scoring uses random components
   - Small variations are expected

2. **Different job descriptions:**
   - Make sure using exact same text
   - Copy-paste can lose formatting

3. **Slight text differences:**
   - Whitespace, line breaks affect scoring
   - Clean text before analyzing

---

### Issue 28: Can't Print Results
**Error:** Print button doesn't work or looks bad

**Solutions:**
```bash
# Use browser print
Ctrl+P (Windows) or Cmd+P (Mac)

# Choose "Save as PDF"
# Or "Print to PDF"

# For better formatting:
# 1. Single-click print results section
# 2. Use Print button in UI
# 3. Adjust margin settings

# Print may be blocked by:
# - Pop-up blocker
# - Browser settings
# - Security policies
```

---

## Database Issues (Future)

### Issue 29: Database Connection Failed
**Error:** `Connection to database refused`

**Solutions:**
```bash
# Check if database is running
# For PostgreSQL:
# Windows: services.msc → PostgreSQL
# Mac: brew services list

# Check database URL in .env
# Should be: postgresql://user:pass@localhost/dbname

# Verify credentials
# username, password, database name

# Create database if needed
# createdb resume_analyzer
```

---

## Network Issues

### Issue 30: Firewall Blocking Ports
**Error:** Can't connect to localhost:8000 or localhost:3000

**Windows Firewall:**
1. Control Panel → Windows Defender Firewall
2. Allow an app through firewall
3. Add Python and Node.js
4. Restart application

**macOS:**
```bash
# Check if firewall is on
defaults read /Library/Preferences/com.apple.alf globalstate

# If blocked, disable temporarily (not recommended for production)
sudo defaults write /Library/Preferences/com.apple.alf globalstate -int 0
```

---

## Getting Help

### Steps to Take:

1. **Check the error message carefully:**
   - Note exact error text
   - Screenshot if possible

2. **Check relevant console:**
   - Backend: Terminal/Command Prompt
   - Frontend: Browser Console (F12)
   - System: Task Manager / Activity Monitor

3. **Search documentation:**
   - README.md
   - SETUP.md
   - API_DOCUMENTATION.md

4. **Try basic troubleshooting:**
   - Restart backend
   - Restart frontend
   - Clear cache
   - Check ports are free

5. **If still stuck:**
   - Check code for typos
   - Verify all dependencies installed
   - Try with example resume
   - Check all .env variables

### Information to Provide When Asking for Help:

- Operating System (Windows/Mac/Linux)
- Python version: `python --version`
- Node version: `node --version`
- Exact error message (copy/paste)
- Screenshot of error
- Steps to reproduce
- What you were trying to do

---

## Common Solutions Quick Reference

| Problem | Quick Fix |
|---------|-----------|
| Port in use | `taskkill /PID <id> /F` |
| Virtual env won't activate | Use full path or check syntax |
| Module not found | `pip install -r requirements.txt` |
| npm install failing | `npm cache clean --force` |
| Blank page | Clear cache (`Ctrl+Shift+Delete`) |
| API not responding | Check if backend is running |
| CORS error | Update `.env` with correct API_URL |
| PDF won't upload | Ensure file is PDF < 10MB |
| Analysis hangs | Restart backend or increase timeout |
| Results blank | Don't refresh page after analysis |

---

## Still Having Issues?

1. **Verify everything is installed:**
   ```bash
   python --version  # Should be 3.8+
   node --version    # Should be 14+
   npm --version     # Should be 6+
   ```

2. **Check all processes are running:**
   - Backend on port 8000
   - Frontend on port 3000

3. **Test basic connectivity:**
   ```bash
   curl http://localhost:8000/health
   # Should return: {"status":"healthy"}
   ```

4. **Review logs carefully:**
   - Terminal for backend errors
   - Browser console (F12) for frontend errors

5. **Try with example resume:**
   - Verify system works with provided example
   - Then test with your own

6. **Last resort:**
   - Delete all and reinstall from scratch
   - Follow SETUP.md step-by-step
   - Don't skip any steps

---

**Remember:** Most issues are related to:
1. Installation (missing dependencies)
2. Ports (already in use)
3. Files (wrong format/size)
4. Configuration (.env issues)

Address these first! 🔧

---

**Last Updated:** 2024
**Version:** 1.0.0
