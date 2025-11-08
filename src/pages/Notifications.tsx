import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { VoiceAssistant } from '@/components/VoiceAssistant';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { notificationsAPI } from '@/lib/api';
import { Notification } from '@/types';
import { isAuthenticated } from '@/lib/auth';
import { Volume2, Check, Bell } from 'lucide-react';
import { speak } from '@/lib/speech';
import { toast } from 'sonner';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/signin');
      return;
    }
    loadNotifications();
  }, [navigate]);

  const loadNotifications = async () => {
    try {
      const data = await notificationsAPI.getAll();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsAPI.markAsRead(id);
      toast.success('Marked as read');
      loadNotifications();
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handlePlayVoice = (message: string) => {
    speak(message);
    toast.info('Playing notification');
  };

  const getNotificationStyle = (type: Notification['type']) => {
    if (type === 'danger') return 'border-destructive bg-destructive/5';
    if (type === 'warning') return 'border-warning bg-warning/5';
    return 'border-info bg-info/5';
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Bell className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
              <p className="text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Loading notifications...
            </CardContent>
          </Card>
        ) : notifications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Notifications</h3>
              <p className="text-muted-foreground">You're all caught up! Check back later.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <Card key={notif.id} className={getNotificationStyle(notif.type)}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-base">{notif.message}</CardTitle>
                      <CardDescription className="mt-1">
                        {new Date(notif.timestamp).toLocaleString()}
                      </CardDescription>
                    </div>
                    {!notif.read && (
                      <span className="inline-flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePlayVoice(notif.message)}
                      className="gap-2"
                    >
                      <Volume2 className="h-4 w-4" />
                      Play Voice
                    </Button>
                    {!notif.read && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <VoiceAssistant />
    </div>
  );
};

export default Notifications;
