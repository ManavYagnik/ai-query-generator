'use client';

import { useState, useEffect } from 'react';
import AuthForm from '@/components/AuthForm';
import ChatBot from '@/components/ChatBot';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('token');
    console.log("Home: Token found:", !!token);
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    console.log("Home: Login success called");
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthForm onLoginSuccess={handleLoginSuccess} />;
  }

  return <ChatBot />;
}
