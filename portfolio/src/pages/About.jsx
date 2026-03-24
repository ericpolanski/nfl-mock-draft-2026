export default function About() {
  return (
    <div className="page-wrapper">
      <header className="page-header">
        <h1 className="page-title">About</h1>
        <p className="page-subtitle">
          AI Engineer based in Chicago, building production systems that bridge research and real-world impact.
        </p>
      </header>

      <section aria-label="Biography">
        <div className="about-grid">
          <div className="about-photo">
            <img src="/eric-images/eric-iceland.jpg" alt="Eric Polanski in Iceland" />
          </div>
          <div className="about-content">
            <h2>My Journey into AI</h2>
            <p>
              I came to AI through software engineering. While building web applications at AbbVie as a summer intern,
              I became fascinated by how carefully designed systems could anticipate user needs and reduce friction
              at scale. That curiosity led me to pursue a B.S. in Computer Science with a concentration in AI at
              Northwestern University.
            </p>
            <p>
              My academic work focused on applied machine learning: NLP pipelines, recommendation systems, and
              the practical challenges of deploying models in production environments where reliability and latency
              matter. I approach AI as a tool for solving real problems, not as an end in itself.
            </p>
            <p>
              Outside of technical work, I am a trail runner and outdoor photographer. The Pacific Northwest
              and Iceland have been recurring sources of inspiration for both perspective and patience.
            </p>

            <h2>Education</h2>
            <p>
              <strong>B.S. Computer Science, AI Concentration</strong><br />
              Northwestern University, Evanston, IL<br />
              Expected December 2025<br />
              GPA: 3.8 / 4.0
            </p>
            <p>
              Relevant coursework: Machine Learning, Deep Learning, Natural Language Processing,
              Algorithms &amp; Data Structures, Operating Systems, Database Systems.
            </p>

            <h2>Experience</h2>
            <div className="experience-list">
              <article className="experience-item">
                <div className="experience-item__left">
                  <p className="experience-item__role">AI Engineer Intern</p>
                  <p className="experience-item__company">AbbVie &mdash; Summer 2024</p>
                  <ul>
                    <li>Designed and deployed a RAG pipeline to automate retrieval of clinical trial documentation, reducing analyst lookup time by 40%.</li>
                    <li>Built a multi-agent orchestration system using LangGraph to route and resolve medical information queries with 95% accuracy.</li>
                    <li>Collaborated with cross-functional teams to integrate AI features into existing enterprise workflows.</li>
                  </ul>
                </div>
                <time className="experience-item__dates">Summer 2024</time>
              </article>
              <article className="experience-item">
                <div className="experience-item__left">
                  <p className="experience-item__role">AI Engineer Intern</p>
                  <p className="experience-item__company">AbbVie &mdash; Summer 2023</p>
                  <ul>
                    <li>Developed an internal chatbot using OpenAI&apos;s API and retrieval-augmented generation to answer employee HR and IT questions.</li>
                    <li>Optimized embedding pipelines and chunking strategies, improving answer relevance scores by 28%.</li>
                    <li>Built monitoring dashboards to track model performance, latency, and token usage in production.</li>
                  </ul>
                </div>
                <time className="experience-item__dates">Summer 2023</time>
              </article>
            </div>

            <h2>Outside of Work</h2>
            <p>
              When I am not writing code, I am probably on a trail somewhere. I have been running ultramarathons
              for the past three years, with distances ranging from 50K to 100 miles. I am also an avid landscape
              photographer and enjoy long exposure and astrophotography.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
