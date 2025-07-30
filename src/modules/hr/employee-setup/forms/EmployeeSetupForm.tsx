import React, { useState, useEffect } from 'react';
import { Card } from '@heroui/card';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Switch } from '@heroui/switch';
import { useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Briefcase, Calendar, Users } from 'lucide-react';

import { title } from '@/modules/core/design-system/primitives';
import useAppToasts from '@/modules/core/hooks/useAppToasts';
import { useAuthService } from '@/modules/auth/services/authService';
import { useHrService } from '@/modules/hr/services/hrService';
import CustomSelect from '@/modules/core/components/Ui/custom-select';
import { HR_PAGE_ROUTES } from '../../routes/hrRouteConstants';

import type { RegisterRequest } from '@/modules/auth/api/models/RegisterRequest';
import type { EmployeeCreateRequest } from '@/modules/hr/api/models/Employee';
import type { UserResponse } from '@/modules/auth/api/models/UserResponse';

interface EmployeeSetupFormData {
  user: RegisterRequest;
  employee: Omit<EmployeeCreateRequest, 'user_id'>;
}

const EmployeeSetupForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, getUsers } = useAuthService();
  const { createEmployee } = useHrService();
  const { showToast } = useAppToasts();

  const [isCreatingNewUser, setIsCreatingNewUser] = useState(true);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);

  const initialFormData: EmployeeSetupFormData = {
    user: { user_name: '', password: '' },
    employee: { first_name: '', last_name: '', email: '', position: '', hire_date: '' },
  };

  const [formData, setFormData] = useState<EmployeeSetupFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);

  useEffect(() => {
    if (!isCreatingNewUser) {
      setUsersLoading(true);
      getUsers().then(setUsers).finally(() => setUsersLoading(false));
    }
  }, [isCreatingNewUser]);

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
      let userId: string;
      if (isCreatingNewUser) {
        const registeredUser = await register(formData.user);
        userId = registeredUser.id;
      } else {
        if (!selectedUser) {
          showToast({ title: 'Validation Error', description: 'Please select an existing user.', color: 'danger' });
          setIsLoading(false);
          return;
        }
        userId = selectedUser.id;
      }

      await createEmployee({ ...formData.employee, user_id: userId });
      showToast({ title: 'Success', description: 'Employee profile created successfully.', color: 'success' });
      setFormData(initialFormData);
      navigate(HR_PAGE_ROUTES.EMPLOYEES_LIST);
    } catch (error) {
      console.error('Employee setup failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center py-8 px-4">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className={title({ size: 'lg' })}>Employee Setup</h1>
          </div>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5" />
                    <h2 className={title({ size: 'sm' })}>User Account</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">Create New User</span>
                    <Switch 
                      isSelected={isCreatingNewUser} 
                      onValueChange={setIsCreatingNewUser}
                      color="primary"
                      size="sm"
                    />
                  </div>
                </div>
              </Card>

              {isCreatingNewUser ? (
                <Card className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      name="user_name"
                      label="Username"
                      placeholder="Enter username"
                      required
                      value={formData.user.user_name}
                      onChange={handleUserChange}
                      variant="bordered"
                      startContent={<User className="w-4 h-4" />}
                    />
                    <Input
                      name="password"
                      label="Password"
                      placeholder="Enter secure password"
                      required
                      type="password"
                      value={formData.user.password}
                      onChange={handleUserChange}
                      variant="bordered"
                    />
                  </div>
                </Card>
              ) : (
                <CustomSelect
                  items={users}
                  value={selectedUser}
                  onChange={(val) => setSelectedUser(val as UserResponse | null)}
                  valueKey="id"
                  labelKey="user_name"
                  placeholder={usersLoading ? "Loading users..." : "Select an existing user"}
                  searchable
                  disabled={usersLoading}
                />
              )}
            </div>

            <Card className="p-6 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b">
                <Users className="w-5 h-5" />
                <h2 className={title({ size: 'sm' })}>Employee Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  placeholder="employee@company.com"
                  required
                  type="email"
                  value={formData.employee.email}
                  onChange={handleEmployeeChange}
                  variant="bordered"
                  startContent={<Mail className="w-4 h-4" />}
                />
                <Input
                  name="position"
                  label="Position"
                  placeholder="Job title or role"
                  required
                  value={formData.employee.position}
                  onChange={handleEmployeeChange}
                  variant="bordered"
                  startContent={<Briefcase className="w-4 h-4" />}
                />
                <Input
                  name="hire_date"
                  label="Hire Date"
                  required
                  type="date"
                  value={formData.employee.hire_date}
                  onChange={handleEmployeeChange}
                  variant="bordered"
                  startContent={<Calendar className="w-4 h-4" />}
                  className="md:col-span-1"
                />
              </div>
            </Card>

            <div className="flex justify-end pt-6 border-t">
              <Button
                type="submit"
                size="lg"
                isLoading={isLoading}
                color="primary"
                className="font-semibold px-8"
                isDisabled={!isCreatingNewUser && !selectedUser}
                startContent={!isLoading && <UserPlus className="w-4 h-4" />}
              >
                {isLoading ? 'Creating Employee...' : 'Create Employee Profile'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default EmployeeSetupForm;