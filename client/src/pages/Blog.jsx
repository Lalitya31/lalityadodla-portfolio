import { useEffect, useState } from 'react'
import PageShell from './PageShell.jsx'
import './pages.css'
import { useDocumentTitle } from './useDocumentTitle.js'

function Blog() {
  useDocumentTitle('Blog - Balanced Engineering')

  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/blog')

        if (!response.ok) {
          throw new Error('Unable to load blog posts')
        }

        const data = await response.json()
        setPosts(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message || 'Unable to load blog posts')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <PageShell>
      <main className="projects-container">
        <section className="left-description">
          <h1>Blog</h1>
          <h2>Notes — Build Logs, Ideas, Learnings</h2>
          <p className="subheading">Short reflections from projects, research, and engineering practice.</p>
        </section>

        <section className="vault-container">
          <div className="terminal-panel" aria-label="Blog post list">
            <div className="terminal-navbar">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>
            <div className="panel-title">Blog Vault — recent posts</div>
            {isLoading ? <p className="cmd-meta">Loading blog posts...</p> : null}
            {error ? <p className="cmd-meta">{error}</p> : null}
            {!isLoading && !error && posts.length === 0 ? <p className="cmd-meta">No blog posts available</p> : null}
            {!isLoading && !error
              ? posts.map((post, index) => (
                  <article className="cmd-entry" key={post._id || post.title}>
                    <a className="cmd-link" href={`#post-${index + 1}`}>
                      <span className="prompt">&gt;</span>
                      <span className="project-name">{post.title}</span>
                    </a>
                    <p className="cmd-meta">{post.excerpt}</p>
                    {post.tags?.length ? <div className="cmd-meta">{post.tags.join(' • ')}</div> : null}
                    {post.createdAt ? (
                      <time className="cmd-meta" dateTime={post.createdAt}>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </time>
                    ) : null}
                  </article>
                ))
              : null}
          </div>
        </section>
      </main>
    </PageShell>
  )
}

export default Blog
