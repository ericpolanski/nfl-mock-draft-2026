export default function Resume() {
  return (
    <div className="page-wrapper">
      <header className="page-header">
        <h1 className="page-title">Resume</h1>
      </header>

      <div className="resume-actions">
        <a
          href="/eric_polanski_resume_january_2026.pdf"
          download="Eric_Polanski_Resume_January_2026.pdf"
          className="btn btn--primary"
        >
          Download Resume
        </a>
      </div>

      <dl className="resume-dl">
        {/* Education */}
        <section className="resume-section">
          <h2 className="resume-section-title">Education</h2>
          <div className="resume-entry">
            <div className="resume-entry__left">
              <p className="resume-entry__title">B.S. Computer Science, AI Concentration</p>
              <p className="resume-entry__subtitle">Northwestern University, Evanston, IL</p>
            </div>
            <time className="resume-entry__dates">Dec 2025</time>
          </div>
          <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-muted)', paddingTop: 'var(--space-3)' }}>
            GPA: 3.8 / 4.0 &nbsp;&middot;&nbsp; Dean&apos;s List (All Semesters) &nbsp;&middot;&nbsp; Relevant Coursework: Machine Learning, Deep Learning, NLP, Algorithms, Database Systems, Operating Systems
          </p>
        </section>

        {/* Experience */}
        <section className="resume-section">
          <h2 className="resume-section-title">Experience</h2>

          <div className="resume-entry">
            <div className="resume-entry__left">
              <p className="resume-entry__title">AI Engineer Intern</p>
              <p className="resume-entry__subtitle">AbbVie &mdash; North Chicago, IL</p>
            </div>
            <time className="resume-entry__dates">Summer 2024</time>
          </div>
          <ul className="resume-bullets">
            <li>Designed and deployed a RAG pipeline to automate retrieval of clinical trial documentation, reducing analyst lookup time by 40%.</li>
            <li>Built a multi-agent orchestration system using LangGraph to route and resolve medical information queries with 95% accuracy.</li>
            <li>Collaborated with cross-functional teams to integrate AI features into existing enterprise workflows.</li>
          </ul>

          <div className="resume-entry" style={{ marginTop: 'var(--space-5)' }}>
            <div className="resume-entry__left">
              <p className="resume-entry__title">AI Engineer Intern</p>
              <p className="resume-entry__subtitle">AbbVie &mdash; North Chicago, IL</p>
            </div>
            <time className="resume-entry__dates">Summer 2023</time>
          </div>
          <ul className="resume-bullets">
            <li>Developed an internal chatbot using OpenAI&apos;s API and retrieval-augmented generation to answer employee HR and IT questions.</li>
            <li>Optimized embedding pipelines and chunking strategies, improving answer relevance scores by 28%.</li>
            <li>Built monitoring dashboards to track model performance, latency, and token usage in production.</li>
          </ul>
        </section>

        {/* Skills */}
        <section className="resume-section">
          <h2 className="resume-section-title">Skills</h2>
          <div className="resume-skills">
            {[
              'Python', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
              'FastAPI', 'Flask', 'PostgreSQL', 'MongoDB', 'Redis', 'Prisma',
              'LangChain', 'LangGraph', 'OpenAI API', 'Pinecone', 'FAISS',
              'scikit-learn', 'PyTorch', 'Hugging Face', 'Git', 'Docker',
              'AWS', 'Vercel', 'Firebase', 'Figma',
            ].map((skill) => (
              <span key={skill} className="skill-tag">{skill}</span>
            ))}
          </div>
        </section>
      </dl>

      {/* PDF Preview */}
      <div className="resume-iframe-wrap">
        <iframe
          src="/eric_polanski_resume_january_2026.pdf"
          title="Resume PDF preview"
          aria-label="Resume PDF preview"
        />
      </div>
    </div>
  )
}
