# API Documentation

## Base URL
```
http://localhost:8000
```

## Interactive API Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## Authentication
Currently, no authentication is required. For production deployment, add API key authentication.

---

## Endpoints

### 1. GET /
Get API information and available endpoints.

**Description:** Returns information about the API and links to available endpoints.

**HTTP Method:** `GET`

**Request:**
```bash
curl http://localhost:8000/
```

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

---

### 2. POST /upload-resume
Upload and extract text from a PDF resume.

**Description:** Accepts a PDF file, extracts text content using pdfplumber, and returns the extracted text.

**HTTP Method:** `POST`

**Request Headers:**
```
Content-Type: multipart/form-data
```

**Request Body:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| file | File | Yes | PDF file (max 10MB) |

**Example with cURL:**
```bash
curl -X POST \
  -F "file=@resume.pdf" \
  http://localhost:8000/upload-resume
```

**Example with Python:**
```python
import requests

with open('resume.pdf', 'rb') as f:
    files = {'file': f}
    response = requests.post('http://localhost:8000/upload-resume', files=files)
    data = response.json()
    print(data['resume_text'])
```

**Example with JavaScript/Axios:**
```javascript
const formData = new FormData();
formData.append('file', fileInputElement.files[0]);

const response = await axios.post('http://localhost:8000/upload-resume', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

console.log(response.data.resume_text);
```

**Success Response (200):**
```json
{
  "success": true,
  "resume_text": "JOHN DOE\n\nSenior Software Engineer...",
  "character_count": 2850
}
```

**Error Responses:**

400 Bad Request:
```json
{
  "error": true,
  "detail": "Only PDF files are allowed",
  "status_code": 400
}
```

500 Internal Server Error:
```json
{
  "error": true,
  "detail": "Error processing file: ...",
  "status_code": 500
}
```

**Status Codes:**
- 200: Success
- 400: Invalid file type or upload
- 500: Server error processing PDF

---

### 3. POST /analyze-resume
Analyze resume and compare with job description.

**Description:** Analyzes extracted resume text, compares with job description, and returns match score, skills, missing skills, and suggestions.

**HTTP Method:** `POST`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| resume_text | string | Yes | Extracted resume text (from /upload-resume) |
| job_description | string | Yes | Job description text |

**Example with cURL:**
```bash
curl -X POST \
  "http://localhost:8000/analyze-resume?resume_text=YOUR_RESUME_TEXT&job_description=YOUR_JOB_DESC"
```

**Example with Python:**
```python
import requests

params = {
    'resume_text': extracted_resume_text,
    'job_description': job_description_text
}

response = requests.post(
    'http://localhost:8000/analyze-resume',
    params=params
)

analysis = response.json()
print(f"Match Score: {analysis['match_score']}%")
print(f"Missing Skills: {analysis['missing_skills']}")
```

**Example with JavaScript:**
```javascript
const response = await axios.post(
  'http://localhost:8000/analyze-resume',
  {},
  {
    params: {
      resume_text: extractedText,
      job_description: jobDescription
    }
  }
);

const analysis = response.data;
console.log(`Match Score: ${analysis.match_score}%`);
```

**Success Response (200):**
```json
{
  "resume_summary": "Senior software engineer with 8+ years of expertise in full-stack web development...",
  "resume_skills": {
    "technical": ["Python", "JavaScript", "React", "Node.js", "PostgreSQL", ...],
    "soft": ["Leadership", "Communication", ...],
    "all": [...]
  },
  "job_skills": {
    "technical": ["Python", "JavaScript", "React", "Docker", ...],
    "soft": ["Communication", "Team work", ...],
    "all": [...]
  },
  "match_score": 78.5,
  "match_feedback": "Good match! You meet many of the requirements.",
  "missing_skills": [
    "Docker",
    "Kubernetes",
    "Cloud Architecture",
    "Jenkins"
  ],
  "suggestions": [
    "You have decent experience, but some key skills are missing.",
    "Consider adding experience with: Docker, Kubernetes, Jenkins",
    "Quantify your achievements with metrics and numbers",
    "Use action verbs to describe your accomplishments",
    "Tailor your resume to match the job description keywords",
    "Include relevant certifications and training",
    "Highlight projects that align with job requirements"
  ],
  "match_breakdown": {
    "matched_skills": ["python", "javascript", "react", "postgresql", ...],
    "missing_skills": ["docker", "kubernetes", "jenkins"],
    "extra_skills": ["ruby", "php"],
    "match_percentage": 78.5,
    "total_job_skills": 15,
    "matched_count": 12
  }
}
```

**Error Responses:**

400 Bad Request:
```json
{
  "error": true,
  "detail": "Resume text and job description are required",
  "status_code": 400
}
```

500 Internal Server Error:
```json
{
  "error": true,
  "detail": "Error analyzing resume: ...",
  "status_code": 500
}
```

**Status Codes:**
- 200: Success
- 400: Missing parameters
- 500: Analysis error

**Response Fields Explained:**
- `resume_summary`: First 100 words of resume
- `match_score`: 0-100 percentage match
- `match_feedback`: Human-readable feedback based on score
- `missing_skills`: Top 10 skills in job but not in resume
- `suggestions`: Array of improvement tips
- `match_breakdown`: Detailed matching statistics

---

### 4. GET /example-job
Get an example job description for testing.

**Description:** Returns a sample job description that can be used for testing the analyzer.

**HTTP Method:** `GET`

**Request:**
```bash
curl http://localhost:8000/example-job
```

**Response:**
```json
{
  "description": "Senior Full Stack Developer\n\nWe are looking for an experienced Full Stack Developer...Requirements:\n- 5+ years of experience with Python and JavaScript\n- Strong expertise in React.js and Node.js\n..."
}
```

**Status Codes:**
- 200: Success

---

### 5. GET /health
Health check endpoint.

**Description:** Simple health check to verify the API is running.

**HTTP Method:** `GET`

**Request:**
```bash
curl http://localhost:8000/health
```

**Response:**
```json
{
  "status": "healthy"
}
```

**Status Codes:**
- 200: API is healthy

---

## Data Models

### UploadResponse
```json
{
  "success": boolean,
  "resume_text": "string",
  "character_count": number
}
```

### AnalysisResult
```json
{
  "resume_summary": "string",
  "resume_skills": {
    "technical": ["string"],
    "soft": ["string"],
    "all": ["string"]
  },
  "job_skills": {
    "technical": ["string"],
    "soft": ["string"],
    "all": ["string"]
  },
  "match_score": number,
  "match_feedback": "string",
  "missing_skills": ["string"],
  "suggestions": ["string"],
  "match_breakdown": {
    "matched_skills": ["string"],
    "missing_skills": ["string"],
    "extra_skills": ["string"],
    "match_percentage": number,
    "total_job_skills": number,
    "matched_count": number
  }
}
```

### ErrorResponse
```json
{
  "error": boolean,
  "detail": "string",
  "status_code": number
}
```

---

## Request/Response Examples

### Complete Workflow Example

**Step 1: Upload Resume**
```python
import requests

# Upload resume
with open('john_resume.pdf', 'rb') as f:
    files = {'file': f}
    upload_response = requests.post(
        'http://localhost:8000/upload-resume',
        files=files
    )

resume_text = upload_response.json()['resume_text']
print(f"Extracted {len(resume_text)} characters from resume")
```

**Step 2: Get Job Description** (Optional)
```python
# Get example job
job_response = requests.get('http://localhost:8000/example-job')
job_description = job_response.json()['description']
```

**Step 3: Analyze**
```python
# Analyze resume
analysis_response = requests.post(
    'http://localhost:8000/analyze-resume',
    params={
        'resume_text': resume_text,
        'job_description': job_description
    }
)

analysis = analysis_response.json()

# Print results
print(f"\nMatch Score: {analysis['match_score']}%")
print(f"Feedback: {analysis['match_feedback']}")
print(f"\nMissing Skills:")
for skill in analysis['missing_skills']:
    print(f"  - {skill}")
```

---

## Common Use Cases

### Use Case 1: Analyze Single Resume
```javascript
async function analyzeSingleResume(pdfFile, jobDescription) {
  // Upload resume
  const formData = new FormData();
  formData.append('file', pdfFile);
  
  const uploadRes = await axios.post(
    'http://localhost:8000/upload-resume',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  
  // Analyze
  const analysisRes = await axios.post(
    'http://localhost:8000/analyze-resume',
    {},
    {
      params: {
        resume_text: uploadRes.data.resume_text,
        job_description: jobDescription
      }
    }
  );
  
  return analysisRes.data;
}
```

### Use Case 2: Batch Analyze Multiple Resumes
```python
def batch_analyze(resume_files, job_description):
    results = []
    for resume_file in resume_files:
        # Upload
        with open(resume_file, 'rb') as f:
            upload_resp = requests.post(
                'http://localhost:8000/upload-resume',
                files={'file': f}
            )
        
        # Analyze
        analysis_resp = requests.post(
            'http://localhost:8000/analyze-resume',
            params={
                'resume_text': upload_resp.json()['resume_text'],
                'job_description': job_description
            }
        )
        
        results.append({
            'file': resume_file,
            'score': analysis_resp.json()['match_score']
        })
    
    return sorted(results, key=lambda x: x['score'], reverse=True)
```

---

## Rate Limiting
- Currently no rate limiting
- For production, implement rate limiting (e.g., 100 requests/hour per IP)

---

## CORS Configuration

Default CORS settings allow all origins. For production, update in `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Specific origin
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)
```

---

## Error Handling Best Practices

### Always check response status:
```python
response = requests.post(...)
if response.status_code == 200:
    data = response.json()
else:
    error = response.json()
    print(f"Error: {error['detail']}")
```

### Handle file upload errors:
```python
try:
    response = requests.post(
        'http://localhost:8000/upload-resume',
        files={'file': pdf_file},
        timeout=30
    )
    response.raise_for_status()
except requests.exceptions.RequestException as e:
    print(f"Upload failed: {e}")
```

---

## Performance Considerations

- **Average Response Times:**
  - POST /upload-resume: 2-5 seconds
  - POST /analyze-resume: 3-8 seconds
  - Total: 5-13 seconds

- **File Size Limits:**
  - MAX: 10MB
  - Recommended: < 5MB

- **Timeout Settings:**
  - Recommended client timeout: 30-60 seconds
  - PDF processing timeout: 15 seconds

---

## Versioning

Current API Version: **1.0.0**

Future versions may have breaking changes. Check version in `GET /` response.

---

## Support & Issues

For API issues:
1. Check error messages in response body
2. Verify file format (PDF only)
3. Check file size (< 10MB)
4. Review backend logs
5. Check console for CORS errors

---

## Testing the API

### Using Postman
1. Import the base URL: `http://localhost:8000`
2. Create requests for each endpoint
3. Set headers and body parameters
4. Click "Send"

### Using Python Requests
```python
import requests

# POST request with file
files = {'file': open('resume.pdf', 'rb')}
response = requests.post('http://localhost:8000/upload-resume', files=files)
```

### Using JavaScript Fetch
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:8000/upload-resume', {
  method: 'POST',
  body: formData
});

const data = await response.json();
```

---

**Last Updated:** 2024
**API Version:** 1.0.0
