import { useState, useEffect } from 'react';

import CustomSelect from './custom-select';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig<T> {
  key: string;
  label: string;
  type: 'select';
  placeholder: string;
  options: FilterOption[];
  filterFn: (item: T, value: string) => boolean;
}

interface DataFilterProps<T> {
  data: T[];
  filterConfig: FilterConfig<T>[];
  onFilterChange: (filteredData: T[]) => void;
  initialFilters?: { [key: string]: string };
}

export const DataFilter = <T,>({ data, filterConfig, onFilterChange, initialFilters = {} }: DataFilterProps<T>) => {
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string }>(initialFilters);

  useEffect(() => {
    let filteredData = [...data];

    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value) {
        const config = filterConfig.find(fc => fc.key === key);
        if (config?.filterFn) {
          filteredData = filteredData.filter(item => config.filterFn(item, value));
        }
      }
    });

    onFilterChange(filteredData);
  }, [data, activeFilters, filterConfig, onFilterChange]);

  const handleFilterValueChange = (key: string, value: string | null) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      if (value) {
        newFilters[key] = value;
      } else {
        delete newFilters[key];
      }
      return newFilters;
    });
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-default-50 dark:bg-default-100 rounded-lg">
      {filterConfig.map(config => (
        <div key={config.key} className="flex-grow min-w-[200px]">
          <label className="text-sm font-medium text-default-600 dark:text-default-400 mb-1 block">
            {config.label}
          </label>
          {config.type === 'select' && (
            <CustomSelect
              items={config.options}
              value={config.options.find(opt => opt.value === activeFilters[config.key]) || null}
              onChange={(item) => handleFilterValueChange(config.key, (item as FilterOption | null)?.value || null)}
              valueKey="value"
              labelKey="label"
              placeholder={config.placeholder}
              clearable
            />
          )}
        </div>
      ))}
    </div>
  );
};