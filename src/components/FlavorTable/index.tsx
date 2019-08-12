import React from 'react';
import { Button, Form, Input, InputNumber, Popconfirm, Table } from 'antd';
import { Flavor } from '@vapetool/types';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/es/form';
import { WrappedFormUtils } from 'antd/es/form/Form';
import { ConnectState, Dispatch } from '@/models/connect';
import { LiquidModelState } from '@/models/liquid';

const EditableContext = React.createContext<FormComponentProps<string> | any>(null);

interface EditableCellProps {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: 'string' | 'number';
  flavor: Flavor;
  index: number;
}

class EditableCell extends React.Component<EditableCellProps> {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber/>;
    }
    return <Input/>;
  };

  renderCell = ({ getFieldDecorator }: WrappedFormUtils<string>) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      flavor,
      index,
      children,
      ...restProps
    } = this.props;
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
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

interface EditableTableProps extends FormComponentProps {
  liquid: LiquidModelState
  dispatch: Dispatch
}

class EditableTable extends React.Component<EditableTableProps, {}> {
  private columns: any[];

  constructor(props: EditableTableProps) {
    super(props);
    this.columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        width: '25%',
        editable: true,
      },
      {
        title: 'Manufacturer',
        dataIndex: 'manufacturer',
        width: '5%',
        editable: true,
      },
      {
        title: 'Percentage [%]',
        dataIndex: 'percentage',
        width: '15%',
        editable: true,
      },
      {
        title: 'Price [$]',
        dataIndex: 'price',
        width: '15%',
        editable: true,
      },
      {
        title: 'Amount [ml]',
        dataIndex: 'amount',
        width: '15%',
        editable: true,
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        render: (text: string, flavor: Flavor) => {
          const { editingFlavor } = this.props.liquid;
          const editable = this.isEditing(flavor);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <Button
                    onClick={() => this.save(form, flavor.uid)}
                    style={{ marginRight: 8 }}
                  >
                    Save
                  </Button>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel()}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <Button disabled={editingFlavor !== undefined} onClick={() => this.edit(flavor.uid)}>
              Edit
            </Button>
          );
        },
      },
    ];
  }

  isEditing = (flavor: Flavor) => flavor.uid === this.props.liquid.editingFlavor;

  cancel = () => {
    this.props.dispatch({
      type: 'liquid/editFlavor',
      payload: undefined,
    });
  };

  save(form: WrappedFormUtils<string>, uid: string) {
    form.validateFields((error: any, row: any) => {
      if (error) {
        return;
      }
      this.props.dispatch({
        type: 'liquid/setFlavor',
        payload: { uid, row },
      });
      this.props.dispatch({
        type: 'liquid/editFlavor',
        payload: undefined,
      });
    });
  }

  edit(uid: string) {
    this.props.dispatch({
      type: 'liquid/editFlavor',
      payload: uid,
    });
  }

  render() {
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (flavor: Flavor) => ({
          flavor,
          inputType: col.dataIndex === 'name' || col.dataIndex === 'manufacturer' ? 'text' : 'number',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(flavor),
        }),
      };
    });

    return (
      <EditableContext.Provider value={this.props.form}>
        <Table
          components={components}
          bordered
          dataSource={this.props.liquid.currentLiquid.flavors}
          columns={columns}
          rowClassName={() => 'editable-row'}
          pagination={{
            onChange: this.cancel,
          }}
        />
      </EditableContext.Provider>
    );
  }
}

const FlavorTable = Form.create()(EditableTable);

export default connect(({ liquid }: ConnectState) => ({
  liquid,
}))(FlavorTable);
