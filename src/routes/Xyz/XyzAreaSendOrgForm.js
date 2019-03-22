import React, { Fragment, PureComponent } from 'react';
import { Form, Row, Col, Select, Input } from 'antd';
import { connect } from 'dva';
import EditForm from 'components/Rebue/EditForm';
const Option = Select.Option;
const FormItem = Form.Item;

// 添加与编辑的表单
@connect(({ xyzareasendorg, user, sucorg, loading }) => ({ xyzareasendorg, user, sucorg, loading: loading.models.sucorg || loading.models.xyzareasendorg || loading.models.user }))

@EditForm
export default class XyzAreaSendOrgForm extends PureComponent {
  constructor() {
    super();
    this.moduleCode = 'xyzareasendorg';

  }
  state = {
    orgData: []
  }
  //初始化
  componentDidMount() {
    this.props.dispatch({
      type: `${this.moduleCode}/listOrgs`,
      payload: {},
      callback: (data) => {
        console.log(data);
        this.setState({
          orgData: data,
        })
      },
    });

  }



  render() {
    const { form, record } = this.props;


    const listItems = this.state.orgData.map(items => {
      return (
        <Option value={items.id} key={items.id.toString()}>
          {items.name}
        </Option>
      )

    })


    return (
      <Fragment>
        <Form layout="inline">
          {form.getFieldDecorator('id')(<Input type="hidden" />)}
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
            <Col push={2} md={20} sm={24}  >
              <FormItem label="组织名称" >
                {form.getFieldDecorator('sendOrg', {
                  rules: [
                    {
                      required: true,
                      message: '请选择组织',
                    },
                  ],
                })(
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="请搜索或选择组织"
                    optionFilterProp="children"
                    maxTagCount={2}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {listItems}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Fragment>
    );
  }
}
