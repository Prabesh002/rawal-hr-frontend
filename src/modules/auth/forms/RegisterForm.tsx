import React from 'react';
import { Card } from '@heroui/card';
import { useNavigate } from 'react-router-dom';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { text, title, subtitle } from '@/modules/core/design-system/primitives';
import { useAuthService } from '../services/authService';
import type { RegisterRequest } from '../api/models/RegisterRequest';
import { AUTH_PAGE_ROUTES } from '../routes/authRouteConstants';

export interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { register } = useAuthService();
  const [formData, setFormData] = React.useState<RegisterRequest>({
    user_name: '',
    password: ''
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await register(formData);
      onSuccess?.();
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <span className={title({ size: 'lg'})}>Create Account</span>
          <div className={subtitle({ class: "mt-4" })}>
            Join us to get started
          </div>
        </div>

        <Card className="border-0 shadow-none bg-transparent">
          <form onSubmit={handleSubmit} className="space-y-8">
            <Input
              label="Username"
              placeholder="Choose a username"
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
              placeholder="Create a password"
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
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>

            <div className="text-center pt-8 space-y-4">
              <p className={text({ size: 'sm', align: 'center' })}>
                Already have an account?{' '}
                <Button
                  variant="light"
                  size="sm"
                  onClick={() => navigate(AUTH_PAGE_ROUTES.LOGIN)}
                  className="p-0 h-auto font-medium text-foreground hover:text-foreground/80 underline-offset-4 hover:underline"
                >
                  Sign in
                </Button>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default RegisterForm;