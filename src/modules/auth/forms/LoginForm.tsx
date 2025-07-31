import React from 'react';
import { Card } from '@heroui/card';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';

import { title, subtitle } from '@/modules/core/design-system/primitives';
import { useAuthService } from '../services/authService';
import type { LoginRequest } from '../api/models/LoginRequest';
import useAppToasts from '@/modules/core/hooks/useAppToasts';

export interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login } = useAuthService();
  const { showToast } = useAppToasts();
  const [formData, setFormData] = React.useState<LoginRequest>({
    user_name: '',
    password: ''
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(formData);
      onSuccess?.();
      showToast({
        title: 'Login Successful',
        description: 'You have successfully logged in.',
        color: 'success',
      });
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <span className={title({ size: 'lg'})}>Welcome Back</span>
          <div className={subtitle({ class: "mt-4" })}>
            Sign in to continue
          </div>
        </div>

        <Card className="border-0 shadow-none bg-transparent">
          <form onSubmit={handleSubmit} className="space-y-8">
            <Input
              label="Username"
              placeholder="Enter your username"
              required
              value={formData.user_name}
              onChange={(e) => setFormData(prev => ({ ...prev, user_name: e.target.value }))}
              variant="underlined"
              size="lg"
              classNames={{
                input: "text-base font-medium",
                label: "text-default-600 font-medium",
                inputWrapper: "border-b-2 border-default-200 hover:border-default-400 focus-within:border-foreground transition-colors duration-300 shadow-none after:bg-foreground"
              }}
            />
            
            <Input
              label="Password"
              placeholder="Enter your password"
              required
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              variant="underlined"
              size="lg"
              classNames={{
                input: "text-base font-medium",
                label: "text-default-600 font-medium",
                inputWrapper: "border-b-2 border-default-200 hover:border-default-400 focus-within:border-foreground transition-colors duration-300 shadow-none after:bg-foreground"
              }}
            />

            <Button 
              fullWidth 
              type="submit"
              size="lg"
              isLoading={isLoading}
              className="mt-12 bg-foreground text-background hover:bg-foreground/90 font-medium shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl h-12"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            
          </form>
        </Card>
      </div>
    </section>
  );
};

export default LoginForm;