import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

// import Header from './components/Header';
import FloatingButtons from './components/FloatingButtons';
import Sidebar from './components/Sidebar/Sidebar';

import useAutoLogout from '@/app/hooks/useAutoLogout';
import useImageUploaderState from '@/components/ImageUploader/store/useImageUploader';
import { useAuth } from '@/store/useAuth';

//import SessionExpiredModal from '@/common/SessionExpiredModal'

function RootLayout() {

  useAutoLogout();
  const navigate = useNavigate();
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const image = useImageUploaderState((state) => state.image);

  // ✅ Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // 🛑 Show nothing if not authenticated (Prevent Flash of Protected Content)
  if (!isAuthenticated) return null;

  return (
    <div className="app_layout">
      {/* ✅ Sidebar for Authenticated Users */}
      <Sidebar />
      
      <main
        className="overflow-y-scroll h-screen relative"
        style={{
          // !chnage dark blue to sky blue on 27-04-2026
          // background: 'linear-gradient(180deg, #0A1628 0%, #080E1A 100%)',
          background: '#d6eaf8',
          ...(image
            ? {
                backgroundImage: `url(${image})`,
                backgroundSize: "200px 200px",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }
            : {}),
        }}
      >
        {/* Header commented out to save space */}
        {/* <Header /> */}
        <Outlet />
        <FloatingButtons />

        {/* <SessionExpiredModal /> */}
      </main>
    </div>
  );
}

export default RootLayout;
