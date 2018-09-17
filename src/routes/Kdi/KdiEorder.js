import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Button } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import SenderInfoForm from './SenderInfoForm';
import ReceiverInfoForm from './ReceiverInfoForm';
import KdiSenderList from './KdiSenderList';
import KdiCompany from 'components/Kdi/KdiCompany';

@connect(({ kdieorder, kdisender, user, loading }) => ({
  kdieorder,
  kdisender,
  user,
  loading: loading.models.kdieorder,
}))
@Form.create()
export default class KdiEorder extends PureComponent {
  constructor() {
    super();
    this.moduleCode = 'kdieorder';
  }

  state = {
    options: {},
    record: {},
    orderId: Date.parse(new Date()),
  };

  componentDidMount() {
    this.getDefaultSender();
  }

  getSender = ref => {
    this.SenderInfo = ref;
  };

  getReceiver = ref => {
    this.ReceiverInfo = ref;
  };

  getShipper = ref => {
    this.Shipper = ref;
  };

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
  getDefaultSender() {
    const { user } = this.props;
    let orgId = user.currentUser.orgId;
    // 刷新
    this.props.dispatch({
      type: `kdisender/getDefaultSender`,
      payload: { orgId: orgId },
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
    const { user } = this.props;

     let orgId = user.currentUser.orgId; 
    this.props.form.validateFields((err, values) => {
      if (err) return;
      let eorderParam = {
        shipperId: undefined,
        shipperName: undefined,
        shipperCode: undefined,
        orderId: this.state.orderId,
        orgId: orgId,
      };
      let shipperInfo = values.shipperInfo.split('/');
      eorderParam.shipperId = shipperInfo[0];
      eorderParam.shipperName = shipperInfo[1];
      eorderParam.shipperCode = shipperInfo[2];

      eorderParam.receiverProvince = values.receiverProvince[0];
      eorderParam.receiverCity = values.receiverProvince[1];
      eorderParam.receiverExpArea = values.receiverProvince[2];
      eorderParam.receiverMobile = values.receiverMobile;
      eorderParam.receiverName = values.receiverName;
      eorderParam.receiverTel = values.receiverTel;
      eorderParam.receiverPostCode = values.receiverPostCode;
      eorderParam.orderTitle = values.orderTitle;
      eorderParam.receiverAddress = values.receiverAddress;



      this.SenderInfo.componentDidMount;
      this.ReceiverInfo.componentDidMount;
      this.SenderInfo.props.form.validateFields((err, sendervalues) => {
        if (err) return;
        sendervalues.senderProvince = sendervalues.senderaddr[0];
        sendervalues.senderCity = sendervalues.senderaddr[1];
        sendervalues.senderExpArea = sendervalues.senderaddr[2];
        // eorderParam = { ...sendervalues };
        Object.assign(eorderParam, sendervalues);
        let printWindow;
        let newTimeStamp;
        this.props.dispatch({
          type: 'kdieorder/eorder',
          payload: eorderParam,
          callback: data => {
            const printPage = data.printPage;
            printWindow = window.open('', '_blank');
            printWindow.document.body.innerHTML = printPage;
            printWindow.print();
            printWindow.close();
            newTimeStamp = Date.parse(new Date());
            this.state.orderId = newTimeStamp;
          },
        });
      });
    });
  };

  render() {
    const { form } = this.props;
    const record = this.state.record;
    return (
      <PageHeaderLayout title="快递下单">
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <Card title="寄件人信息">
              <SenderInfoForm getSender={this.getSender}  />
            </Card>
            <div style={{ marginTop: '20px', height: '1px' }}>
              <KdiSenderList />
            </div>
          </Col>
          <Col md={12} sm={24}>
            <Card title="收件人信息" bordered={false}>
              <ReceiverInfoForm getReceiver={this.getReceiver} form={form} />
            </Card>
            <div style={{ marginTop: '25px' }}>
              <Card title="快递下单">
                <Form layout="inline">
                  <Row>
                    <Col md={16} sm={24}>
                      <KdiCompany form={form} SelectStyle={{ width: 130 }} getShipper={this.getShipper} />
                    </Col>
                    <Col md={8} sm={24}>
                      <Button type="primary" style={{ marginTop: 3 }} onClick={this.kdiEorder}>
                        下单
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </div>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
