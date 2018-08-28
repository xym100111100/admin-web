import { Table } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
const dataSource = [
  {
    key: '1',
    id: '1234556',
    senderName: '微薄利',
    senderTel: '1111111',
    senderMobile: '4516135846',
    senderPostCode: '530000',
    senderaddr: ['广西壮族自治区', '南宁市', '西乡塘区'],
    senderAddress: '华尔街工谷',
  },
  {
    key: '2',
    id: '1234556',
    senderName: '微薄利',
    senderTel: '22222',
    senderMobile: '4516135846',
    senderPostCode: '530000',
    senderaddr: ['广西壮族自治区', '南宁市', '西乡塘区'],
    senderAddress: '华尔街工谷',
  },
  {
    key: '3',
    id: '1234556',
    senderName: '微薄利',
    senderTel: '333333',
    senderMobile: '4516135846',
    senderPostCode: '530000',
    senderaddr: ['广西壮族自治区', '南宁市', '西乡塘区'],
    senderAddress: '华尔街工谷',
  },
  {
    key: '4',
    id: '1234556',
    senderName: '微薄利',
    senderTel: '444444',
    senderMobile: '4516135846',
    senderPostCode: '530000',
    senderaddr: ['广西壮族自治区', '南宁市', '西乡塘区'],
    senderAddress: '华尔街工谷',
  },
];

const columns = [
  {
    title: '名字',
    dataIndex: 'senderName',
    align: 'center',
    width: '80px',
  },
  {
    title: '地址',
    align: 'center',
    dataIndex: 'senderAddress',
  },
  {
    title: '操作',
    align: 'center',
    dataIndex: 'operat',
    width: '80px',
    render: () => <a href="javascript:;">删除</a>,
  },
];
@connect(({ kdisender, loading }) => ({ kdisender, loading: loading.models.kdisender }))
export default class KdiSenderSelect extends PureComponent {
  constructor() {
    super();
  }

  state = {
    selectedRowKeys: [],
  };

  selectRow = record => {
    const payload = record;
    const selectedRowKeys = [...this.state.selectedRowKeys];
    selectedRowKeys.splice(0, selectedRowKeys.length);
    selectedRowKeys.push(record.key);
    this.setState({ selectedRowKeys });
    // 刷新寄件人信息
    this.props.dispatch({
      type: `kdisender/selectSender`,
      payload,
    });
  };

  onSelectedRowKeysChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  componentDidMount() {
    // this.handleReload();
  }

  onChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectedRowKeysChange,
      type: 'radio',
    };

    return (
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: 400, y: 100 }}
        rowKey={name}
        onRow={record => ({
          onClick: () => {
            this.selectRow(record);
          },
        })}
      />
    );
  }
}
