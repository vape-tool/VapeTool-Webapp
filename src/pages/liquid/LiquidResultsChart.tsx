import React from 'react';
import Chart from 'react-apexcharts';
import { Result } from '@vapetool/types';
import { roundWithPrecision } from '@/utils/utils';

export interface LiquidResultsChartProps {
  results: Result[];
}

const LiquidResultsChart: React.FC<LiquidResultsChartProps> = ({ results }) => {
  const options = {
    labels: results.map(r => r.name),
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 250,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  const series = results.map(r => roundWithPrecision(r.percentage, 2));

  return <Chart options={options} series={series} type="donut" width={380} />;
};

export default LiquidResultsChart;
