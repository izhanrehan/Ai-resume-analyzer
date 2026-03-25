# AI Resume Analyzer - Quick Reference Guide

## Quick Start (5 minutes)

### Terminal 1: Start Backend
```bash
cd backend
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

python -m spacy download en_core_web_sm  # First time only
python main.py
```

### Terminal 2: Start Frontend
```bash
cd frontend
npm install  # First time only
npm start
```

### Access Application
- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs

---

## Project Architecture

```
┌─────────────────────────────────────────┐
│         React Frontend (Port 3000)      │
│  - Home Page (Upload & Job Description)│
│  - Results Page (Analysis Display)      │
└──────────────────┬──────────────────────┘
                   │ (Axios HTTP Calls)
                   ▼
┌─────────────────────────────────────────┐
│       FastAPI Backend (Port 8000)       │
│  - /upload-resume (PDF Upload)          │
│  - /analyze-resume (Analysis)           │
│  - /example-job (Sample Job)            │
└──────────────────┬──────────────────────┘
                   │ (NLP Processing)
                   ▼
┌─────────────────────────────────────────┐
│        NLP & Skill Extraction           │
│  - Resume Text Extraction (pdfplumber)  │
│  - Skill Detection (spaCy)              │
│  - Similarity Score (scikit-learn)      │
└─────────────────────────────────────────┘
```

---

## Key Components

### Frontend Components
| File | Purpose |
|------|---------|
| `HomePage.js` | Upload resume & paste job description |
| `ResultsPage.js` | Display analysis results |
| `ResumeUploader.js` | Drag-drop file upload |
| `MatchScoreCard.js` | Circular progress with score |
| `SkillsList.js` | Skill badges display |
| `SuggestionsCard.js` | Improvement tips |

### Backend Modules
| File | Purpose |
|------|---------|
| `main.py` | FastAPI application & routes |
| `resume_parser.py` | PDF text extraction |
| `skill_extractor.py` | Skill & keyword extraction |
| `similarity.py` | Match scoring & suggestions |

---

## Common Commands

### Backend
```bash
# Activate virtual environment
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Install packages
pip install -r requirements.txt

# Download NLP model
python -m spacy download en_core_web_sm

# Run server
python main.py

# Run server with reload
uvicorn main:app --reload

# Deactivate environment
deactivate
```

### Frontend
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Update packages
npm update
```

---

## API Endpoints Reference

### GET /
**Returns:** Available endpoints

### POST /upload-resume
**Body:** FormData with `file` (PDF)
**Returns:** `{ success: true, resume_text: "..." }`

### POST /analyze-resume
**Params:** 
- `resume_text` - extracted text
- `job_description` - job post text
**Returns:** Analysis results with match score, skills, suggestions

### GET /example-job
**Returns:** Sample job description

### GET /health
**Returns:** `{ status: "healthy" }`

---

## Component Data Flow

```
HomePage
  │
  ├─→ ResumeUploader
  │    └─→ POST /upload-resume
  │
  ├─→ Textarea input
  │    └─→ Optional: GET /example-job
  │
  └─→ Analyze button
       └─→ POST /analyze-resume
            └─→ ResultsPage
                 ├─→ MatchScoreCard
                 ├─→ ResumeSummary
                 ├─→ SkillsList (multiple)
                 └─→ SuggestionsCard
```

---

## File Upload Process

```
1. User selects PDF
   ↓
2. Browser validates file type
   ↓
3. ResumeUploader sends to /upload-resume
   ↓
4. Backend: pdfplumber extracts text
   ↓
5. Frontend receives text + metadata
   ↓
6. Text stored in component state
```

---

## Analysis Process

```
1. User clicks "Analyze"
   ↓
2. Resume text + Job description sent to /analyze-resume
   ↓
3. Backend: skill_extractor finds all skills
   ↓
4. Backend: similarity.py calculates match score
   ↓
5. Backend: find_missing_skills() identifies gaps
   ↓
6. Backend: generate_suggestions() creates tips
   ↓
7. Response sent back to frontend
   ↓
8. ResultsPage renders all data
```

---

## Styling Reference

### Color Scheme
- **Primary Blue**: #3B82F6
- **Success Green**: #10B981
- **Danger Red**: #EF4444
- **Warning Yellow**: #F59E0B

### CSS Classes
- `.btn-primary` - Blue action button
- `.btn-secondary` - Green secondary button
- `.card` - White card container
- `.skill-badge` - Skill tag styling
- `.progress-bar` - Match score bar

---

## Troubleshooting Quick Tips

| Issue | Solution |
|-------|----------|
| API Port 8000 taken | `taskkill /PID <pid> /F` (Windows) |
| React Port 3000 taken | `lsof -i :3000 \| kill -9 <pid>` (Mac) |
| spaCy model not found | `python -m spacy download en_core_web_sm` |
| PDF parsing fails | Ensure PDF is not corrupted |
| CORS errors | Check backend CORS settings |
| Blank page | Clear cache: `Ctrl+Shift+Delete` |
| npm install fails | `npm cache clean --force` then retry |

---

## Performance Metrics

- **PDF Upload**: < 5 seconds (for 2MB file)
- **Text Extraction**: < 2 seconds
- **Skill Extraction**: < 3 seconds
- **Similarity Scoring**: < 2 seconds
- **Total Analysis**: 5-10 seconds
- **Supported PDF Size**: up to 10MB

---

## Feature Highlights

✅ Drag & Drop Upload
✅ Real-time Analysis
✅ 40+ Skill Recognition
✅ Missing Skills Detection
✅ Actionable Suggestions
✅ Match Score Visualization
✅ Responsive Design
✅ No User Registration Required
✅ Instant Results
✅ Print-friendly Output

---

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE11: ❌ Not supported

---

## Security Notes

- Files uploaded to temp directory and deleted after processing
- No files stored permanently
- No user data collected or saved
- All processing done locally on backend
- CORS enabled for localhost during development

---

## Development Tips

### Adding New Skills to Detection
1. Edit `/backend/skill_extractor.py`
2. Add skill to `TECHNICAL_SKILLS` or `SOFT_SKILLS` set
3. Restart backend server
4. Test with resume containing new skill

### Customizing Match Score Logic
1. Edit `/backend/similarity.py`
2. Modify `calculate_similarity_score()` function
3. Adjust weight factors as needed
4. Test with sample resumes

### Styling Changes
1. Edit `/frontend/src/index.css` for custom CSS
2. Or modify Tailwind in `/frontend/src/components/*.js`
3. Changes appear on save (with hot reload)

---

## Deployment Checklist

- [ ] Set `DEBUG=False` in backend .env
- [ ] Update CORS_ORIGINS to production domain
- [ ] Use `npm run build` for frontend
- [ ] Set up environment variables
- [ ] Test all endpoints
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure monitoring
- [ ] Test file uploads
- [ ] Verify API response times

---

## Links & Resources

- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **React Docs**: https://react.dev/
- **spaCy Docs**: https://spacy.io/
- **Tailwind CSS**: https://tailwindcss.com/
- **Axios Docs**: https://axios-http.com/

---

## Next Steps

1. ✅ Complete setup above
2. 📚 Read full README.md
3. 🧪 Test with example resume
4. 🎨 Customize colors/styles
5. 🚀 Deploy to production
6. 📊 Add analytics tracking
7. 🔐 Implement authentication
8. 💾 Add database storage

---

**Last Updated:** 2024
**Version:** 1.0.0
