
import React, { useEffect } from 'react';
import { Helmet } from "react-helmet-async";
import AuthForm from '@/components/AuthForm';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home if user is already logged in
    if (user && !isLoading) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/20 p-4">
      <Helmet>
        <title>Authentication | Performance Management System</title>
      </Helmet>
      
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Performance Management System</h1>
        <p className="text-muted-foreground">Sign in to manage your performance objectives</p>
      </div>
      
      <AuthForm />
      
      <p className="mt-8 text-center text-sm text-muted-foreground">
        By signing in, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
};

export default Auth;
