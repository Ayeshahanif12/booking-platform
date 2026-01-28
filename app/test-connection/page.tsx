'use client';

import { useEffect, useState } from 'react';

export default function TestDB() {
  const [status, setStatus] = useState('Testing...');
  const [error, setError] = useState('');

  useEffect(() => {
    const test = async () => {
      try {
        const res = await fetch('/api/test-db');
        const data = await res.json();
        
        if (res.ok) {
          setStatus(`✅ Database Connected: ${data.message}`);
        } else {
          setStatus(`❌ Database Error: ${data.error}`);
          setError(data.details || '');
        }
      } catch (err: any) {
        setStatus('❌ Connection Failed');
        setError(err.message);
      }
    };

    test();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Database Status</h1>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <p className="text-xl mb-4">{status}</p>
          {error && (
            <pre className="bg-slate-900 p-4 rounded text-sm text-red-400 overflow-auto">
              {error}
            </pre>
          )}
        </div>
        <div className="mt-8">
          <p className="text-gray-400">
            This page tests your MongoDB connection. If you see a green checkmark, the database is working correctly.
          </p>
        </div>
      </div>
    </div>
  );
}
