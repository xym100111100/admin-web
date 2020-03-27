import React, { Fragment, PureComponent } from 'react';
import { Form, Icon, Row, Col, Input, Select } from 'antd';
import { connect } from 'dva';
import EditForm from 'components/Rebue/EditForm';

const FormItem = Form.Item;
const { Option } = Select;

// 添加与编辑的表单
@connect(({ slrshop,kdisender, kdicompany, loading }) => ({ kdisender,slrshop, kdicompany, loading: loading.models.kdisender || loading.models.slrshop || loading.models.kdicompany }))
@EditForm
export default class ShopForm extends PureComponent {
  state = {
    shopList: [],
  };

  componentDidMount() {
    console.log(this.props);
    //获取店铺集合
    this.props.dispatch({
      type: this.props.moduleCode+`/shopList`,
      callback: data => {
        if (data !== undefined && data.length !== 0) {
          this.setState({
            shopList: data,
          })
        }
      },
    });
  }




  render() {
    const { form } = this.props;
    
    let listItems = '';
    //默认值
    let defaultItems;
    if (this.state.shopList.length !== 0) {
      listItems = this.state.shopList.map(items => {
        if(items.id===this.props.record.initShopId){
          defaultItems=items.id + '/' + items.shopName;
        }
        return (
          <Option value={items.id + '/' + items.shopName}
            key={items.id.toString()}>
            {items.shopName}
          </Option>
        );
      })
    }

    return (
      <Fragment>
        <Form layout="inline">
          {form.getFieldDecorator('id')(<Input type="hidden" />)}
          <Row gutter={{ md: 6, lg: 24, xl: 48 }} style={{ textAlign: 'center' }}   >
            <Col md={24} sm={24} style={{ marginBottom: 5 }}  >
              温馨提示：每个{this.props.remarks}只能默认一个店铺，如需每个{this.props.remarks}都设置默认使用的店铺请添加多个{this.props.remarks}。
          </Col>
            <Col md={24} sm={24}   >
              <FormItem label="名称" >
                {form.getFieldDecorator('shopId', {
                  rules: [
                    {
                      required: true,
                      message: '请选择默认使用的店铺',
                    },
                  ],
                  initialValue: defaultItems,
                })(
                  <Select placeholder="请选择默认使用的店铺" style={{ width: 250 }} >
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
