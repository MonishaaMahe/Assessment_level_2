import React, { useState, useEffect } from 'react';

function Notifications({ userId = 'demo-user' }) {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/notifications?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/notifications/${notificationId}/read`, {
        method: 'PUT'
      });
      if (response.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button 
        onClick={() => setShowNotifications(!showNotifications)}
        style={{ 
          position: 'relative',
          background: '#007bff',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        🔔 Notifications
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: 'red',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <>
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.2)',
            zIndex: 99998
          }} onClick={() => setShowNotifications(false)} />
          <div style={{
            position: 'fixed',
            top: 0,
            right: showNotifications ? 0 : '-400px',
            width: '400px',
            height: '100vh',
            background: '#fafafa',
            boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
            zIndex: 100001,
            transition: 'right 0.3s ease-in-out',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ 
              padding: '1.5rem', 
              borderBottom: '1px solid #e5e5e5',
              background: 'white'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, color: '#2d3748', fontSize: '1.1rem', fontWeight: '600' }}>Notifications</h3>
                <button 
                  onClick={() => setShowNotifications(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    color: '#9ca3af',
                    cursor: 'pointer',
                    padding: '0.25rem'
                  }}
                >×</button>
              </div>
            </div>
            
            <div style={{ flex: 1, overflow: 'auto', padding: '0.5rem' }}>
              {notifications.length === 0 ? (
                <div style={{ 
                  padding: '2rem 1.5rem', 
                  textAlign: 'center', 
                  color: '#9ca3af',
                  fontSize: '0.9rem'
                }}>No notifications yet</div>
              ) : (
                notifications.map(notification => (
                  <div 
                    key={notification.id}
                    style={{
                      margin: '0.5rem',
                      padding: '1rem',
                      background: 'white',
                      borderRadius: '6px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      border: notification.isRead ? '1px solid #f3f4f6' : '1px solid #dbeafe',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => !notification.isRead && markAsRead(notification.id)}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    <div style={{ 
                      fontSize: '0.9rem', 
                      marginBottom: '0.5rem', 
                      lineHeight: '1.4', 
                      color: '#374151'
                    }}>
                      {notification.message}
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                      {!notification.isRead && (
                        <span style={{ 
                          background: '#3b82f6', 
                          color: 'white', 
                          fontSize: '0.7rem',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '10px',
                          fontWeight: '500'
                        }}>New</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Notifications;