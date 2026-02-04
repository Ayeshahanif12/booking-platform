'use client';

import { useEffect, useMemo, useState } from 'react';
import { useToast } from '@/app/components/ToastProvider';

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  link?: string;
};

export default function NotificationBell({
  inline = false,
}: {
  inline?: boolean;
}) {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const isAuthed = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return Boolean(localStorage.getItem('token') && localStorage.getItem('user'));
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isAuthed) return;

    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const since = lastChecked ? `?since=${encodeURIComponent(lastChecked)}` : '';
        const res = await fetch(`/api/notifications${since}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) return;

        const newItems: NotificationItem[] = data.notifications || [];
        if (newItems.length > 0) {
          setItems((prev) => [...newItems, ...prev].slice(0, 20));
          setUnreadCount((prev) => prev + newItems.length);
          showToast(`You have ${newItems.length} new notification${newItems.length > 1 ? 's' : ''}`, 'info');
        }
        setLastChecked(new Date().toISOString());
      } catch {
        // silent
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [isAuthed, lastChecked, showToast]);

  if (!mounted || !isAuthed) return null;

  return (
    <div className={inline ? 'relative' : 'fixed top-20 right-4 z-[60]'}>
      <button
        type="button"
        onClick={() => {
          setOpen((prev) => !prev);
          setUnreadCount(0);
        }}
        className="relative bg-slate-900/80 border border-slate-700 text-white px-3 py-2 rounded-full shadow-lg hover:border-blue-400 transition flex items-center gap-2"
        aria-label="Notifications"
      >
        <span className="sr-only">Notifications</span>
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 text-white"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700 text-sm font-semibold">Notifications</div>
          {items.length === 0 ? (
            <div className="px-4 py-6 text-gray-400 text-sm">No notifications yet.</div>
          ) : (
            <div className="max-h-96 overflow-auto">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => item.link && (window.location.href = item.link)}
                  className="w-full text-left px-4 py-3 border-b border-slate-800 hover:bg-slate-800/60 transition"
                >
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-gray-400">{item.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
