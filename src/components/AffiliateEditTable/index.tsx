import React, { useState } from 'react';
import { Button, Form, Input, message, Popconfirm, Table } from 'antd';
import { connect } from 'dva';
import ButtonGroup from 'antd/es/button/button-group';
import { ConnectProps, ConnectState } from '@/models/connect';
import { Battery, Affiliate } from '@/types';
import NewAffiliateModal from '@/components/AffiliateEditTable/NewAffiliateModal';
import { dispatchSetAffiliate } from '@/models/batteries';
import {
  PlusOutlined,
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { i18nValidationRequired } from '@/utils/i18n';

type Column = 'name' | 'link';

interface EditableCellProps {
  editing: boolean;
  dataIndex: Column;
  title: React.ReactNode;
  affiliate: Affiliate;
  record: Affiliate;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = props => {
  const { editing, dataIndex, title, affiliate, index, children, ...restProps } = props;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
          rules={[{ required: true, message: i18nValidationRequired(title) }]}
        >
          <Input defaultValue={affiliate[dataIndex]} />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

interface EditableTableProps extends ConnectProps {
  selectedBattery?: Battery;
}

const EditableTable: React.FC<EditableTableProps> = props => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string>('');
  const isEditing = (affiliate: Affiliate) => affiliate.name === editingKey;

  const cancel = () => {
    setEditingKey('');
  };

  const remove = (name: string) => {
    dispatchSetAffiliate(props.dispatch, { name, link: null });
  };

  const showNewAffiliateModal = () => {
    props.dispatch({
      type: 'batteries/showNewAffiliateModal',
    });
  };

  const edit = (record: any) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const save = async () => {
    try {
      const row = await form.validateFields();
      dispatchSetAffiliate(props.dispatch, { ...row } as { name: string; link: string | null });
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
  const columnsSchema: any[] = [
    {
      title: <FormattedMessage id="misc.name" defaultMessage="Name" />,
      dataIndex: 'name',
      width: '10%',
      editable: true,
    },
    {
      title: <FormattedMessage id="misc.link" defaultMessage="Link" />,
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
              <Button type="primary" icon={<CheckOutlined />} onClick={save} />
              <Button onClick={cancel} icon={<CloseOutlined />} />
            </ButtonGroup>
          </span>
        ) : (
          <div>
            <ButtonGroup>
              <Button onClick={() => edit(affiliate.name)} icon={<EditOutlined />} />
              <Popconfirm
                title={
                  <FormattedMessage
                    id="misc.actions.sureRemove"
                    defaultMessage="Are you sure to remove?"
                  />
                }
                onConfirm={() => remove(affiliate.name)}
              >
                <Button icon={<DeleteOutlined />} />
              </Popconfirm>
            </ButtonGroup>
          </div>
        );
      },
    },
  ];
  const mergedColumns = columnsSchema.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (affiliate: Affiliate) => ({
        record: affiliate,
        affiliate,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(affiliate),
      }),
    };
  });

  return (
    <div>
      <Form form={form} component={false}>
        <Table
          components={components}
          bordered
          dataSource={Array.from(props.selectedBattery?.affiliate || []).map(([key, value]) =>
            Object.create({
              name: key,
              link: value,
            }),
          )}
          columns={mergedColumns}
          rowKey={affiliate => affiliate.name}
          rowClassName={() => 'editable-row'}
          pagination={false}
        />
      </Form>
      <Button
        icon={<PlusOutlined />}
        type="dashed"
        style={{ width: '100%' }}
        onClick={showNewAffiliateModal}
      >
        Add
      </Button>
      <NewAffiliateModal />
    </div>
  );
};

export default connect(({ batteries }: ConnectState) => ({
  selectedBattery: batteries.selectedBattery,
}))(EditableTable);
