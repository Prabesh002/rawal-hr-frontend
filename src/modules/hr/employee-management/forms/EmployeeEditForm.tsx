import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@heroui/card';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';

import { useHrService } from '../../services/hrService';
import useAppToasts from '@/modules/core/hooks/useAppToasts';
import type { EmployeeResponse, EmployeeUpdateRequest } from '../../api/models/Employee';

interface EmployeeEditFormProps {
  initialData: EmployeeResponse;
}

const EmployeeEditForm: React.FC<EmployeeEditFormProps> = ({ initialData }) => {
  const navigate = useNavigate();
  const { updateEmployee } = useHrService();
  const { showToast } = useAppToasts();
  const [formData, setFormData] = useState<EmployeeUpdateRequest>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData({
      first_name: initialData.first_name,
      last_name: initialData.last_name,
      email: initialData.email,
      phone_number: initialData.phone_number || '',
      position: initialData.position,
      hire_date: initialData.hire_date,
      termination_date: initialData.termination_date || undefined,
    });
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value || undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateEmployee(initialData.id, formData);
      showToast({
        title: 'Success',
        description: 'Employee profile updated successfully.',
        color: 'success',
      });
      navigate(`/hr/employees/${initialData.id}`);
    } catch (error) {
      console.error('Failed to update employee:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-8">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <Input
          name="first_name"
          label="First Name"
          value={formData.first_name}
          onChange={handleChange}
          variant="bordered"
        />
        <Input
          name="last_name"
          label="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          variant="bordered"
        />
        <Input
          name="email"
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={handleChange}
          variant="bordered"
        />
        <Input
          name="phone_number"
          label="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
          variant="bordered"
        />
        <Input
          name="position"
          label="Position"
          value={formData.position}
          onChange={handleChange}
          variant="bordered"
        />
        <Input
          name="hire_date"
          label="Hire Date"
          type="date"
          value={formData.hire_date}
          onChange={handleChange}
          variant="bordered"
        />
        <Input
          name="termination_date"
          label="Termination Date"
          type="date"
          value={formData.termination_date}
          onChange={handleChange}
          variant="bordered"
        />
        <div className="col-span-full mt-8 flex justify-end gap-4">
          <Button variant="bordered" onPress={() => navigate(`/hr/employees/${initialData.id}`)}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} color="primary">
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default EmployeeEditForm;