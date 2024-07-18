import { useCookies } from 'react-cookie';
import { redirect } from 'next/navigation';
import { createContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  username: string;
}

interface AuthContextProps {
  user: User | null; 
  isAuthenticated: boolean;
  loading: boolean;
  login: (userData: { username: string; password: string }) => Promise<void>; 
  signup: (userData: { username: string; password: string }) => Promise<void>; 
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  refreshToken: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(['accessToken', 'refreshToken']);

  // Function to handle user login
  const login = async (userData: any) => {
    try {
      const response = await fetch('http://35.83.115.56/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        setCookie('accessToken', data.access_token, { path: '/' });
        setCookie('refreshToken', data.refresh_token, { path: '/' });
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error(error);
      // Handle login error (e.g., display an error message)
      alert("Something went wrong! Try refreshing your page.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle user signup
  const signup = async (userData: any) => {
    try {
      const response = await fetch('http://35.83.115.56/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        setCookie('accessToken', data.access_token, { path: '/' });
        setCookie('refreshToken', data.refresh_token, { path: '/' });
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        throw new Error('Signup failed');
      }
    } catch (error) {
      console.error(error);
      // Handle signup error (e.g., display an error message)
    } finally {
      setLoading(false);
    }
  };

  // Function to handle user logout
  const logout = async () => {
    try {
      // await fetch('/api/auth/logout', {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${cookies.accessToken}` },
      // });

      removeCookie('accessToken', { path: '/' });
      removeCookie('refreshToken', { path: '/' });
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh the access token
  const refreshToken = async () => {
    try {
      const response = await fetch('http://35.83.115.56/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cookies.refreshToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCookie('accessToken', data.access_token, { path: '/' });
        setIsAuthenticated(true); // Set isAuthenticated to true after refreshing token
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      console.error(error);
      // Handle token refresh error (e.g., redirect to login)
      redirect('/login');
    } finally {
      setLoading(false); // Ensure loading is set to false after the refresh attempt
    }
  };

  const checkToken = async () => {
    if (cookies.accessToken) {
      try {
        const response = await fetch('http://35.83.115.56/auth/validate', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${cookies.accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          // Access token invalid - attempt to refresh
          await refreshToken();
        }
      } catch (error) {
        // Access token invalid and refresh failed
        redirect('/login');
      } finally {
        setLoading(false); // Ensure loading is set to false after the check
      }
    } else {
      setLoading(false); // Ensure loading is set to false if no token is found
    }
  };

  useEffect(() => {
    checkToken();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        signup,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };