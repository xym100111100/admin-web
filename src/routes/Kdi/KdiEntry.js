import SimpleMng from 'components/Rebue/SimpleMng';
import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Row, Col, Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './KdiEntry.less';
import AddrCascader from 'components/Rebue/AddrCascader';
import KdiCompany from 'components/Rebue/KdiCompany';
const surname =
  '赵钱孙李周吴郑王冯陈褚卫' +
  '蒋沈韩杨朱秦尤许何吕施张' +
  '孔曹严华金魏陶姜戚谢邹喻' +
  '柏水窦章云苏潘葛奚范彭郎' +
  '鲁韦昌马苗凤花方俞任袁柳' +
  '酆鲍史唐费廉岑薛雷贺倪汤' +
  '滕殷罗毕郝邬安常乐于时傅' +
  '皮卞齐康伍余元卜顾孟平黄' +
  '和穆萧尹姚邵湛汪祁毛禹狄' +
  '米贝明臧计伏成戴谈宋茅庞' +
  '熊纪舒屈项祝董梁杜阮蓝闵' +
  '席季麻强贾路娄危江童颜郭' +
  '梅盛林刁锺徐邱骆高夏蔡田' +
  '樊胡凌霍虞万支柯昝管卢莫' +
  '经房裘缪干解应宗丁宣贲邓' +
  '郁单杭洪包诸左石崔吉钮龚' +
  '程嵇邢滑裴陆荣翁荀羊於惠' +
  '甄麴家封芮羿储靳汲邴糜松' +
  '井段富巫乌焦巴弓牧隗山谷' +
  '车侯宓蓬全郗班仰秋仲伊宫' +
  '宁仇栾暴甘钭历戎祖武符刘' +
  '景詹束龙叶幸司韶郜黎蓟溥' +
  '印宿白怀蒲邰从鄂索咸籍赖' +
  '卓蔺屠蒙池乔阳郁胥能苍双' +
  '闻莘党翟谭贡劳逄姬申扶堵' +
  '冉宰郦雍却璩桑桂濮牛寿通' +
  '边扈燕冀僪浦尚农温别庄晏' +
  '柴瞿阎充慕连茹习宦艾鱼容' +
  '向古易慎戈廖庾终暨居衡步' +
  '都耿满弘匡国文寇广禄阙东' +
  '欧殳沃利蔚越夔隆师巩厍聂' +
  '晁勾敖融冷訾辛阚那简饶空' +
  '曾毋沙乜养鞠须丰巢关蒯相' +
  '查后荆红游竺权逮盍益桓公兰';

const FormItem = Form.Item;
@connect(({ kdientry, user, loading }) => ({ kdientry, user, loading: loading.models.kdientry || loading.models.user }))
@Form.create()
export default class KdiEntry extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'kdientry';
  }

  componentDidMount() {}

  handleReset = () => {
    this.props.form.resetFields();
  };

  manual(where) {
    const { form } = this.props;
    if (where === 2) {
      form.setFieldsValue({ receiverProvince: form.getFieldValue('receiverProvince') }); // 测试 ，可以删除 ['湖南省','','祁阳县'] //form.getFieldValue('receiverProvince')
    } else {
      form.setFieldsValue({ senderProvince: form.getFieldValue('senderProvince') });
    }
  }

  automatic(where) {
    //定义姓氏用来判断截取电话号码前三个或者两个字符串
    let area = '';
    if (where === 2) {
      area = 'receiverAddress';
    } else {
      area = 'senderAddress';
    }
    const { form } = this.props;
    let Address = form.getFieldValue(area);
    if (Address === undefined || Address === null || Address.trim() === '') {
      return;
    }
    let pattern = new RegExp("[`~!@#$^&*()=|{} ':;'/\\/,/[\\].<>/?~！@#￥……&*（ ）——|{}【】‘；：”“'。，、？]", 'g');
    //去除特殊符号后的详细地址
    let before = Address.replace(pattern, '');
    //手机号码，姓名
    if (where === 2) {
      //截取手机号码和收件人姓名
      let reg = /[0-9]{11}/g;
      if (before.match(reg) !== null) {
        //设置收件人手机
        form.setFieldsValue({ receiverMobile: before.match(reg)[0] });
        var i = before.indexOf(before.match(reg)[0]);
        //截取电话号码前第三个判断是否是姓
        if (surname.indexOf(before.substr(i - 3, 1)) !== -1) {
          //设置收件人姓名
          form.setFieldsValue({ receiverName: before.substr(i - 3, 3) });
        } else {
          //设置收件人姓名
          form.setFieldsValue({ receiverName: before.substr(i - 2, 2) });
        }
      } else {
        //清除上次的姓名和手机号码
        form.setFieldsValue({ receiverName: '' });
        form.setFieldsValue({ receiverMobile: '' });
      }
    } else {
      //截取手机号码和发件人姓名
      let reg = /[0-9]{11}/g;
      if (before.match(reg) !== null) {
        //设置发件人手机
        form.setFieldsValue({ senderMobile: before.match(reg)[0] });
        var i = before.indexOf(before.match(reg)[0]);
        //截取电话号码前第三个判断是否是姓
        if (surname.indexOf(before.substr(i - 3, 1)) !== -1) {
          //设置发件人姓名
          form.setFieldsValue({ senderName: before.substr(i - 3, 3) });
        } else {
          //设置发件人姓名
          form.setFieldsValue({ senderName: before.substr(i - 2, 2) });
        }
      } else {
        //清除上次的姓名和手机号码
        form.setFieldsValue({ senderName: '' });
        form.setFieldsValue({ senderMobile: '' });
      }
    }
  }

  entry = () => {
    const { form } = this.props;
    //  const organizeId=user.currentUser.organizeId; 不是连调的时候应该把这里放开获取动态的organizeId(在上面的获取属性里面加user)
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      //添加组织ID
      fieldsValue.organizeId = 253274870;
      //这里其实传上来的shipperName中已经包含了shipperId和shipperCode，且用/隔开，所有这里要处理数据。
      let shipperInfo = fieldsValue.shipperName.split('/');
      fieldsValue.shipperId = shipperInfo[0];
      fieldsValue.shipperName = shipperInfo[1];
      fieldsValue.shipperCode = shipperInfo[2];
      //这里其实传上来的senderProvince中已经包含了senderCity和senderExpArea，是个数组，所有这里要处理数据。
      let senderProvinceInfo = fieldsValue.senderProvince;
      if (senderProvinceInfo !== undefined) {
        fieldsValue.senderProvince = senderProvinceInfo[0];
        fieldsValue.senderCity = senderProvinceInfo[1];
        fieldsValue.senderExpArea = senderProvinceInfo[2];
      }
      //这里其实传上来的receiverProvince中已经包含了receiverCity和receiverExpArea，是个数组，所有这里要处理数据。
      let receiverProvinceInfo = fieldsValue.receiverProvince;
      if (receiverProvinceInfo !== undefined) {
        fieldsValue.receiverProvince = receiverProvinceInfo[0];
        fieldsValue.receiverCity = receiverProvinceInfo[1];
        fieldsValue.receiverExpArea = receiverProvinceInfo[2];
      }
      //  console.log(fieldsValue);

      this.props.dispatch({
        type: `${this.moduleCode}/add`,
        payload: { ...fieldsValue },
        callback: () => {
          this.handleReload();
        },
      });
    });
  };

  renderSearchForm() {
    const { getFieldDecorator } = this.props.form;
    const { form } = this.props;
    const { kdientry: { kdientry }, loading } = this.props;
    return (
      <Form onSubmit={this.entry} layout="inline">
        <Row gutter={{ md: 1, lg: 12, xl: 24 }}>
          <Col md={10} sm={24} push={1}>
            <Card title="收件人信息">
              <FormItem label="收件人姓名">
                {getFieldDecorator('receiverName', {
                  rules: [
                    {
                      required: true,
                      message: '请输入收件人姓名',
                    },
                  ],
                })(<Input placeholder="请输入收件人姓名" />)}
              </FormItem>
              <FormItem label="收件人手机">
                {getFieldDecorator('receiverMobile', {
                  rules: [
                    {
                      required: true,
                      pattern: /^[0-9]*$/,
                      message: '请输入全部为数字的收件人手机',
                    },
                  ],
                })(<Input placeholder="请输入全部为数字的收件人手机" />)}
              </FormItem>
              <FormItem label="收件地邮编">
                {getFieldDecorator('receiverPostCode', {
                  rules: [
                    {
                      required: true,
                      pattern: /^[0-9]*$/,
                      message: '请输入全部为数字收件地邮编',
                    },
                  ],
                })(<Input placeholder="请输入收件地邮编" />)}
              </FormItem>
              <FormItem label="收件人地址">
                {getFieldDecorator('receiverProvince', {
                  rules: [
                    {
                      required: true,
                      message: '请输入收件人地址',
                    },
                  ],
                })(<AddrCascader />)}
              </FormItem>
              <FormItem label="详细地址" style={{ paddingLeft: 15 }}>
                {getFieldDecorator('receiverAddress', {
                  rules: [
                    {
                      required: true,
                      message: '请输入收件人详细地址',
                    },
                  ],
                })(
                  <Input
                    onBlur={() => this.automatic(2)}
                    onChange={() => this.automatic(2)}
                    placeholder="请输入收件人详细地址"
                  />
                )}
              </FormItem>
              <FormItem style={{ paddingLeft: 15 }} label="物流单号">
                {getFieldDecorator('logisticCode', {
                  rules: [
                    {
                      required: true,
                      pattern: /^[0-9]*$/,
                      message: '请输入全部为数字的物流单号',
                    },
                  ],
                })(<Input placeholder="请输入全部为数字的物流单号" />)}
              </FormItem>

              <FormItem label="订单标题" style={{ paddingLeft: 15 }}>
                {getFieldDecorator('orderTitle', {
                  rules: [
                    {
                      required: true,
                      message: '请输入订单标题',
                    },
                  ],
                })(<Input placeholder="请输入订单标题" />)}
              </FormItem>
            </Card>
          </Col>
          <Col md={10} sm={24} push={2}>
            <Card title="发件人信息">
              <FormItem label="发件人姓名">
                {getFieldDecorator('senderName', {
                  rules: [
                    {
                      required: true,
                      message: '请输入发件人姓名',
                    },
                  ],
                })(<Input placeholder="请输入发件人姓名" />)}
              </FormItem>
              <FormItem label="发件人手机">
                {getFieldDecorator('senderMobile', {
                  rules: [
                    {
                      required: true,
                      pattern: /^[0-9]*$/,
                      message: '请输入全部为数字的发件人手机',
                    },
                  ],
                })(<Input placeholder="请输入全部为数字的发件人手机" />)}
              </FormItem>
              <FormItem label="发件地邮编">
                {getFieldDecorator('senderPostCode', {
                  rules: [
                    {
                      required: true,
                      pattern: /^[0-9]*$/,
                      message: '请输入全部为数字发件地邮编',
                    },
                  ],
                })(<Input placeholder="请输入发件地邮编" />)}
              </FormItem>
              <FormItem label="发件人地址">
                {getFieldDecorator('senderProvince', {
                  rules: [
                    {
                      required: true,
                      message: '请输入发件人地址',
                    },
                  ],
                })(<AddrCascader />)}
              </FormItem>
              <FormItem label="详细地址" style={{ paddingLeft: 15 }}>
                {getFieldDecorator('senderAddress', {
                  rules: [
                    {
                      required: true,
                      message: '请输入发件人详细地址',
                    },
                  ],
                })(
                  <Input
                    onBlur={() => this.automatic(1)}
                    onChange={() => this.automatic(1)}
                    placeholder="请输入发件人详细地址"
                  />
                )}
              </FormItem>
              <FormItem label="快递公司" style={{ paddingLeft: 15 }}>
                {getFieldDecorator('shipperName', {
                  rules: [
                    {
                      required: true,
                      message: '请输入快递公司',
                    },
                  ],
                })(<KdiCompany />)}
              </FormItem>
              <FormItem>
                <Button style={{ marginLeft: 26 }} type="primary" htmlType="submit">
                  录入
                </Button>
                <Button style={{ marginLeft: 30 }} onClick={this.handleReset}>
                  重置
                </Button>
              </FormItem>
            </Card>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { kdientry: { kdientry }, loading } = this.props;
    const { form } = this.props;
    return (
      <PageHeaderLayout title="快递单录入">
        <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
      </PageHeaderLayout>
    );
  }
}
