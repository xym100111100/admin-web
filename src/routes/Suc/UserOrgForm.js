import React, { PureComponent } from 'react';
import { Form, Input, Row, Col, Radio, Button, List } from 'antd';
import { connect } from 'dva';
import EditForm from 'components/Rebue/EditForm';
import styles from './UserOrgForm.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

// 添加与编辑的表单
@connect(({ sucorg, sucuserorg }) => ({
  sucorg,
  sucuserorg,
}))
@EditForm
export default class OrgUserForm extends PureComponent {
  state = {
    options: {},
  };

  componentDidMount() {
    // 刷新系统
    this.props.dispatch({
      type: `sucorg/getByName`,
    });
  }

  // 重置from
  handleFormReset = () => {
    this.props.form.resetFields();
  };

  // 查询
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (err) return;
      this.handleReload({
        name: values.name,
      });
    });
  };

  onChange = e => {
    const { form } = this.props;
    form.setFieldsValue(e.target.value);
    this.setState({
      value: e.target.value,
    });
  };

  // 刷新
  handleReload(params) {
    if (params) {
      Object.assign(this.state.options, params);
    }
    const payload = this.state.options;

    // 刷新
    this.props.dispatch({
      type: `sucorg/getByName`,
      payload,
    });
  }

  // 用户搜索
  renderSearchForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="">
              {getFieldDecorator('name')(<Input placeholder="登录账号/昵称/微信昵称/QQ昵称/手机号码/QQ邮箱" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <span style={{ float: 'left', marginBottom: 24 }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 2 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { form, sucorg: { sucorg } } = this.props;
    return (
      <div className={styles.tableList}>
        <div className={styles.tableListOperator}>
          <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
          <List
            itemLayout="horizontal"
            dataSource={sucorg}
            renderItem={item => (
              <List.Item>
                {form.getFieldDecorator('id')(<Input type="hidden" />)}
                <List.Item.Meta
                  title={
                    <RadioGroup onChange={this.onChange} value={this.state.value}>
                      <Radio value={item}>{item.name}</Radio>
                    </RadioGroup>
                  }
                />
              </List.Item>
            )}
          />,
        </div>
      </div>
    );
  }
}
