import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { Bell } from 'lucide-react';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  sender_name: string;
  sender_avatar?: string;
  created_at: string;
  is_read: boolean;
}

export const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
        <Bell /> Notificações
      </h1>

      <div className="space-y-2">
        {loading ? (
            <p className="text-gray-500">Carregando...</p>
        ) : notifications.length === 0 ? (
            <p className="text-gray-500">Nenhuma notificação ainda.</p>
        ) : (
            notifications.map(notification => (
                <div 
                    key={notification.id} 
                    className={`p-4 rounded-xl flex items-center gap-4 ${notification.is_read ? 'bg-white' : 'bg-blue-50'}`}
                    onClick={() => markAsRead(notification.id)}
                >
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                        {notification.sender_avatar && <img src={notification.sender_avatar} alt={notification.sender_name} className="w-full h-full object-cover" />}
                    </div>
                    <div>
                        <p>
                            <span className="font-semibold">{notification.sender_name}</span>
                            {' '}
                            {notification.type === 'like' && 'curtiu seu post'}
                            {notification.type === 'comment' && 'comentou no seu post'}
                            {notification.type === 'follow' && 'começou a te seguir'}
                            {notification.type === 'mention' && 'mencionou você'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {new Date(notification.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};
