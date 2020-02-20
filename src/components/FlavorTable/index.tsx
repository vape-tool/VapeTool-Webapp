import React from 'react';
import { Button, Form, Input, InputNumber, Popconfirm, Table } from 'antd';
import { Flavor } from '@vapetool/types';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/es/form';
import { WrappedFormUtils } from 'antd/es/form/Form';
import ButtonGroup from 'antd/es/button/button-group';
import { ConnectState } from '@/models/connect';
import { LiquidModelState } from '@/models/liquid';
import { Dispatch } from 'redux';

const EditableContext = React.createContext<FormComponentProps<string> | any>(null);

type Column = 'name' | 'manufacturer' | 'percentage' | 'price' | 'ratio';

interface EditableCellProps {
  editing: boolean;
  dataIndex: Column;
  title: string;
  flavor: Flavor;
  index: number;
}

const EditableCell: React.FC<EditableCellProps> = props => {
  const getInput = () => {
    switch (props.dataIndex) {
      case 'price':
        return <InputNumber min={0}/>;
      case 'ratio':
        return <InputNumber max={100} min={0}/>;
      case 'percentage':
        return <InputNumber max={100} min={0}/>;
      default:
      case 'manufacturer':
      case 'name':
        return <Input/>;
    }
  };

  const renderCell = ({ getFieldDecorator }: WrappedFormUtils<string>) => {
    const { editing, dataIndex, title, flavor, index, children, ...restProps } = props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: flavor[dataIndex],
            })(getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  return <EditableContext.Consumer>{renderCell}</EditableContext.Consumer>;
};

interface EditableTableProps extends FormComponentProps {
  liquid: LiquidModelState;
  dispatch: Dispatch;
}

const EditableTable: React.FC<EditableTableProps> = props => {
  const isEditing = (flavor: Flavor) => flavor.uid === props.liquid.editingFlavor;

  const cancel = () => {
    props.dispatch({
      type: 'liquid/editFlavor',
      payload: undefined,
    });
  };

  const remove = (uid: string) => {
    props.dispatch({
      type: 'liquid/removeFlavor',
      payload: uid,
    });
  };

  const save = (form: WrappedFormUtils<string>, uid: string) => {
    form.validateFields((error: any, row: any) => {
      if (error) {
        return;
      }
      props.dispatch({
        type: 'liquid/setFlavor',
        payload: { uid, row },
      });
      props.dispatch({
        type: 'liquid/editFlavor',
        payload: undefined,
      });
    });
  }

  const edit = (uid: string) => {
    props.dispatch({
      type: 'liquid/editFlavor',
      payload: uid,
    });
  };

  const components = {
    body: {
      cell: EditableCell,
    },
  };

  const columnsSchema: any[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '20%',
      editable: true,
    },
    {
      title: 'Manufacturer',
      dataIndex: 'manufacturer',
      width: '17%',
      editable: true,
    },
    {
      title: 'Percentage [%]',
      dataIndex: 'percentage',
      width: '17%',
      editable: true,
    },
    {
      title: 'Price per 10ml [$]',
      dataIndex: 'price',
      width: '17%',
      editable: true,
    },
    {
      title: 'PG Ratio [%]',
      dataIndex: 'ratio',
      width: '17%',
      editable: true,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (text: string, flavor: Flavor) => {
        const { editingFlavor } = props.liquid;
        const editable = isEditing(flavor);
        return editable ? (
          <span>
              <ButtonGroup>
                <EditableContext.Consumer>
                  {form => (
                    <Button
                      type="primary"
                      icon="check"
                      onClick={() => save(form, flavor.uid)}
                    />
                  )}
                </EditableContext.Consumer>
                <Button onClick={cancel} icon="close"/>
              </ButtonGroup>
            </span>
        ) : (
          <div>
            <ButtonGroup>
              <Button
                disabled={editingFlavor !== undefined}
                onClick={() => edit(flavor.uid)}
                icon="edit"
              />
              <Popconfirm title="Sure to remove?" onConfirm={() => remove(flavor.uid)}>
                <Button icon="delete"/>
              </Popconfirm>
            </ButtonGroup>
          </div>
        );
      },
    },
  ];


  const columns = columnsSchema.map(col => {
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
    <EditableContext.Provider value={props.form}>
      <Table
        components={components}
        bordered
        dataSource={props.liquid.currentLiquid.flavors}
        columns={columns}
        rowKey={flavor => flavor.uid}
        rowClassName={() => 'editable-row'}
        pagination={false}
      />
    </EditableContext.Provider>
  );
}

const FlavorTable = Form.create()(EditableTable);

export default connect(({ liquid }: ConnectState) => ({
  liquid,
}))(FlavorTable);
