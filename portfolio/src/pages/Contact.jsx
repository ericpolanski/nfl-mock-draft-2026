import { useState } from 'react'

export default function Contact() {
  const [status, setStatus] = useState(null) // 'success' | 'error' | null
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    const form = e.target
    const data = new FormData(form)

    try {
      const res = await fetch('https://formspree.io/f/xpwzgkvd', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })

      if (res.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <h1 className="page-title">Contact</h1>
        <p className="page-subtitle">
          Have a project in mind or want to collaborate? I would love to hear from you.
        </p>
      </header>

      <section aria-label="Contact information and form">
        <div className="contact-layout">
          {/* Info */}
          <div className="contact-info">
            <h2>Get in touch</h2>
            <p>
              Whether it is a freelance project, a full-time opportunity, or just a conversation
              about AI and software, feel free to reach out. I typically respond within one business day.
            </p>

            <div className="contact-detail">
              <p className="contact-detail__label">Email</p>
              <p className="contact-detail__value">
                <a href="mailto:ericchrispolanski@gmail.com">ericchrispolanski@gmail.com</a>
              </p>
            </div>

            <div className="contact-detail">
              <p className="contact-detail__label">GitHub</p>
              <p className="contact-detail__value">
                <a href="https://github.com/ericpolanski" target="_blank" rel="noopener noreferrer">
                  github.com/ericpolanski
                </a>
              </p>
            </div>

            <div className="contact-detail">
              <p className="contact-detail__label">LinkedIn</p>
              <p className="contact-detail__value">
                <a href="https://linkedin.com/in/eric-polanski" target="_blank" rel="noopener noreferrer">
                  linkedin.com/in/eric-polanski
                </a>
              </p>
            </div>
          </div>

          {/* Form */}
          <div>
            {status === 'success' ? (
              <div className="form-success" role="alert">
                Thanks for reaching out. I will get back to you soon.
              </div>
            ) : (
              <form
                className="contact-form"
                onSubmit={handleSubmit}
                noValidate
              >
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="Your name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    placeholder="Tell me about your project or how I can help..."
                  />
                </div>

                {status === 'error' && (
                  <p className="form-error" role="alert">
                    Something went wrong. Please try again or email me directly.
                  </p>
                )}

                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={loading}
                  style={{ alignSelf: 'flex-start' }}
                >
                  {loading ? 'Sending...' : 'Send message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
