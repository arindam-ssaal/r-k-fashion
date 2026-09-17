import { create } from 'zustand';
import { persist,createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

// 📝 Dummy Users Data
const fakeUsers = [
  {
    id: "1",
    username: "cashier",
    email: "cashier@pos.com",
    password: "cashier123",
    role: "cashier",
  },
  {
    id: "2",
    username: "user@sg",
    email: "sg@pos.com",
    password: "Test@1234",
    role: "manager",
  },
  {
    id: "3",
    username: "rickzi3",
    email: "manager@pos.com",
    password: "Haldiram?008",
    role: "admin",
  },
];

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  // 🔥 New Methods for Local Auth
  login: ({username, password}:{username: string, password: string}) => string | null;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set,get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken, refreshToken) =>
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),

      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),

      updateTokens: (accessToken, refreshToken) =>
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),
          // 🔐 New Function: Local Login
     login: ({username, password}) => {
      const user = fakeUsers.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        const dummyAccessToken = btoa(`access-${user.id}-${Date.now()}`);
        const dummyRefreshToken = btoa(`refresh-${user.id}-${Date.now()}`);

        // ✅ Reuse Existing setAuth
        get().setAuth(user, dummyAccessToken, dummyRefreshToken);
        return null; // ✅ Login Success
      }

      return "Invalid username or password!"; // ❌ Login Failed
    },

    // 🔓 New Function: Local Logout
    logout: () => get().clearAuth(),
    }),
   
    
    {
      name: 'auth-storage',  // ✅ LocalStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
