import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useSearchParams } from 'react-router';
import { auth, login, db } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Sky } from './components/Sky';
import { Landing } from './components/Landing';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0b16] flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500 w-10 h-10" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Sky user={user} /> : <Landing onLogin={login} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
