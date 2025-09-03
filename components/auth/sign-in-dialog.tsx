'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Mail, Lock, Github, Chrome, XCircle } from 'lucide-react';
import { signInWithEmail, SignInData } from '@/lib/auth';
import { FirebaseError } from 'firebase/app';
import { toast } from 'sonner';

interface SignInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToSignUp: () => void;
}

export function SignInDialog({ open, onOpenChange, onSwitchToSignUp }: SignInDialogProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    try {
      const signInData: SignInData = {
        email: formData.email.trim(),
        password: formData.password,
      };

      await signInWithEmail(signInData);
      
      toast.success('Welcome back!', {
        description: 'Signed in successfully. Redirecting to dashboard...',
      });

      // Reset form and close dialog
      resetForm();
      onOpenChange(false);
      
      // Redirect to dashboard after successful signin
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);

    } catch (error) {
      console.error('Signin error:', error);
      
      let errorMessage = 'Failed to sign in. Please try again.';
      
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            errorMessage = 'Invalid email or password.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'This account has been disabled.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed attempts. Please try again later.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your connection and try again.';
            break;
          default:
            errorMessage = error.message || errorMessage;
        }
      }

      toast.error('Sign in failed', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ email: '', password: '' });
    setShowPassword(false);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Welcome back</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Social Login */}
          <div className="space-y-3">
            <Button variant="outline" className="w-full" type="button">
              <Chrome className="w-4 h-4 mr-2" />
              Continue with Google
            </Button>
            <Button variant="outline" className="w-full" type="button">
              <Github className="w-4 h-4 mr-2" />
              Continue with GitHub
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className={`pl-10 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                value={formData.email}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, email: e.target.value }));
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                }}
                required
              />
              {errors.email && (
                <div className="flex items-center mt-1 text-sm text-red-600">
                  <XCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </div>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className={`pl-10 pr-10 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                value={formData.password}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, password: e.target.value }));
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                }}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <div className="flex items-center mt-1 text-sm text-red-600">
                <XCircle className="w-4 h-4 mr-1" />
                {errors.password}
              </div>
            )}
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>

          {/* Switch to Sign Up */}
          <div className="text-center text-sm">
            <span className="text-slate-600">Don't have an account? </span>
            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
              onClick={onSwitchToSignUp}
            >
              Sign up
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
