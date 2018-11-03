import React, { Fragment, PureComponent } from 'react';
import { InputNumber, Table } from 'antd';
import { connect } from 'dva';
import EditForm from 'components/Rebue/EditForm';

// 添加与编辑的表单
@connect(({ loading }) => ({
  submitting: loading.models.pfmsys,
}))
@EditForm
export default class OnlOnlineNumberForm extends PureComponent {
  state = {
    onlOnlineSpec: [],
  };
  componentWillMount() {
    // 刷新系统
    this.props.dispatch({
      type: `onlonline/getById`,
      payload: {
        id: this.props.id,
      },
      callback: onlonline => {
        const specs = onlonline.record.onlineSpecList;
        specs.forEach(item => {
          item.appendCount = 0;
        });

        this.setState({
          onlOnlineSpec: specs,
        });
      },
    });
  }

  render() {
    const { record } = this.props;
    const { onlOnlineSpec } = this.state;

    const columns = [
      {
        title: '规格名称',
        dataIndex: 'onlineSpec',
      },
      {
        title: '已上线数量',
        render: (text, record) => {
          return record.onlineTotal + record.saleUnit;
        },
      },
      {
        title: '追加数量',
        width: '150px',
        render: (text, record) => {
          const { form } = this.props;
          return (
            <Fragment>
              <InputNumber
                defaultValue={record.appendCount}
                min={0}
                style={{ width: '80px' }}
                // 首格input要设置width不是默认的100%，否则会被换到下一行
                onChange={value => {
                  const sKey = `${record.id}`;
                  const append = {};
                  append[sKey] = {};
                  append[sKey].appendCount = value;
                  append[sKey].alreadyOnlineCount = record.onlineTotal;
                  // 注册form field
                  form.getFieldDecorator(sKey, { initialValue: [] });
                  form.setFieldsValue(append);
                }}
              />{' '}
              {record.saleUnit}
            </Fragment>
          );
        },
      },
    ];
    return (
      <Fragment>
        <div style={{ textAlign: 'center', fontSize: 20 }}>
          <span>{record.onlineTitle}</span>
        </div>
        <div style={{ margin: '20px 20px' }}>
          <Table rowKey="id" pagination={false} dataSource={onlOnlineSpec} columns={columns} />
        </div>
      </Fragment>
    );
  }
}
