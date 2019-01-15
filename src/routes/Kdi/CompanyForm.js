import React, { Fragment, PureComponent } from 'react';
import { Form, Icon, Row, Col, Input, Select } from 'antd';
import { connect } from 'dva';
import EditForm from 'components/Rebue/EditForm';

const FormItem = Form.Item;
const { Option } = Select;

// 添加与编辑的表单
@connect(({ companydic,kdicompany, loading }) => ({ companydic,kdicompany, loading: loading.models.companydic || loading.models.kdicompany }))
@EditForm
export default class CompanyForm extends PureComponent {
  state = {
    see: 'password',
  };

  //获取快递公司字典
  componentDidMount() {
    this.props.dispatch({
      type: `companydic/list`,
    });
  }

  show = () => {
    if (this.state.see === 'password') {
      this.setState({ see: 'text' });
    } else {
      this.setState({ see: 'password' });
    }
  };


  render() {
    const { form, companydic } = this.props;
    let listItems = '';
    if (companydic.companydic.length !== 0) {
      listItems = companydic.companydic.map(items => {
        return (
          <Option value={items.id}
            key={items.id.toString()}>
            {items.companyName}
          </Option>
        );
      })
    }


    const types = {
      type: this.state.see,
    };
    return (
      <Fragment>
        <Form layout="inline">
          {form.getFieldDecorator('id')(<Input type="hidden" />)}
          {form.getFieldDecorator('orgId')(<Input type="hidden" />)}
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}  >
            <Col md={24} sm={24}  style={{textAlign:'center',marginTop:20,marginLeft:-4}}  >
              <FormItem label="名称" >
                {form.getFieldDecorator('companyDicId', {
                  rules: [
                    {
                      required: true,
                      message: '请输入快递公司的名称',
                    },
                  ],
                })(
                  <Select placeholder="请输入快递公司的名称" style={{ width: 250 }} >
                    {listItems}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={24} sm={24} style={{textAlign:'center',marginTop:20}}  >
              <FormItem label=" 帐号">
                {form.getFieldDecorator('companyAccount', {})(<Input placeholder="请输入快递公司帐号" style={{ width: 250 }} />)}
              </FormItem>
            </Col>
            <Col md={18} sm={24} push={3} style={{marginTop:20,}}   >
              <FormItem label="密码" style={{marginLeft:16}}>
                {form.getFieldDecorator('companyPwd', {})(<Input placeholder="请输入快递公司密码" {...types} style={{ width: 250 }} />)}
              </FormItem>
            </Col>
            <Col md={2} sm={24} style={{marginTop:30}}   >
              <a onClick={() => this.show()}  >
                <Icon type="eye" />
              </a>
            </Col>
            <Col md={24} sm={24} style={{textAlign:'center',marginTop:20}}  >
              <FormItem label="支付方式" style={{marginLeft:-38}} >
                {form.getFieldDecorator('payType', {
                 
                })(
                  <Select placeholder="请选择支付类型" style={{ width: 250 }}>
                    <Option value="1">现付</Option>
                    <Option value="2">到付</Option>
                    <Option value="3">月结</Option>
                    <Option value="4">第三方付</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={24} sm={24}  style={{marginTop:10}}  >
              <span>温馨提示:如何您未已快递公司对接只需要选择快递公司名称即可，其他输入框留空或清空。</span>
          </Col>
          </Row>
        </Form>
      </Fragment>
    );
  }
}
