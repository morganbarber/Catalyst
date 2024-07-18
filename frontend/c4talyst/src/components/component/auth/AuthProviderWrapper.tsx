"use client";

import { AuthProvider } from '@/components/component/auth/AuthContext';
import { ReactNode } from 'react';

const AuthProviderWrapper = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AuthProviderWrapper;