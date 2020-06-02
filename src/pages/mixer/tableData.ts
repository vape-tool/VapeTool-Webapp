export const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Percentage [%]',
    dataIndex: 'percentage',
    key: 'percentage',
  },
  {
    title: 'Amount [ml]',
    dataIndex: 'amount',
    key: 'amount',
    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: 'Drops',
    dataIndex: 'drops',
    key: 'drops',
    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: 'Weight [g]',
    dataIndex: 'weight',
    key: 'weight',
    ellipsis: {
      showTitle: false,
    },
  },
];

export const data = [
  {
    key: '1',
    name: 'Base',
    percentage: 32,
    amount: 10,
    drops: 400,
    weight: 10,
  },
  {
    key: '2',
    name: 'Premix',
    percentage: 32,
    amount: 10,
    drops: 400,
    weight: 10,
  },
  {
    key: '3',
    name: 'Total',
    percentage: 32,
    amount: 10,
    drops: 400,
    weight: 10,
  },
];
