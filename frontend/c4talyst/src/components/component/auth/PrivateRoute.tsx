// PrivateRoute.tsx
import { permanentRedirect } from 'next/navigation'
import { useAuth } from './AuthContext';
import '../Loading';
import Loading from '../Loading';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading/>
  }

  if (!isAuthenticated) {
    permanentRedirect('/login')
    return null;
  }

  return <>{children}</>;
};

export default PrivateRoute;