import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../api.js'
import { useDocumentTitle } from './useDocumentTitle.js'

const emptyForm = {
  title: '',
  description: '',
  technologies: '',
  image: '',
  github: '',
  live: '',
  featured: false,
}

const emptyBlogForm = {
  title: '',
  excerpt: '',
  content: '',
  tags: '',
}

function AdminDashboard() {
  useDocumentTitle('Admin Dashboard - Portfolio CMS')

  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [blogPosts, setBlogPosts] = useState([])
  const [formData, setFormData] = useState(emptyForm)
  const [blogFormData, setBlogFormData] = useState(emptyBlogForm)
  const [editingId, setEditingId] = useState(null)
  const [editingBlogId, setEditingBlogId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBlogLoading, setIsBlogLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isBlogSaving, setIsBlogSaving] = useState(false)
  const [error, setError] = useState('')
  const [blogError, setBlogError] = useState('')

  const token = localStorage.getItem('adminToken')

  const fetchProjects = async () => {
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/projects`)

      if (!response.ok) {
        throw new Error('Unable to load projects')
      }

      const data = await response.json()
      setProjects(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Unable to load projects')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchBlogPosts = async () => {
    setBlogError('')
    setIsBlogLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/blog`)

      if (!response.ok) {
        throw new Error('Unable to load blog posts')
      }

      const data = await response.json()
      setBlogPosts(Array.isArray(data) ? data : [])
    } catch (err) {
      setBlogError(err.message || 'Unable to load blog posts')
    } finally {
      setIsBlogLoading(false)
    }
  }

  useEffect(() => {
    if (!token) {
      navigate('/admin/login')
      return
    }

    fetchProjects()
    fetchBlogPosts()
  }, [navigate, token])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const resetForm = () => {
    setFormData(emptyForm)
    setEditingId(null)
  }

  const resetBlogForm = () => {
    setBlogFormData(emptyBlogForm)
    setEditingBlogId(null)
  }

  const handleEdit = (project) => {
    setEditingId(project._id)
    setFormData({
      title: project.title || '',
      description: project.description || '',
      technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
      image: project.image || '',
      github: project.github || '',
      live: project.live || '',
      featured: Boolean(project.featured),
    })
  }

  const buildProjectPayload = () => ({
    ...formData,
    technologies: formData.technologies
      .split(',')
      .map((technology) => technology.trim())
      .filter(Boolean),
  })

  const handleBlogChange = (event) => {
    const { name, value } = event.target
    setBlogFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleBlogEdit = (post) => {
    setEditingBlogId(post._id)
    setBlogFormData({
      title: post.title || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
    })
  }

  const buildBlogPayload = () => ({
    ...blogFormData,
    tags: blogFormData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSaving(true)

    try {
      const url = editingId
        ? `${API_BASE_URL}/api/projects/${editingId}`
        : `${API_BASE_URL}/api/projects`

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(buildProjectPayload()),
      })

      if (response.status === 401) {
        localStorage.removeItem('adminToken')
        navigate('/admin/login')
        return
      }

      if (!response.ok) {
        throw new Error(editingId ? 'Unable to update project' : 'Unable to create project')
      }

      resetForm()
      await fetchProjects()
    } catch (err) {
      setError(err.message || 'Unable to save project')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (projectId) => {
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        localStorage.removeItem('adminToken')
        navigate('/admin/login')
        return
      }

      if (!response.ok) {
        throw new Error('Unable to delete project')
      }

      await fetchProjects()
    } catch (err) {
      setError(err.message || 'Unable to delete project')
    }
  }

  const handleBlogSubmit = async (event) => {
    event.preventDefault()
    setBlogError('')
    setIsBlogSaving(true)

    try {
      const url = editingBlogId
        ? `${API_BASE_URL}/api/blog/${editingBlogId}`
        : `${API_BASE_URL}/api/blog`

      const response = await fetch(url, {
        method: editingBlogId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(buildBlogPayload()),
      })

      if (response.status === 401) {
        localStorage.removeItem('adminToken')
        navigate('/admin/login')
        return
      }

      if (!response.ok) {
        throw new Error(editingBlogId ? 'Unable to update blog post' : 'Unable to create blog post')
      }

      resetBlogForm()
      await fetchBlogPosts()
    } catch (err) {
      setBlogError(err.message || 'Unable to save blog post')
    } finally {
      setIsBlogSaving(false)
    }
  }

  const handleBlogDelete = async (postId) => {
    setBlogError('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/blog/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 401) {
        localStorage.removeItem('adminToken')
        navigate('/admin/login')
        return
      }

      if (!response.ok) {
        throw new Error('Unable to delete blog post')
      }

      await fetchBlogPosts()
    } catch (err) {
      setBlogError(err.message || 'Unable to delete blog post')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Portfolio CMS</h1>
          <p style={styles.subtitle}>Manage engineering projects and blog posts</p>
        </div>
        <button style={styles.secondaryButton} type="button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {error ? <p style={styles.error}>{error}</p> : null}

      <section style={styles.grid}>
        <form onSubmit={handleSubmit} style={styles.panel}>
          <h2 style={styles.sectionTitle}>{editingId ? 'Edit Project' : 'Add Project'}</h2>

          <label style={styles.label}>
            Title
            <input style={styles.input} name="title" value={formData.title} onChange={handleChange} required />
          </label>

          <label style={styles.label}>
            Description
            <textarea style={styles.textarea} name="description" value={formData.description} onChange={handleChange} required />
          </label>

          <label style={styles.label}>
            Technologies
            <input style={styles.input} name="technologies" value={formData.technologies} onChange={handleChange} placeholder="React, Node, MongoDB" />
          </label>

          <label style={styles.label}>
            Image URL
            <input style={styles.input} name="image" value={formData.image} onChange={handleChange} />
          </label>

          <label style={styles.label}>
            GitHub URL
            <input style={styles.input} name="github" value={formData.github} onChange={handleChange} />
          </label>

          <label style={styles.label}>
            Live URL
            <input style={styles.input} name="live" value={formData.live} onChange={handleChange} />
          </label>

          <label style={styles.checkboxLabel}>
            <input name="featured" type="checkbox" checked={formData.featured} onChange={handleChange} />
            Featured
          </label>

          <div style={styles.actions}>
            <button style={styles.button} type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : editingId ? 'Update Project' : 'Create Project'}
            </button>
            {editingId ? (
              <button style={styles.secondaryButton} type="button" onClick={resetForm}>
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        <section style={styles.panel}>
          <h2 style={styles.sectionTitle}>Projects</h2>
          {isLoading ? <p style={styles.muted}>Loading projects...</p> : null}
          {!isLoading && projects.length === 0 ? <p style={styles.muted}>No projects available</p> : null}
          <div style={styles.projectList}>
            {projects.map((project) => (
              <article key={project._id} style={styles.projectItem}>
                <div>
                  <h3 style={styles.projectTitle}>{project.title}</h3>
                  <p style={styles.projectDescription}>{project.description}</p>
                  {project.technologies?.length ? (
                    <p style={styles.muted}>{project.technologies.join(' • ')}</p>
                  ) : null}
                </div>
                <div style={styles.actions}>
                  <button style={styles.secondaryButton} type="button" onClick={() => handleEdit(project)}>
                    Edit
                  </button>
                  <button style={styles.dangerButton} type="button" onClick={() => handleDelete(project._id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>

      {blogError ? <p style={styles.error}>{blogError}</p> : null}

      <section style={{ ...styles.grid, marginTop: '1.5rem' }}>
        <form onSubmit={handleBlogSubmit} style={styles.panel}>
          <h2 style={styles.sectionTitle}>{editingBlogId ? 'Edit Blog Post' : 'Add Blog Post'}</h2>

          <label style={styles.label}>
            Title
            <input style={styles.input} name="title" value={blogFormData.title} onChange={handleBlogChange} required />
          </label>

          <label style={styles.label}>
            Excerpt
            <textarea style={styles.textarea} name="excerpt" value={blogFormData.excerpt} onChange={handleBlogChange} required />
          </label>

          <label style={styles.label}>
            Content
            <textarea style={{ ...styles.textarea, minHeight: '150px' }} name="content" value={blogFormData.content} onChange={handleBlogChange} required />
          </label>

          <label style={styles.label}>
            Tags
            <input style={styles.input} name="tags" value={blogFormData.tags} onChange={handleBlogChange} placeholder="React, CMS, Internship" />
          </label>

          <div style={styles.actions}>
            <button style={styles.button} type="submit" disabled={isBlogSaving}>
              {isBlogSaving ? 'Saving...' : editingBlogId ? 'Update Blog Post' : 'Create Blog Post'}
            </button>
            {editingBlogId ? (
              <button style={styles.secondaryButton} type="button" onClick={resetBlogForm}>
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        <section style={styles.panel}>
          <h2 style={styles.sectionTitle}>Blog Posts</h2>
          {isBlogLoading ? <p style={styles.muted}>Loading blog posts...</p> : null}
          {!isBlogLoading && blogPosts.length === 0 ? <p style={styles.muted}>No blog posts available</p> : null}
          <div style={styles.projectList}>
            {blogPosts.map((post) => (
              <article key={post._id} style={styles.projectItem}>
                <div>
                  <h3 style={styles.projectTitle}>{post.title}</h3>
                  <p style={styles.projectDescription}>{post.excerpt}</p>
                  {post.tags?.length ? <p style={styles.muted}>{post.tags.join(' • ')}</p> : null}
                </div>
                <div style={styles.actions}>
                  <button style={styles.secondaryButton} type="button" onClick={() => handleBlogEdit(post)}>
                    Edit
                  </button>
                  <button style={styles.dangerButton} type="button" onClick={() => handleBlogDelete(post._id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    padding: '2rem',
    background: '#020617',
    color: '#e5e7eb',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    alignItems: 'center',
    maxWidth: '1180px',
    margin: '0 auto 1.5rem',
  },
  title: {
    margin: 0,
    fontSize: '2rem',
  },
  subtitle: {
    margin: '0.25rem 0 0',
    color: '#93c5fd',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(280px, 420px) minmax(0, 1fr)',
    gap: '1.5rem',
    maxWidth: '1180px',
    margin: '0 auto',
  },
  panel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1.5rem',
    border: '1px solid rgba(96, 165, 250, 0.18)',
    borderRadius: '8px',
    background: 'rgba(6, 18, 36, 0.85)',
    boxShadow: '0 12px 40px rgba(2, 6, 23, 0.45)',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '1.25rem',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    color: '#d1d5db',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#d1d5db',
  },
  input: {
    padding: '0.7rem',
    borderRadius: '6px',
    border: '1px solid rgba(148, 163, 184, 0.35)',
    background: '#0f172a',
    color: '#f8fafc',
    font: 'inherit',
  },
  textarea: {
    minHeight: '96px',
    padding: '0.7rem',
    borderRadius: '6px',
    border: '1px solid rgba(148, 163, 184, 0.35)',
    background: '#0f172a',
    color: '#f8fafc',
    font: 'inherit',
    resize: 'vertical',
  },
  button: {
    padding: '0.7rem 1rem',
    borderRadius: '6px',
    border: '1px solid rgba(96, 165, 250, 0.3)',
    background: '#2563eb',
    color: '#fff',
    font: 'inherit',
    fontWeight: 700,
    cursor: 'pointer',
  },
  secondaryButton: {
    padding: '0.65rem 0.9rem',
    borderRadius: '6px',
    border: '1px solid rgba(148, 163, 184, 0.35)',
    background: '#0f172a',
    color: '#e5e7eb',
    font: 'inherit',
    cursor: 'pointer',
  },
  dangerButton: {
    padding: '0.65rem 0.9rem',
    borderRadius: '6px',
    border: '1px solid rgba(248, 113, 113, 0.4)',
    background: 'rgba(127, 29, 29, 0.45)',
    color: '#fecaca',
    font: 'inherit',
    cursor: 'pointer',
  },
  actions: {
    display: 'flex',
    gap: '0.6rem',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  error: {
    maxWidth: '1180px',
    margin: '0 auto 1rem',
    padding: '0.75rem',
    borderRadius: '6px',
    color: '#fecaca',
    background: 'rgba(127, 29, 29, 0.35)',
  },
  muted: {
    margin: 0,
    color: '#9fbfe6',
  },
  projectList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  projectItem: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    padding: '1rem',
    border: '1px solid rgba(96, 165, 250, 0.12)',
    borderRadius: '8px',
    background: 'rgba(15, 23, 42, 0.7)',
  },
  projectTitle: {
    margin: '0 0 0.35rem',
  },
  projectDescription: {
    margin: '0 0 0.5rem',
    color: '#d1d5db',
  },
}

export default AdminDashboard
