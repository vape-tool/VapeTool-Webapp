import React from 'react';
import { Button, Form, Input, Popconfirm, Table } from 'antd';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/es/form';
import { WrappedFormUtils } from 'antd/es/form/Form';
import ButtonGroup from 'antd/es/button/button-group';
import { Dispatch } from 'redux';
import { ConnectState } from '@/models/connect';
import { Battery, Affiliate } from '@/types';
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

const EditableCell: React.FC<EditableCellProps> = props => {
  const renderCell = ({ getFieldDecorator }: WrappedFormUtils<string>) => {
    const { editing, dataIndex, title, affiliate, index, children, ...restProps } = props;
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

  return <EditableContext.Consumer>{renderCell}</EditableContext.Consumer>;
};

interface EditableTableProps extends FormComponentProps {
  selectedBattery: Battery;
  editingAffiliate: string;
  dispatch: Dispatch;
}

const EditableTable: React.FC<EditableTableProps> = props => {
  const isEditing = (affiliate: Affiliate) => affiliate.name === props.editingAffiliate;

  const cancel = () => {
    props.dispatch({
      type: 'batteries/editAffiliate',
      name: undefined,
    });
  };

  const remove = (name: string) => {
    props.dispatch({
      type: 'batteries/setAffiliate',
      affiliate: { name, link: null },
    });
  };

  const showNewAffiliateModal = () => {
    props.dispatch({
      type: 'batteries/showNewAffiliateModal',
    });
  };

  const edit = (name: string) => {
    props.dispatch({
      type: 'batteries/editAffiliate',
      name,
    });
  };

  const save = (form: WrappedFormUtils<string>) => {
    form.validateFields((error: any, row: any) => {
      if (error) {
        return;
      }
      props.dispatch({
        type: 'batteries/setAffiliate',
        affiliate: { ...row },
      });
      cancel();
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
      width: '10%',
      editable: true,
    },
    {
      title: 'Link',
      dataIndex: 'link',
      width: '60%',
      editable: true,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (text: string, affiliate: Affiliate) => (
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
        const editable = isEditing(affiliate);

        return editable ? (
          <span>
            <ButtonGroup>
              <EditableContext.Consumer>
                {form => <Button type="primary" icon="check" onClick={() => save(form)} />}
              </EditableContext.Consumer>
              <Button onClick={cancel} icon="close" />
            </ButtonGroup>
          </span>
        ) : (
          <div>
            <ButtonGroup>
              <Button onClick={() => edit(affiliate.name)} icon="edit" />
              <Popconfirm title="Sure to remove?" onConfirm={() => remove(affiliate.name)}>
                <Button icon="delete" />
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
      onCell: (affiliate: Affiliate) => ({
        affiliate,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(affiliate),
      }),
    };
  });

  return (
    <div>
      <EditableContext.Provider value={props.form}>
        <Table
          components={components}
          bordered
          dataSource={Array.from(props.selectedBattery.affiliate || []).map(([key, value]) =>
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
      <Button icon="plus" type="dashed" style={{ width: '100%' }} onClick={showNewAffiliateModal}>
        Add
      </Button>
      <NewAffiliateModal />
    </div>
  );
};

const AffiliateEditTable = Form.create()(EditableTable);

export default connect(({ batteries }: ConnectState) => ({
  selectedBattery: batteries.selectedBattery,
  editingAffiliate: batteries.editingAffiliate,
}))(AffiliateEditTable);
