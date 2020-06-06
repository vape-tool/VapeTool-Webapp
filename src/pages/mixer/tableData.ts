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
    render: (text: number) => Math.round(text),
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
    render: (text: number) => Math.round(text * 1000) / 1000,
    ellipsis: {
      showTitle: false,
    },
  },
];
