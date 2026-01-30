import api from '../lib/api';

const React = require('react');

const { useEffect, useState } = React;

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
                <h1 style={{ marginBottom: '1.5rem', color: '#0f172a' }}>Latest Posts</h1>
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

