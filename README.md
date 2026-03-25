# AI Resume Analyzer

A modern web application that analyzes resumes and matches them with job descriptions using AI/NLP technology.

## Features

- **Resume Upload**: Drag-and-drop or click to upload PDF resumes
- **Text Extraction**: Automatically extracts text from PDF files
- **Skill Extraction**: Identifies technical and soft skills using NLP
- **Job Matching**: Calculates match score between resume and job description
- **Missing Skills Detection**: Shows skills required but not found in the resume
- **Improvement Suggestions**: Provides actionable tips to improve resume
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Real-time Analysis**: Fast analysis using optimized algorithms

## Tech Stack

### Frontend
- **React.js 18** - UI library
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Icons** - Icon library

### Backend
- **FastAPI** - Web framework
- **Python 3.8+** - Programming language
- **spaCy** - NLP and skill extraction
- **pdfplumber** - PDF text extraction
- **scikit-learn** - Similarity scoring
- **Pydantic** - Data validation

## Project Structure

```
AI-resume Analyzer/
├── frontend/                 # React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── ResumeUploader.js
│   │   │   ├── SkillsList.js
│   │   │   ├── MatchScoreCard.js
│   │   │   ├── SuggestionsCard.js
│   │   │   ├── ResumeSummary.js
│   │   │   ├── LoadingSpinner.js
│   │   │   └── ErrorAlert.js
│   │   ├── pages/          # Page components
│   │   │   ├── HomePage.js
│   │   │   └── ResultsPage.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env
│
├── backend/                 # FastAPI application
│   ├── main.py             # Main API application
│   ├── resume_parser.py    # PDF parsing & text extraction
│   ├── skill_extractor.py  # NLP-based skill extraction
│   ├── similarity.py       # Resume-job matching & scoring
│   ├── requirements.txt    # Python dependencies
│   └── .gitignore
│
└── README.md               # This file
```

## Installation

### Prerequisites
- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   # On Windows
   python -m venv venv
   venv\Scripts\activate

   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Download spaCy language model:**
   ```bash
   python -m spacy download en_core_web_sm
   ```

5. **Run the backend server:**
   ```bash
   python main.py
   ```

   The API will be available at `http://localhost:8000`

   API Documentation will be at `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file (if not already created):**
   ```bash
   echo REACT_APP_API_URL=http://localhost:8000 > .env
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

   The application will open at `http://localhost:3000`

## API Endpoints

### GET /
Root endpoint with available endpoints information.

**Response:**
```json
{
  "message": "AI Resume Analyzer API",
  "version": "1.0.0",
  "endpoints": {
    "upload_resume": "/upload-resume",
    "analyze_resume": "/analyze-resume",
    "example_job": "/example-job"
  }
}
```

### POST /upload-resume
Upload a PDF resume file and extract text.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `file` (PDF)

**Response:**
```json
{
  "success": true,
  "resume_text": "extracted resume text...",
  "character_count": 2500
}
```

### POST /analyze-resume
Analyze resume against job description.

**Request Parameters:**
- `resume_text` (string): Extracted resume text
- `job_description` (string): Job description text

**Response:**
```json
{
  "resume_summary": "Brief summary of the resume...",
  "resume_skills": {
    "technical": ["Python", "JavaScript", ...],
    "soft": ["Communication", "Leadership", ...],
    "all": [...]
  },
  "job_skills": {
    "technical": [...],
    "soft": [...],
    "all": [...]
  },
  "match_score": 75.5,
  "match_feedback": "Good match! You meet many of the requirements.",
  "missing_skills": ["Docker", "Kubernetes", ...],
  "suggestions": [
    "You have decent experience, but some key skills are missing.",
    "Consider adding experience with: Docker, Kubernetes, Jenkins",
    ...
  ],
  "match_breakdown": {
    "matched_skills": ["Python", "JavaScript", ...],
    "missing_skills": ["Docker", "Kubernetes", ...],
    "extra_skills": ["Ruby", "Go", ...],
    "match_percentage": 75.5,
    "total_job_skills": 15,
    "matched_count": 11
  }
}
```

### GET /example-job
Get an example job description.

**Response:**
```json
{
  "description": "Senior Full Stack Developer job description..."
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy"
}
```

## Usage

1. **Open the application** at `http://localhost:3000`

2. **Upload your resume**:
   - Drag and drop a PDF file or click to select one
   - The system will extract text from the PDF

3. **Add job description**:
   - Paste the job description in the textarea
   - Or click "Load Example" to use a sample job description

4. **Analyze**:
   - Click "Analyze My Resume" button
   - Wait for the analysis to complete (takes a few seconds)

5. **View Results**:
   - See your match score with visual progress bar
   - View extracted skills and missing skills
   - Read suggestions to improve your resume
   - Print or download the results

## Features Explained

### Match Score
A percentage (0-100) showing how well your resume matches the job description:
- **80-100%**: Excellent match - You have most required skills
- **60-79%**: Good match - You meet many requirements
- **40-59%**: Fair match - Consider learning missing skills
- **0-39%**: Low match - Significant skill development needed

### Skill Categories
- **Technical Skills**: Programming languages, frameworks, tools (Python, React, AWS, etc.)
- **Soft Skills**: Communication, leadership, teamwork, etc.

### Missing Skills
Skills listed in the job description but not detected in your resume. These should be your priority for learning.

### Suggestions
Actionable recommendations to improve your resume alignment with the job description, including:
- Keyword optimization
- Skill additions
- Achievement quantification
- Action verb usage

## Example Resume

To test the application, use a resume that includes:

```
JOHN DOE
Senior Software Engineer

CONTACT
john.doe@email.com | (555) 123-4567 | linkedin.com/in/johndoe

SUMMARY
Experienced software engineer with 8+ years of expertise in full-stack web development.
Proficient in Python, JavaScript, and cloud technologies. Strong track record of building
scalable applications and leading development teams.

TECHNICAL SKILLS
Languages: Python, JavaScript, TypeScript, Java, SQL
Web Development: React, Vue.js, Node.js, Django, FastAPI
Databases: PostgreSQL, MongoDB, Redis, Firebase
Cloud & DevOps: AWS, Google Cloud, Docker, Kubernetes
Tools & Platforms: Git, REST APIs, GraphQL, JIRA, CI/CD

EXPERIENCE

Senior Software Engineer - Tech Company Inc. (2020-Present)
- Developed and maintained full-stack applications using React and Node.js
- Designed and implemented microservices architecture using Docker and Kubernetes
- Led team of 5 developers on distributed systems project
- Increased application performance by 40% through optimization

Software Engineer - StartUp XYZ (2017-2020)
- Built responsive web applications using React and Tailwind CSS
- Implemented backend services using Python and FastAPI
- Set up CI/CD pipelines using Jenkins and GitLab
- Managed PostgreSQL and MongoDB databases

EDUCATION
B.S. Computer Science - University Name (2017)

CERTIFICATIONS
- AWS Solutions Architect Associate
- Google Cloud Professional Data Engineer
```

## Troubleshooting

### Backend Issues

**spaCy model not found:**
```bash
python -m spacy download en_core_web_sm
```

**Port 8000 already in use:**
```bash
# Change port in main.py or kill the process using port 8000
```

**PDF upload fails:**
- Ensure the PDF file is not corrupted
- Check file permissions
- Verify pdfplumber is installed correctly

### Frontend Issues

**React development server won't start:**
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

**API connection errors:**
- Ensure backend is running on port 8000
- Check `.env` file has correct API_URL
- Check CORS is enabled in FastAPI

**Blank page or 404:**
- Clear browser cache
- Check console for JavaScript errors
- Verify React router paths

## Performance Optimization

- **Large PDFs**: The system handles PDFs up to 10MB
- **Concurrent Requests**: FastAPI uses async operations for better performance
- **Caching**: Consider adding Redis for caching frequently matched jobs
- **Rate Limiting**: Add rate limiting to prevent abuse

## Security Considerations

- **File Validation**: Only PDF files are accepted
- **Text Limits**: Large texts are truncated to prevent memory issues
- **CORS**: Configure CORS origins for production
- **Input Sanitization**: Validate all user inputs
- **File Storage**: Uploaded files are stored in temporary locations and deleted after processing

## Deployment

### Backend Deployment (using Gunicorn)

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 main:app
```

### Frontend Deployment (using Vercel, Netlify, or AWS S3)

```bash
npm run build
# Deploy the build/ folder
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add NewFeature'`)
4. Push to the branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

## Future Enhancements

- [ ] User authentication and saved analyses
- [ ] Resume templates and formatting suggestions
- [ ] Multiple file format support (DOCX, PPTX)
- [ ] AI-powered resume rewriting suggestions
- [ ] Job application tracking
- [ ] Email notifications for job matches
- [ ] Mobile app version
- [ ] Integration with job boards
- [ ] Batch processing for multiple resumes
- [ ] Skills trending and market insights

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: support@airesumeresume-analyzer.com

## Acknowledgments

- spaCy for NLP capabilities
- FastAPI for the excellent web framework
- React and Tailwind CSS communities
- Open source contributors

---

**Happy analyzing! Good luck with your job applications!** 🚀
