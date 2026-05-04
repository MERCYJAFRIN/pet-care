import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axiosInstance from '../services/api';
import '../styles/notifications.css';

const NotificationsPage = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('all'); // all, unread, read
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [activeTab]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // For demonstration, fetch all and filter client side
      // In production, we'd hit /notifications with query params
      const endpoint = activeTab === 'unread' ? '/notifications/unread' : '/notifications';
      const response = await axiosInstance.get(endpoint);
      setNotifications(response.data.notifications || []);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axiosInstance.put(`/notifications/${id}/read`);
      fetchNotifications(); // Refresh list
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const markAllRead = async () => {
    try {
      await axiosInstance.put('/notifications/all/read');
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all read', err);
    }
  };

  const renderIcon = (title = '') => {
    if (title.toLowerCase().includes('appointment')) return <span className="notif-icon-calendar">📅</span>;
    return <span className="notif-icon-bell">🔔</span>;
  };

  const filteredNotifs = notifications.filter(n => {
    if (activeTab === 'unread') return n.status === 'unread';
    if (activeTab === 'read') return n.status === 'read';
    return true; // all
  });

  return (
    <div className="notifications-page-container">
      
      <main className="notifications-main">
        <div className="notif-header-section pop-in">
          <div className="notif-title-area">
             <h1>🔔 Notifications</h1>
             <p>You have {notifications.filter(n=>n.status === 'unread').length} unread notifications</p>
          </div>
          <button className="btn-mark-all" onClick={markAllRead}>
            ✓ Mark All Read
          </button>
        </div>

        <div className="notif-tabs pop-in">
          <button className={activeTab === 'all' ? 'active' : ''} onClick={() => setActiveTab('all')}>
            All ({notifications.length})
          </button>
          <button className={activeTab === 'unread' ? 'active' : ''} onClick={() => setActiveTab('unread')}>
            Unread ({notifications.filter(n=>n.status === 'unread').length})
          </button>
          <button className={activeTab === 'read' ? 'active' : ''} onClick={() => setActiveTab('read')}>
            Read ({notifications.filter(n=>n.status === 'read').length})
          </button>
        </div>

        <div className="notif-list pop-in">
          {loading ? (
             <p className="loading-text">Loading notifications...</p>
          ) : filteredNotifs.length === 0 ? (
             <div className="empty-notifs">
               <span style={{ fontSize: '3rem', opacity: 0.5 }}>📭</span>
               <p>No notifications to display.</p>
             </div>
          ) : (
            filteredNotifs.map(n => (
              <div key={n.id} className={`notif-card ${n.status === 'unread' ? 'unread' : 'read'}`}>
                <div className="notif-icon-wrapper">
                  {renderIcon(n.title)}
                </div>
                <div className="notif-content">
                  <h4>{n.title}</h4>
                  <p>{n.message}</p>
                  <span className="notif-time">
                    ⏱️ {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {n.status === 'unread' && (
                  <button className="btn-mark-read" onClick={() => markAsRead(n.id)}>
                    ✓ Read
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;
