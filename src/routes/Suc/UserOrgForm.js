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
    console.log("sss")
    const { form } = this.props;
    form.setFieldsValue({
      'orgId': e.target.value.id
    });
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
              {getFieldDecorator('name')(<Input placeholder="输入组织名字" />)}
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
    let data = [];
    if (sucorg != undefined) {
      data = sucorg
    }
    return (
      <div className={styles.tableList}>
        {form.getFieldDecorator('id')(<Input type="hidden" />)}
        {form.getFieldDecorator('orgId')(<Input type="hidden" />)}
        <div className={styles.tableListOperator}>
          <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <RadioGroup value={this.state.value} onChange={this.onChange} >
                      <Radio value={item}>{item.name}</Radio>
                    </RadioGroup>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      </div>
    );
  }
}
