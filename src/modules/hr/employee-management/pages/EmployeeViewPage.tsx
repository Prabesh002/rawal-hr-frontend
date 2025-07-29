import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@heroui/card';
import { Button } from '@heroui/button';

import { useHrService } from '../../services/hrService';
import type { EmployeeResponse } from '../../api/models/Employee';
import { title, subtitle } from '@/modules/core/design-system/primitives';

const DetailItem = ({ label, value }: { label: string; value?: string | null }) => (
  <div>
    <p className="text-sm text-default-500">{label}</p>
    <p className="text-lg font-medium">{value || 'N/A'}</p>
  </div>
);

const EmployeeViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className={title()}>{`${employee.first_name} ${employee.last_name}`}</h1>
          <p className={subtitle({ class: 'mt-2' })}>{employee.position}</p>
        </div>
        <Button color="primary" onPress={() => navigate(`/hr/employees/${employee.id}/edit`)}>
          Edit Profile
        </Button>
      </div>
      <Card className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <DetailItem label="Email Address" value={employee.email} />
          <DetailItem label="Phone Number" value={employee.phone_number} />
          <DetailItem label="Hire Date" value={employee.hire_date} />
          <DetailItem label="Termination Date" value={employee.termination_date} />
          <DetailItem label="Created At" value={new Date(employee.created_at).toLocaleDateString()} />
        </div>
      </Card>
    </section>
  );
};

export default EmployeeViewPage;