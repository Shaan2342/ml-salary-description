


import { Table } from 'antd';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const App = () => {
  const [columns, setColumns] = useState([
    {
      title: 'year',
      dataIndex: 'year',
    },
    {
      title: 'Total Jobs',
      dataIndex: 'totalJobs',
      sorter: (a, b) => a.totalJobs - b.totalJobs,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Average Salary in USD',
      dataIndex: 'averageSalary',
      sorter: (a, b) => a.averageSalary - b.averageSalary,
      sortDirections: ['ascend', 'descend'],
    },
  ]);

  const [dataSource, setDataSource] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [showLineGraph, setShowLineGraph] = useState(false);
  const [jobTitles, setJobTitles] = useState([]);
  const [showJobTitlesTable, setShowJobTitlesTable] = useState(false);

  useEffect(() => {
    fetch("https://script.googleusercontent.com/macros/echo?user_content_key=uoxCAAHW3ynMRSG-FirWc3ASvRZNP_0SbkgzS9LtXQSu17PtGOVyY9CguziWKQAv3zYzfrSePaRmvAAlJ6kcYcL1pVDt3Jtvm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnHz96Gb0risXwS2YrID0koJ3diFqiitbsG7tTyDeaa7geSot4UezgfoN6IQ5ij_42RZW-ql0_UFCHwHt2UqTlYj4qVajw3rPig&lib=MbdOu--odwGv7ZrWmDY8cdur320V_H3uV")
      .then((res) => res.json())
      .then((result) => {
        setDataSource(result.data);
      });
  }, []);

  const JobTrendChart = () => {
    const data = dataSource.map((item) => ({ year: item.year, totalJobs: item.totalJobs }));

    const handleGraphClick = (event) => {
      if (event.target === event.currentTarget) {
        setShowLineGraph(false);
      }
    };

    return (
      <LineChart width={500} height={300} data={data} onClick={handleGraphClick}>
        <Line type="monotone" dataKey="totalJobs" stroke="#8884d8" />
        <XAxis dataKey="year" />
        <YAxis />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <Tooltip />
      </LineChart>
    );
  };

  const YearlyStatsTable = ({ selectedYear }) => {
    const yearlyStats = dataSource.find((item) => item.year === selectedYear);

    const columns = [
      {
        title: 'Year',
        dataIndex: 'year',
        sorter: (a, b) => a.year - b.year,
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Total Jobs',
        dataIndex: 'totalJobs',
        sorter: (a, b) => a.totalJobs - b.totalJobs,
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Average Salary (USD)',
        dataIndex: 'averageSalary',
        sorter: (a, b) => a.averageSalary - b.averageSalary,
        sortDirections: ['ascend', 'descend'],
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={[yearlyStats]}
      />
    );
  };

  const JobTitlesTable = ({ jobTitles }) => {
    const columns = [
      {
        title: 'Job Title',
        dataIndex: 'jobTitle',
        sorter: (a, b) => a.jobTitle.localeCompare(b.jobTitle),
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: 'Count',
        dataIndex: 'count',
        sorter: (a, b) => a.count - b.count,
        sortDirections: ['ascend', 'descend'],
      },
    ];

    const handleTableClick = () => {
      setShowJobTitlesTable(false);
    };

    return (
      <Table
        columns={columns}
        dataSource={jobTitles}
        onRow={(record) => {
          return {
            onClick: handleTableClick,
          };
        }}
      />
    );
  };

  const handleRowClick = (year) => {
    setSelectedYear(year);
    setShowLineGraph(true);
    setShowJobTitlesTable(true);
    const yearlyData = dataSource.find((item) => item.year === year);
    const jobTitlesArray = yearlyData.jobTitles.map((jobTitle) => ({ jobTitle: jobTitle.jobTitle, count: jobTitle.count }));
    setJobTitles(jobTitlesArray);
  };

  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataSource}
        scroll={{ y: 500 }}
        onChange={(pagination, filters, sorter) => {
          console.log('Sorter:', sorter);
        }}
        onRow={(record) => {
          return {
            onClick: () => handleRowClick(record.year),
          };
        }}
      />
      {showLineGraph && (
        <JobTrendChart />
      )}
      {showJobTitlesTable && (
        <JobTitlesTable jobTitles={jobTitles} />
      )}
    </div>
  );
};

export default App;