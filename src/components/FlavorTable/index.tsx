import React, { useState } from 'react';
import { Button, Form, Input, InputNumber, message, Popconfirm, Table } from 'antd';
import { Flavor } from '@vapetool/types';
import { connect, FormattedMessage } from 'umi';
import ButtonGroup from 'antd/es/button/button-group';
import { ConnectProps, ConnectState } from '@/models/connect';
import { LiquidModelState, dispatchSetFlavor } from '@/models/liquid';
import { DeleteOutlined, EditOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';

type Column = 'name' | 'manufacturer' | 'percentage' | 'price' | 'ratio';

interface EditableCellProps {
  editing: boolean;
  dataIndex: Column;
  title: string;
  flavor: Flavor;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = props => {
  const getInput = (initialValue?: any) => {
    switch (props.dataIndex) {
      case 'price':
        return <InputNumber min={0} defaultValue={initialValue} />;
      case 'ratio':
        return <InputNumber max={100} min={0} defaultValue={initialValue} />;
      case 'percentage':
        return <InputNumber max={100} min={0} defaultValue={initialValue} />;
      default:
      case 'manufacturer':
      case 'name':
        return <Input defaultValue={initialValue} />;
    }
  };

  const { editing, dataIndex, title, flavor, index, children, ...restProps } = props;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {getInput(flavor[dataIndex])}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

interface EditableTableProps extends ConnectProps {
  liquid: LiquidModelState;
}

const EditableTable: React.FC<EditableTableProps> = props => {
  const { liquid, dispatch } = props;
  const [form] = Form.useForm();
  const [editingFlavor, setEditingFlavor] = useState('');
  const isEditing = (flavor: Flavor) => flavor.uid === editingFlavor;

  const cancel = () => setEditingFlavor('');

  const edit = (flavor: Flavor) => {
    form.setFieldsValue({ ...flavor });
    setEditingFlavor(flavor.uid);
  };

  const remove = (uid: string) => {
    if (editingFlavor === uid) {
      cancel();
    }
    dispatch({
      type: 'liquid/removeFlavor',
      payload: uid,
    });
  };

  const save = async (uid: string) => {
    try {
      const row = await form.validateFields();
      dispatchSetFlavor(dispatch, uid, row);
      cancel();
    } catch (e) {
      message.error(e.message);
    }
  };

  const components = {
    body: {
      cell: EditableCell,
    },
  };

  const columns: any[] = [
    {
      title: <FormattedMessage id="misc.name" defaultMessage="Name" />,
      dataIndex: 'name',
      width: '20%',
      editable: true,
    },
    {
      title: <FormattedMessage id="misc.manufacturer" defaultMessage="Manufacturer" />,
      dataIndex: 'manufacturer',
      width: '17%',
      editable: true,
    },
    {
      title: <FormattedMessage id="misc.units.long.percentage" defaultMessage="Percentage [%]" />,
      dataIndex: 'percentage',
      width: '17%',
      editable: true,
    },
    {
      title: <FormattedMessage id="liquid.pricePer10ml" defaultMessage="Price per 10ml" />,
      dataIndex: 'price',
      width: '17%',
      editable: true,
    },
    {
      title: <FormattedMessage id="liquid.pgRatioPerc" defaultMessage="PG Ratio [%]" />,
      dataIndex: 'ratio',
      width: '17%',
      editable: true,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (text: string, flavor: Flavor) => {
        const editable = isEditing(flavor);
        return editable ? (
          <span>
            <ButtonGroup>
              <Button type="primary" icon={<CheckOutlined />} onClick={() => save(flavor.uid)} />
              <Button onClick={cancel} icon={<CloseOutlined />} />
            </ButtonGroup>
          </span>
        ) : (
          <div>
            <ButtonGroup>
              <Button
                disabled={editingFlavor !== ''}
                onClick={() => edit(flavor)}
                icon={<EditOutlined />}
              />
              <Popconfirm title="Sure to remove?" onConfirm={() => remove(flavor.uid)}>
                <Button icon={<DeleteOutlined />} />
              </Popconfirm>
            </ButtonGroup>
          </div>
        );
      },
    },
  ];

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (flavor: Flavor) => ({
        flavor,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(flavor),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        components={components}
        bordered
        dataSource={liquid.currentLiquid.flavors}
        columns={mergedColumns}
        rowKey={flavor => flavor.uid}
        rowClassName="editable-row"
        pagination={false}
      />
    </Form>
  );
};

export default connect(({ liquid }: ConnectState) => ({
  liquid,
}))(EditableTable);
