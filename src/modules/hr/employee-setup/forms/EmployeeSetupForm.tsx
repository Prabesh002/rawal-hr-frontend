import React from 'react';
import { Card } from '@heroui/card';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';

import { title, subtitle } from '@/modules/core/design-system/primitives';
import useAppToasts from '@/modules/core/hooks/useAppToasts';
import { useAuthService } from '@/modules/auth/services/authService';
import { useHrService } from '@/modules/hr/services/hrService';
import type { RegisterRequest } from '@/modules/auth/api/models/RegisterRequest';
import type { EmployeeCreateRequest } from '@/modules/hr/api/models/Employee';
import { useNavigate } from 'react-router-dom';
import { HR_PAGE_ROUTES } from '../../routes/hrRouteConstants';

interface EmployeeSetupFormData {
  user: RegisterRequest;
  employee: Omit<EmployeeCreateRequest, 'user_id'>;
}

const EmployeeSetupForm: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuthService();
  const { createEmployee } = useHrService();
  const { showToast } = useAppToasts();

  const initialFormData: EmployeeSetupFormData = {
    user: { user_name: '', password: '' },
    employee: { first_name: '', last_name: '', email: '', position: '', hire_date: '' },
  };

  const [formData, setFormData] = React.useState<EmployeeSetupFormData>(initialFormData);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, user: { ...prev.user, [name]: value } }));
  };

  const handleEmployeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, employee: { ...prev.employee, [name]: value } }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const registeredUser = await register(formData.user);
      console.log('Registered User:', registeredUser);

      await createEmployee({
        ...formData.employee,
        user_id: registeredUser.id,
      });

      showToast({
        title: 'Success',
        description: 'Employee and user account created successfully.',
        color: 'success',
      });
      setFormData(initialFormData);
      navigate(HR_PAGE_ROUTES.EMPLOYEES_LIST)
    } catch (error) {
      console.error('Employee setup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center py-10">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className={title({ size: 'lg' })}>Employee Setup</h1>
          <p className={subtitle({ class: "mt-4" })}>
            Create a user account and an employee profile.
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <h2 className={title({ size: 'sm', class: 'col-span-full mb-2 border-b pb-2' })}>User Account</h2>
            <Input
              name="user_name"
              label="Username"
              placeholder="Enter a username"
              required
              value={formData.user.user_name}
              onChange={handleUserChange}
              variant="bordered"
            />
            <Input
              name="password"
              label="Password"
              placeholder="Enter a secure password"
              required
              type="password"
              value={formData.user.password}
              onChange={handleUserChange}
              variant="bordered"
            />

            <h2 className={title({ size: 'sm', class: 'col-span-full mt-6 mb-2 border-b pb-2' })}>Employee Details</h2>
            <Input
              name="first_name"
              label="First Name"
              placeholder="Enter first name"
              required
              value={formData.employee.first_name}
              onChange={handleEmployeeChange}
              variant="bordered"
            />
            <Input
              name="last_name"
              label="Last Name"
              placeholder="Enter last name"
              required
              value={formData.employee.last_name}
              onChange={handleEmployeeChange}
              variant="bordered"
            />
            <Input
              name="email"
              label="Email Address"
              placeholder="Enter email"
              required
              type="email"
              value={formData.employee.email}
              onChange={handleEmployeeChange}
              variant="bordered"
            />
            <Input
              name="position"
              label="Position"
              placeholder="e.g., Software Engineer"
              required
              value={formData.employee.position}
              onChange={handleEmployeeChange}
              variant="bordered"
            />
            <Input
              name="hire_date"
              label="Hire Date"
              required
              type="date"
              value={formData.employee.hire_date}
              onChange={handleEmployeeChange}
              variant="bordered"
              className="col-span-full md:col-span-1"
            />

            <div className="col-span-full mt-8 flex justify-end">
              <Button 
                type="submit"
                size="lg"
                isLoading={isLoading}
                color="primary"
                className="font-medium shadow-lg"
              >
                {isLoading ? 'Creating...' : 'Create Employee'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default EmployeeSetupForm;