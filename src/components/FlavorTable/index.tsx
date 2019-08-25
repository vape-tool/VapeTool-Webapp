import React from 'react';
import { Button, Form, Input, InputNumber, Popconfirm, Table } from 'antd';
import { Flavor } from '@vapetool/types';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/es/form';
import { WrappedFormUtils } from 'antd/es/form/Form';
import ButtonGroup from 'antd/es/button/button-group';
import { ConnectState, Dispatch } from '@/models/connect';
import { LiquidModelState } from '@/models/liquid';

const EditableContext = React.createContext<FormComponentProps<string> | any>(null);

type Column = 'name' | 'manufacturer' | 'percentage' | 'price' | 'ratio';

interface EditableCellProps {
  editing: boolean;
  dataIndex: Column;
  title: string;
  flavor: Flavor;
  index: number;
}

class EditableCell extends React.Component<EditableCellProps> {
  getInput = () => {
    switch (this.props.dataIndex) {
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

  renderCell = ({ getFieldDecorator }: WrappedFormUtils<string>) => {
    const {
      editing,
      dataIndex,
      title,
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
        width: '20%',
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
          const { editingFlavor } = this.props.liquid;
          const editable = this.isEditing(flavor);
          return editable ? (
            <span>
              <ButtonGroup>
              <EditableContext.Consumer>
                {form => (
                  <Button
                    type="primary"
                    icon="check"
                    onClick={() => this.save(form, flavor.uid)}
                  />
                )}
              </EditableContext.Consumer>
              <Button onClick={this.cancel} icon="close"/>
              </ButtonGroup>
            </span>
          ) : (
            <div>
              <ButtonGroup>
                <Button disabled={editingFlavor !== undefined} onClick={() => this.edit(flavor.uid)} icon="edit"/>
                <Popconfirm title="Sure to remove?" onConfirm={() => this.remove(flavor.uid)}>
                  <Button icon="delete"/>
                </Popconfirm>
              </ButtonGroup>
            </div>
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

  remove = (uid: string) => {
    this.props.dispatch({
      type: 'liquid/removeFlavor',
      payload: uid,
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
          rowKey={flavor => flavor.uid}
          rowClassName={() => 'editable-row'}
          pagination={false}
        />
      </EditableContext.Provider>
    );
  }
}

const FlavorTable = Form.create()(EditableTable);

export default connect(({ liquid }: ConnectState) => ({
  liquid,
}))(FlavorTable);
