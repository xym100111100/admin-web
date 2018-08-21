import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Button, Table, Select } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SenderInfoForm from './SenderInfoForm';
import ReceiverInfoForm from './ReceiverInfoForm';
import KdiSenderSelect from './KdiSenderSelect';
import KdiSenderList from './KdiSenderList';
import kdisender from '../../models/kdisender';
import KdiCompany from 'components/Rebue/KdiCompany';
import styles from './SysMng.less';

@connect(({ kdieorder, kdisender,user, loading }) => ({ kdieorder, kdisender, user,loading: loading.models.kdieorder }))
@Form.create()
export default class KdiEorder extends PureComponent {
  constructor() {
    super();
    this.moduleCode = 'kdieorder';
  }

  state = {
    options: {},
    record: {},
    orderId:Date.parse(new Date()),
  };

  componentDidMount() {
    this.handleReload();
  }

  getSender = (ref) => {
    this.SenderInfo = ref
  }

  getReceiver = (ref) => {
    this.ReceiverInfo = ref
  }

  getShipper = (ref) => {
    this.Shipper = ref
  }

  selectSenderInfo(params) {
    const { id, moduleCode, ...state } = Object.assign(defaultParams, params);
    this.props.dispatch({
      type: `${moduleCode}/getById`,
      payload: { id },
      callback: data => {
        state.editFormRecord = data.record;
        this.setState(state);
      },
    });
  }

  // 获取默认发件人
  handleReload(params) {
    if (params) {
      this.state.options = params;
    }
    const payload = this.state;
    // 刷新
    this.props.dispatch({
      type: `kdisender/getDefaultSender`,
      payload,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  };

  kdiEorder = () => {
    const {user} = this.props;
    let organizeId = user.currentUser.organizeId;
    console.info(organizeId);
    this.props.form.validateFields((err, values) => {
      if (err) return;
      let eorderParam = { shipperId: undefined, shipperName: undefined, shipperCode: undefined, orderId: this.state.orderId, organizeId: organizeId };
      console.info(eorderParam.orderId);
      let shipperInfo = values.shipperCode.split('/');
      eorderParam.shipperId = shipperInfo[0];
      eorderParam.shipperName = shipperInfo[1];
      eorderParam.shipperCode = shipperInfo[2];
      this.SenderInfo.componentDidMount;
      this.ReceiverInfo.componentDidMount;
      this.SenderInfo.props.form.validateFields((err, sendervalues) => {
        console.info(eorderParam);
        if (err) return;
        sendervalues.senderProvince = sendervalues.senderaddr[0];
        sendervalues.senderCity = sendervalues.senderaddr[1];
        sendervalues.senderExpArea = sendervalues.senderaddr[2];
        // eorderParam = { ...sendervalues };
        Object.assign(eorderParam, sendervalues);
        console.info(eorderParam);
        this.ReceiverInfo.props.form.validateFields((err, receivervalues) => {
          if (err) return;
          receivervalues.receiverProvince = receivervalues.receiveraddr[0];
          receivervalues.receiverCity = receivervalues.receiveraddr[1];
          receivervalues.receiverExpArea = receivervalues.receiveraddr[2];
          Object.assign(eorderParam, receivervalues);
          console.info(eorderParam);
          let printWindow;
          let newTimeStamp;
          this.props.dispatch({
            type: 'kdieorder/eorder',
            payload: eorderParam,
            callback: data => {
              const printPage = data.printPage;
              printWindow = window.open('','_blank');
              printWindow.document.body.innerHTML = printPage;
              printWindow.print();
              printWindow.close();
              newTimeStamp =  Date.parse(new Date());
              this.state.orderId =newTimeStamp; 
            },
          })
        })
      })
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const record = this.state.record;
    return (
      <PageHeaderLayout title="快递下单">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <Card title="寄件人信息">
              <SenderInfoForm getSender={this.getSender} />
            </Card>
            <div style={{ marginTop: '20px', height: '1px' }}>
              <Card title="选择寄件人">
                <KdiSenderList />
              </Card>
            </div>
          </Col>
          <Col md={12} sm={24}>
            <Card title="收件人信息" bordered={false}>
              <ReceiverInfoForm getReceiver={this.getReceiver} />
            </Card>
            <div style={{ marginTop: '25px' }}>
              <Card title="快递下单">
                <Form>
                  <Form.Item label="">
                    {getFieldDecorator('shipperCode', {
                      rules: [{ required: true, message: '快递公司不能为空' }],
                    })(<KdiCompany width={200} getShipper={this.getShipper} />)}
                    <Button style={{ marginLeft: 60 }} onClick={this.kdiEorder}>快递下单</Button>
                  </Form.Item>
                </Form>

              </Card>
            </div>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
