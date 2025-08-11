import React, { useState, useEffect } from 'react';

function Comments({ entityType, entityId, currentUser = 'demo-user' }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (entityType && entityId) {
      fetchComments();
    }
  }, [entityType, entityId]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/comments?entityType=${entityType}&entityId=${entityId}`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      const response = await fetch('http://localhost:8080/api/comments', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          entityType,
          entityId,
          authorId: currentUser,
          content: newComment
        })
      });
      if (response.ok) {
        setNewComment('');
        fetchComments();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
      <h4>Comments ({comments.length})</h4>
      
      <div style={{ marginBottom: '1rem' }}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          style={{ width: '100%', minHeight: '60px', marginBottom: '0.5rem' }}
        />
        <button onClick={addComment} className="btn btn-primary">Add Comment</button>
      </div>

      <div>
        {comments.map(comment => (
          <div key={comment.id} style={{ 
            padding: '0.5rem', 
            marginBottom: '0.5rem', 
            backgroundColor: '#f9f9f9', 
            borderRadius: '4px' 
          }}>
            <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem' }}>
              <strong>{comment.authorId}</strong> • {new Date(comment.createdAt).toLocaleString()}
            </div>
            <div>{comment.content}</div>
          </div>
        ))}
        {comments.length === 0 && (
          <div style={{ color: '#666', fontStyle: 'italic' }}>No comments yet</div>
        )}
      </div>
    </div>
  );
}

export default Comments;