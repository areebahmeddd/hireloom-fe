'use client';

import { useState } from 'react';
import { HeroSection } from '@/components/landing/hero-section';
import { SignInDialog } from '@/components/auth/sign-in-dialog';
import { SignUpDialog } from '@/components/auth/sign-up-dialog';

export default function LandingPage() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleGetStarted = () => {
    setShowSignUp(true);
  };

  const switchToSignIn = () => {
    setShowSignUp(false);
    setShowSignIn(true);
  };

  const switchToSignUp = () => {
    setShowSignIn(false);
    setShowSignUp(true);
  };

  return (
    <div className="min-h-screen">
      <HeroSection onGetStarted={handleGetStarted} />
      
      <SignInDialog 
        open={showSignIn} 
        onOpenChange={setShowSignIn}
        onSwitchToSignUp={switchToSignUp}
      />
      
      <SignUpDialog 
        open={showSignUp} 
        onOpenChange={setShowSignUp}
        onSwitchToSignIn={switchToSignIn}
      />
    </div>
  );
}