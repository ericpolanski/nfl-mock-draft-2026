export default function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div className="project-card__image-wrap">
        <img
          src={project.image}
          alt={`${project.title} app interface`}
          className="project-card__image"
          loading="lazy"
        />
      </div>
      <div className="project-card__body">
        <h3 className="project-card__title">{project.title}</h3>
        {project.badges && project.badges.length > 0 && (
          <div className="project-card__badges">
            {project.badges.map((badge) => (
              <span key={badge} className="project-card__badge">{badge}</span>
            ))}
          </div>
        )}
        <p className="project-card__desc">{project.desc}</p>
        <div className="project-card__links">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card__link"
            >
              GitHub
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card__link"
            >
              Live
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
