import { useEffect, useState } from 'react';
import { supabase, isConfigured } from './lib/supabase';
import Auth from './components/Auth';
import Notes from './components/Notes';
import { Loader2, Settings, AlertTriangle, ExternalLink } from 'lucide-react';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    // Check active sessions and subscribe to auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Settings className="text-amber-500 w-8 h-8 animate-spin-slow" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Configuration Required</h1>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Please add your Supabase credentials to the **Secrets** panel in AI Studio to get started.
          </p>
          
          <div className="space-y-3 text-left mb-8">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Key 1</p>
              <code className="text-sm text-indigo-600 font-mono">VITE_SUPABASE_URL</code>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Key 2</p>
              <code className="text-sm text-indigo-600 font-mono">VITE_SUPABASE_ANON_KEY</code>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-indigo-50 rounded-2xl text-indigo-700 text-sm text-left mb-8">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>After adding these secrets, the app will automatically refresh and connect to your database.</p>
          </div>

          <a 
            href="https://supabase.com/dashboard" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
          >
            Go to Supabase Dashboard <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">Initializing app...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {!session ? (
        <Auth onAuthSuccess={() => {}} />
      ) : (
        <Notes />
      )}
    </div>
  );
}
