import api from '../lib/api';

const React = require('react');

const { useState } = React;

const initialFormState = {
    title: '',
    body: '',
    tags: '',
    userId: '1',
};

export function CreatePost() {
    const [formData, setFormData] = useState(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!formData.title.trim() || !formData.body.trim()) {
            setError('Please provide both a title and content.');
            return;
        }

        setIsSubmitting(true);

        const payload = {
            title: formData.title.trim(),
            body: formData.body.trim(),
            tags: formData.tags
                .split(',')
                .map((tag) => tag.trim())
                .filter(Boolean),
            userId: Number(formData.userId) || 1,
        };

        try {
            const res = await api.post('/posts', payload);
            console.log('Post created:', res);
            setSuccessMessage('Post created successfully.');
            setFormData(initialFormState);
        } catch (err) {
            console.log('Error creating post:', err);
            setError('Unable to create the post. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
                padding: '3.5rem 1.5rem',
                fontFamily: 'Nunito, sans-serif',
            }}
        >
            <div style={{ maxWidth: '960px', margin: '0 auto' }}>
                <header style={{ marginBottom: '2rem' }}>
                    <p
                        style={{
                            color: '#6366f1',
                            fontWeight: 600,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            fontSize: '0.8rem',
                            marginBottom: '0.75rem',
                        }}
                    >
                        Blog Dashboard
                    </p>
                    <h1 style={{ margin: 0, color: '#0f172a', fontSize: '2.6rem' }}>Create a new post</h1>
                    <p style={{ marginTop: '0.75rem', color: '#64748b', maxWidth: '560px' }}>
                        Draft a new story, add tags, and publish it once you are happy with the content.
                    </p>
                </header>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)',
                        gap: '2rem',
                    }}
                >
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            background: '#ffffff',
                            padding: '2.5rem',
                            borderRadius: '20px',
                            boxShadow: '0 20px 45px rgba(15, 23, 42, 0.12)',
                            display: 'grid',
                            gap: '1.5rem',
                        }}
                    >
                        {error && (
                            <div
                                style={{
                                    background: '#fee2e2',
                                    color: '#b91c1c',
                                    padding: '0.85rem 1rem',
                                    borderRadius: '12px',
                                    fontWeight: 600,
                                }}
                            >
                                {error}
                            </div>
                        )}
                        {successMessage && (
                            <div
                                style={{
                                    background: '#dcfce7',
                                    color: '#15803d',
                                    padding: '0.85rem 1rem',
                                    borderRadius: '12px',
                                    fontWeight: 600,
                                }}
                            >
                                {successMessage}
                            </div>
                        )}

                        <label style={{ display: 'grid', gap: '0.5rem', fontWeight: 600, color: '#0f172a' }}>
                            Title
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="A headline that grabs attention"
                                style={inputStyles}
                            />
                        </label>

                        <label style={{ display: 'grid', gap: '0.5rem', fontWeight: 600, color: '#0f172a' }}>
                            Content
                            <textarea
                                name="body"
                                value={formData.body}
                                onChange={handleChange}
                                rows="6"
                                placeholder="Write your post here..."
                                style={{ ...inputStyles, resize: 'vertical', minHeight: '140px' }}
                            />
                        </label>

                        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
                            <label style={{ display: 'grid', gap: '0.5rem', fontWeight: 600, color: '#0f172a' }}>
                                Tags
                                <input
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleChange}
                                    placeholder="design, product, launch"
                                    style={inputStyles}
                                />
                            </label>
                            <label style={{ display: 'grid', gap: '0.5rem', fontWeight: 600, color: '#0f172a' }}>
                                Author ID
                                <input
                                    name="userId"
                                    value={formData.userId}
                                    onChange={handleChange}
                                    type="number"
                                    min="1"
                                    style={inputStyles}
                                />
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                border: 'none',
                                borderRadius: '12px',
                                padding: '0.95rem 1.5rem',
                                background: isSubmitting ? '#c7d2fe' : '#4f46e5',
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '1rem',
                                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {isSubmitting ? 'Publishing...' : 'Publish post'}
                        </button>
                    </form>

                    <aside
                        style={{
                            background: '#0f172a',
                            color: '#e2e8f0',
                            padding: '2rem',
                            borderRadius: '20px',
                            display: 'grid',
                            gap: '1.5rem',
                            alignContent: 'start',
                            boxShadow: '0 20px 45px rgba(15, 23, 42, 0.2)',
                        }}
                    >
                        <div>
                            <p style={{ margin: 0, fontSize: '0.85rem', letterSpacing: '0.1em', color: '#94a3b8' }}>
                                PREVIEW
                            </p>
                            <h2 style={{ marginTop: '0.75rem', marginBottom: '0.5rem', color: '#f8fafc' }}>
                                {formData.title || 'Post title preview'}
                            </h2>
                            <p style={{ margin: 0, color: '#cbd5f5', lineHeight: 1.6 }}>
                                {formData.body || 'Your post content will appear here once you start typing.'}
                            </p>
                        </div>

                        <div>
                            <p style={{ marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>Tags</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {(formData.tags
                                    ? formData.tags
                                          .split(',')
                                          .map((tag) => tag.trim())
                                          .filter(Boolean)
                                    : ['feature', 'insight'])
                                    .map((tag) => (
                                        <span
                                            key={tag}
                                            style={{
                                                background: 'rgba(99, 102, 241, 0.2)',
                                                color: '#e0e7ff',
                                                padding: '0.3rem 0.75rem',
                                                borderRadius: '999px',
                                                fontSize: '0.85rem',
                                            }}
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                            </div>
                        </div>

                        <div
                            style={{
                                background: 'rgba(148, 163, 184, 0.15)',
                                borderRadius: '14px',
                                padding: '1rem',
                            }}
                        >
                            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>Author ID</p>
                            <p style={{ marginTop: '0.5rem', fontSize: '1.4rem', color: '#f8fafc' }}>
                                {formData.userId || '1'}
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

const inputStyles = {
    width: '100%',
    padding: '0.85rem 1rem',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    background: '#f8fafc',
    fontSize: '0.95rem',
    color: '#0f172a',
    outline: 'none',
    boxShadow: 'inset 0 1px 2px rgba(15, 23, 42, 0.05)',
};
