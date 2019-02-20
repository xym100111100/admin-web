import React, { Fragment, PureComponent } from 'react';
import { Form, Radio, Row, Col, Input } from 'antd';
import { connect } from 'dva';
import EditForm from 'components/Rebue/EditForm';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

// 添加与编辑的表单
@connect(({ kditemplate, kdicompany, loading }) => ({ kditemplate, kdicompany, loading: loading.models.kditemplate || loading.models.kdicompany }))
@EditForm
export default class TemplateForm extends PureComponent {
  state = {
    template: [],
    initTemplate:0,
  };

  //获取快递公司字典
  componentDidMount() {
    const { record } = this.props;
    if(record.templateDicId !=="0" && record.templateDicId !==undefined){
        this.setState({
          initTemplate:record.templateDicId 
        })
    }
    this.props.dispatch({
      type: `kditemplate/listTemplate`,
      payload: { companyDicId: record.companyDicId },
      callback: data => {
        if (data !== undefined && data.length !== 0) {
          this.setState({
            template: data,
          })
        }
      },
    });
  }


  /**
   * 显示模板
   */
  showTempLate = (data) => {

    if (data !== undefined && data !== '' && data.length > 0) {
      const listItems = data.map((items, i) => {
        return (
          <Radio key={items.id.toString()} value={items.id} style={{  verticalAlign:'middle',textAlign:'center'}} >
              <img style={{ height: 150 }} src={items.imgPath} />
              <br/>
              <span style={{marginLeft:40}} >{items.name} </span>
          </Radio>
        )
      });
      return listItems;
    }
  }


  render() {
    const { form } = this.props;
    return (
      <Fragment>
        <Form layout="inline">
        {form.getFieldDecorator('id')(<Input type="hidden" />)}
          {form.getFieldDecorator('orgId')(<Input type="hidden" />)}
          {form.getFieldDecorator('templateId')(<Input type="hidden" />)}
          {form.getFieldDecorator('isDefault', {
                initialValue: false,
              })(<Input type="hidden" />)}
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}  >
            <Col md={24} sm={24} style={{ marginTop: 10 }}  >
              <FormItem   >
                {form.getFieldDecorator('templateDicId', {
                   initialValue: this.state.initTemplate,
                })(<RadioGroup >
                  {this.showTempLate(this.state.template)}
                </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Fragment>
    );
  }
}
