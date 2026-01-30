import api from '../lib/api';

const React = require('react');

const { useEffect, useState } = React;

function CreatePostForm({ onPostCreated }) {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [userId, setUserId] = useState('');
    const [tags, setTags] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await api.post('/posts', {
                title,
                body,
                userId: parseInt(userId, 10),
                tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
            });

            console.log('Post created:', response.data);
            setMessage({ type: 'success', text: 'Post created successfully!' });

            // Clear form
            setTitle('');
            setBody('');
            setUserId('');
            setTags('');

            // Notify parent component
            if (onPostCreated) {
                onPostCreated(response.data);
            }
        } catch (err) {
            console.error('Error creating post:', err);
            setMessage({ type: 'error', text: 'Failed to create post. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            style={{
                background: '#fff',
                borderRadius: '16px',
                boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
                padding: '2rem',
                marginBottom: '2rem',
            }}
        >
            <h2 style={{ margin: '0 0 1.5rem', color: '#0f172a' }}>Create New Post</h2>

            {message.text && (
                <div
                    style={{
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                        color: message.type === 'success' ? '#166534' : '#b91c1c',
                    }}
                >
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#334155', fontWeight: 500 }}>
                        Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            fontSize: '1rem',
                            outline: 'none',
                            boxSizing: 'border-box',
                        }}
                        placeholder="Enter post title"
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#334155', fontWeight: 500 }}>
                        Body
                    </label>
                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        required
                        rows={4}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            fontSize: '1rem',
                            outline: 'none',
                            resize: 'vertical',
                            boxSizing: 'border-box',
                        }}
                        placeholder="Enter post content"
                    />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#334155', fontWeight: 500 }}>
                        User ID
                    </label>
                    <input
                        type="number"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                        min="1"
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            fontSize: '1rem',
                            outline: 'none',
                            boxSizing: 'border-box',
                        }}
                        placeholder="Enter user ID (e.g., 5)"
                    />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#334155', fontWeight: 500 }}>
                        Tags (comma-separated)
                    </label>
                    <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            fontSize: '1rem',
                            outline: 'none',
                            boxSizing: 'border-box',
                        }}
                        placeholder="e.g., tech, news, programming"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                        background: isSubmitting ? '#94a3b8' : '#3b82f6',
                        color: '#fff',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        transition: 'background 0.2s',
                    }}
                >
                    {isSubmitting ? 'Creating...' : 'Create Post'}
                </button>
            </form>
        </div>
    );
}

export function Posts() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;

        const fetchPosts = async () => {
            try {
                const response = await api.get('/posts');
                console.log('Encrypted response payload:', response.data);
                const data = response.data || {};
                if (isMounted) {
                    setPosts(Array.isArray(data.posts) ? data.posts : []);
                }
            } catch (err) {
                if (isMounted) {
                    console.log('Error fetching posts:', err);
                    setError('Unable to load posts.');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchPosts();

        return () => {
            isMounted = false;
        };
    }, []);

    const handlePostCreated = (newPost) => {
        // Add the new post to the beginning of the list
        setPosts((prevPosts) => [newPost, ...prevPosts]);
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                background: '#f5f7fb',
                padding: '3rem 1.5rem',
                fontFamily: 'Nunito, sans-serif',
            }}
        >
            <div style={{ maxWidth: '820px', margin: '0 auto' }}>
                <h1 style={{ marginBottom: '1.5rem', color: '#0f172a' }}>Posts</h1>

                <CreatePostForm onPostCreated={handlePostCreated} />

                {isLoading && (
                    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', color: '#64748b' }}>
                        Loading posts...
                    </div>
                )}
                {!isLoading && error && (
                    <div
                        style={{
                            background: '#fee2e2',
                            color: '#b91c1c',
                            padding: '1.5rem',
                            borderRadius: '12px',
                        }}
                    >
                        {error}
                    </div>
                )}
                {!isLoading && !error && (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {posts.map((post) => (
                            <article
                                key={post.id}
                                style={{
                                    background: '#fff',
                                    borderRadius: '16px',
                                    boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
                                    padding: '2rem',
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
                                        Post #{post.id}
                                    </span>
                                    <span style={{ fontSize: '0.9rem', color: '#64748b' }}>User {post.userId}</span>
                                </div>
                                <h2 style={{ margin: '0 0 0.75rem', color: '#0f172a' }}>{post.title}</h2>
                                <p style={{ margin: 0, color: '#475569', lineHeight: 1.7 }}>{post.body}</p>

                                <div
                                    style={{ marginTop: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
                                >
                                    {post.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            style={{
                                                background: '#e2e8f0',
                                                color: '#334155',
                                                padding: '0.35rem 0.75rem',
                                                borderRadius: '999px',
                                                fontSize: '0.85rem',
                                            }}
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                <div
                                    style={{
                                        marginTop: '1.5rem',
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                                        gap: '1rem',
                                    }}
                                >
                                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
                                        <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Likes</div>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a' }}>
                                            {post.reactions.likes}
                                        </div>
                                    </div>
                                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
                                        <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Dislikes</div>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a' }}>
                                            {post.reactions.dislikes}
                                        </div>
                                    </div>
                                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
                                        <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Views</div>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a' }}>
                                            {post.views}
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

