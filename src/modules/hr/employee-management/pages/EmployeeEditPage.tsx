import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useHrService } from '../../services/hrService';
import type { EmployeeResponse } from '../../api/models/Employee';
import { title } from '@/modules/core/design-system/primitives';
import EmployeeEditForm from '../forms/EmployeeEditForm';

const EmployeeEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getEmployeeById } = useHrService();
  const [employee, setEmployee] = useState<EmployeeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const data = await getEmployeeById(id);
        setEmployee(data);
      } catch (error) {
        console.error(`Failed to fetch employee ${id}:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  if (!employee) {
    return <div className="text-center p-10">Employee not found.</div>;
  }

  return (
    <section>
      <h1 className={title({ class: 'mb-6' })}>Edit Employee Profile</h1>
      <EmployeeEditForm initialData={employee} />
    </section>
  );
};

export default EmployeeEditPage;