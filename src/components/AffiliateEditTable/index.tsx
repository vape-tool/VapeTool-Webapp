import React from 'react';
import { Button, Form, Input, Popconfirm, Table } from 'antd';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/es/form';
import { WrappedFormUtils } from 'antd/es/form/Form';
import ButtonGroup from 'antd/es/button/button-group';
import { Dispatch } from 'redux';
import { ConnectState } from '@/models/connect';
import { Battery } from '@/types/Battery';
import { Affiliate } from '@/types/affiliate';
import NewAffiliateModal from '@/components/AffiliateEditTable/NewAffiliateModal';

const EditableContext = React.createContext<FormComponentProps<string> | any>(null);

type Column = 'name' | 'link';

interface EditableCellProps {
  editing: boolean;
  dataIndex: Column;
  title: string;
  affiliate: Affiliate;
  index: number;
}

class EditableCell extends React.Component<EditableCellProps> {
  renderCell = ({ getFieldDecorator }: WrappedFormUtils<string>) => {
    const { editing, dataIndex, title, affiliate, index, children, ...restProps } = this.props;
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
              initialValue: affiliate[dataIndex],
            })(<Input />)}
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
  selectedBattery: Battery;
  editingAffiliate: string;
  dispatch: Dispatch;
}

class EditableTable extends React.Component<EditableTableProps, {}> {
  private columns: any[];

  constructor(props: EditableTableProps) {
    super(props);
    this.columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        width: '10%',
        editable: true,
      },
      {
        title: 'Link',
        dataIndex: 'link',
        width: '60%',
        editable: true,
        render: (text: string, _: Affiliate) => (
          <a
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              display: 'inherit',
            }}
            href={text}
          >
            {text.substring(0, 30)}
          </a>
        ),
      },
      {
        title: 'Action',
        dataIndex: 'action',
        render: (text: string, affiliate: Affiliate) => {
          const editable = this.isEditing(affiliate);

          return editable ? (
            <span>
              <ButtonGroup>
                <EditableContext.Consumer>
                  {form => <Button type="primary" icon="check" onClick={() => this.save(form)} />}
                </EditableContext.Consumer>
                <Button onClick={this.cancel} icon="close" />
              </ButtonGroup>
            </span>
          ) : (
            <div>
              <ButtonGroup>
                <Button onClick={() => this.edit(affiliate.name)} icon="edit" />
                <Popconfirm title="Sure to remove?" onConfirm={() => this.remove(affiliate.name)}>
                  <Button icon="delete" />
                </Popconfirm>
              </ButtonGroup>
            </div>
          );
        },
      },
    ];
  }

  isEditing = (affiliate: Affiliate) => affiliate.name === this.props.editingAffiliate;

  cancel = () => {
    this.props.dispatch({
      type: 'batteries/editAffiliate',
      name: undefined,
    });
  };

  remove = (name: string) => {
    this.props.dispatch({
      type: 'batteries/setAffiliate',
      affiliate: { name, link: null },
    });
  };

  showNewAffiliateModal = () => {
    console.log('setAffiliate');
    this.props.dispatch({
      type: 'batteries/showNewAffiliateModal',
    });
  };

  edit(name: string) {
    this.props.dispatch({
      type: 'batteries/editAffiliate',
      name,
    });
  }

  save(form: WrappedFormUtils<string>) {
    form.validateFields((error: any, row: any) => {
      if (error) {
        return;
      }
      this.props.dispatch({
        type: 'batteries/setAffiliate',
        affiliate: { ...row },
      });
      this.cancel();
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
        onCell: (affiliate: Affiliate) => ({
          affiliate,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(affiliate),
        }),
      };
    });
    console.log(this.props.selectedBattery.affiliate);

    return (
      <div>
        <EditableContext.Provider value={this.props.form}>
          <Table
            components={components}
            bordered
            dataSource={Array.from(this.props.selectedBattery.affiliate || []).map(([key, value]) =>
              Object.create({
                name: key,
                link: value,
              }),
            )}
            columns={columns}
            rowKey={affiliate => affiliate.name}
            rowClassName={() => 'editable-row'}
            pagination={false}
          />
        </EditableContext.Provider>
        <Button
          icon="plus"
          type="dashed"
          style={{ width: '100%' }}
          onClick={this.showNewAffiliateModal}
        >
          Add
        </Button>
        <NewAffiliateModal />
      </div>
    );
  }
}

const AffiliateEditTable = Form.create()(EditableTable);

export default connect(({ batteries }: ConnectState) => ({
  selectedBattery: batteries.selectedBattery,
  editingAffiliate: batteries.editingAffiliate,
}))(AffiliateEditTable);
