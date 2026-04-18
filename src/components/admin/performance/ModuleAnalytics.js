import React from 'react';
import Table from '../../common/Table';

const ModuleAnalytics = ({ data = [], loading = false }) => {
  // Group data by module
  const moduleData = {};

  data.forEach((item) => {
    if (!moduleData[item.moduleName]) {
      moduleData[item.moduleName] = {
        moduleName: item.moduleName,
        totalAttempts: 0,
        passedAttempts: 0,
        avgScore: 0,
        totalScore: 0,
      };
    }
    moduleData[item.moduleName].totalAttempts += 1;
    if (item.status === 'pass') {
      moduleData[item.moduleName].passedAttempts += 1;
    }
    moduleData[item.moduleName].totalScore += item.percentage || 0;
  });

  const modules = Object.values(moduleData).map((mod) => ({
    ...mod,
    avgScore: Math.round(mod.totalScore / mod.totalAttempts) || 0,
    passRate: mod.totalAttempts > 0 ? Math.round((mod.passedAttempts / mod.totalAttempts) * 100) : 0,
  }));

  const columns = [
    {
      key: 'moduleName',
      label: 'Module',
      sortable: true,
    },
    {
      key: 'totalAttempts',
      label: 'Total Attempts',
      sortable: true,
    },
    {
      key: 'passedAttempts',
      label: 'Passed',
      sortable: true,
    },
    {
      key: 'passRate',
      label: 'Pass Rate',
      sortable: true,
      render: (value) => `${value || 0}%`,
    },
    {
      key: 'avgScore',
      label: 'Average Score',
      sortable: true,
      render: (value) => `${value || 0}%`,
    },
  ];

  return (
    <div className="module-analytics">
      <Table
        columns={columns}
        data={modules}
        loading={loading}
        pageSize={10}
        emptyMessage="No module data available"
      />
    </div>
  );
};

export default ModuleAnalytics;
