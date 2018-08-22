import SimpleMng from 'components/Rebue/SimpleMng';
import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Row, Col, Divider } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './KdiEntry.less';
import AddrCascader from 'components/Rebue/AddrCascader';
import KdiCompany from 'components/Rebue/KdiCompany';
//定义姓来确定应该截取名字前面多少个文字（只取两个或者三个的名字）
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
    //这个状态的名字值是随意的，使用到的地方都是为了能获取到当前数据而不是上一次数据的bug
    this.state.aa = {
      aa: 'aa',
    };
  }

  handleReset = () => {
    this.props.form.resetFields();
  };

  componentDidMount() {
    const { form } = this.props;
    //设置默认发件人
    form.setFieldsValue({ senderPostCode: '530000' });
    form.setFieldsValue({ receiverPostCode: '000000' });
  }

  /**
   * 为了使form.getFieldValue()得到的是当前的值
   * 而不是上一个的值而加的前置方法
   */
  receiver() {
    this.setState(
      {
        aa: { aa: 'a' },
      },
      () => this.automatic(2)
    );
  }

  /**
   * 为了使form.getFieldValue()得到的是当前的值
   * 而不是上一个的值而加的前置方法
   */
  sender() {
    this.setState(
      {
        aa: { aa: 'a' },
      },
      () => this.automatic(1)
    );
  }

  /**
   * 自动解析详细地址
   * @param {*} where 判断是发件人的还是收件人的
   */
  automatic(where) {
    let who = '';
    if (where === 2) {
      who = 'receiver';
    } else {
      who = 'sender';
    }
    const { form } = this.props;
    let Address = form.getFieldValue(who);
    if (Address === undefined || Address === null || Address.trim() === '') {
      return;
    }
    let pattern = new RegExp("[`~!@#$^&*()=|{} ':;'/\\/,/[\\].<>/?~！@#￥……&*（ ）——|{}【】‘；：”“'。，、？]", 'g');
    //去除特殊符号后的详细地址
    let before = Address.replace(pattern, '');
    let province;
    let city;
    let area;
    //首先确定是不是北京市，天津市，上海市，重庆市之一的直辖市
    if (before.indexOf('天津市') !== -1) {
      //确定省
      province = '天津市';
      //确定市
      city = '市辖区';
      //确定区
      let index = before.indexOf('市');
      let index2 = before.indexOf('区');
      area = before.substring(index + 1, index2 + 1);
      if (index2 !== -1) {
        before = before.substring(index2 + 1, before.length);
      }
    } else if (before.indexOf('上海市') !== -1) {
      //确定省
      province = '上海市';
      //确定市
      city = '市辖区';
      //确定区
      let index = before.indexOf('市');
      let index2 = before.indexOf('区');
      area = before.substring(index + 1, index2 + 1);
      if (index2 !== -1) {
        before = before.substring(index2 + 1, before.length);
      }
    } else if (before.indexOf('重庆市') !== -1) {
      //确定省
      province = '重庆市';
      //确定市
      city = '市辖区';
      //确定区，因为可能有小区，所以县优先
      let index = before.indexOf('市');
      let index2 = before.indexOf('区');
      let index3 = before.indexOf('县');
      index3 !== -1 ? (index2 = index3) : (index2 = index2);
      area = before.substring(index + 1, index2 + 1);
      if (index2 !== -1) {
        before = before.substring(index2 + 1, before.length);
      } else if (index3 !== -1) {
        before = before.substring(index3 + 1, before.length);
      }
    } else if (before.indexOf('北京市') !== -1) {
      //确定省
      province = '北京市';
      //确定市
      city = '市辖区';
      //确定区
      let index = before.indexOf('市');
      let index2 = before.indexOf('区');
      area = before.substring(index + 1, index2 + 1);
      if (index2 !== -1) {
        before = before.substring(index2 + 1, before.length);
      }
    } else {
      //判断是不是自治区,可能用户会填广西北海或者广西省北海市等自治区的简写
      if (before.indexOf('广西省') !== -1) {
        before = before.replace('广西省', '广西壮族自治区');
      } else if (before.indexOf('广西壮族自治区') === -1) {
        if (before.indexOf('广西') !== -1) {
          before = before.replace('广西', '广西壮族自治区');
        }
      }
      //确定省或者自治区,只有前面一个不等于-1才识别后面的
      let index0 = before.indexOf('自治区');
      let index1 = before.indexOf('省');
      index1 === -1 ? (index1 = index0) : (index1 = index1);
      let index2;
      let index3;
      let index4;
      let index5;
      if (index1 !== -1) {
        if (index0 !== -1) {
          index1 = before.indexOf('自治区') + 2;
        }
        province = before.substring(0, index1 + 1);
        //确定市
        index2 = before.indexOf('市');
        if (index2 !== -1) {
          city = before.substring(index1 + 1, index2 + 1);
          //确定区或县，鉴于可能有小区的字符串混淆，且要在市的后面切，以免是自治区所以县优先
          index3 = before.indexOf('区', index2);
          index4 = before.indexOf('县');
          //可能是市级县，所以市级县优先,且搜索市级县的位置应该在上一个检索到的市后面
          index5 = before.indexOf('市', index2 + 2);
          index4 === -1 ? (index3 = index3) : (index3 = index4);
          index5 === -1 ? (index3 = index3) : (index3 = index5);
          area = before.substring(index2 + 1, index3 + 1);
        }
        //将识别到的地区从详细地址中删除
        if (index5 !== -1) {
          before = before.substring(index5 + 1, before.length);
        } else if (index4 !== -1) {
          before = before.substring(index4 + 1, before.length);
        } else if (index3 !== -1) {
          before = before.substring(index3 + 1, before.length);
        } else if (index2 !== -1) {
          before = before.substring(index2 + 1, before.length);
        } else if (index1 !== -1) {
          before = before.substring(index1 + 1, before.length);
        }
      }
    }
    //判断是发件人的信息还是收件人的再设置
    if (where === 2) {
      if (province !== undefined) {
        form.setFieldsValue({ receiverProvince: [province, city, area] });
      }
      //截取手机号码和收件人姓名
      let reg = /[0-9]{11}/g;
      if (before.match(reg) !== null) {
        //设置收件人手机
        form.setFieldsValue({ receiverMobile: before.match(reg)[0] });
        var i = before.indexOf(before.match(reg)[0]);
        //截取订单标题
        if (before.length > i + 11) {
          form.setFieldsValue({ orderTitle: before.substr(i + 11, before.length) });
          before = before.replace(before.substr(i + 11, before.length), '');
        }
        before = before.replace(before.match(reg)[0], '');
        //截取电话号码前第三个判断是否是姓
        if (surname.indexOf(before.substr(i - 3, 1)) !== -1) {
          //设置收件人姓名
          form.setFieldsValue({ receiverName: before.substr(i - 3, 3) });
          before = before.replace(before.substr(i - 3, 3), '');
        } else {
          //设置收件人姓名
          form.setFieldsValue({ receiverName: before.substr(i - 2, 2) });
          before = before.replace(before.substr(i - 2, 2), '');
        }
      }

      //设置截取后的详细地址
      form.setFieldsValue({ receiverAddress: before });
      //解决页面与实际获取的数据不同步问题
      this.setState(
        {
          aa: { aa: 'a' },
        },
        () => this.setReceiverProvince()
      );
    } else {
      //设置截取后的详细地址
      form.setFieldsValue({ senderAddress: before });
      if (province !== undefined) {
        form.setFieldsValue({ senderProvince: [province, city, area] });
      }
      //截取手机号码和发件人姓名
      let reg = /[0-9]{11}/g;
      if (before.match(reg) !== null) {
        //设置发件人手机
        form.setFieldsValue({ senderMobile: before.match(reg)[0] });
        var i = before.indexOf(before.match(reg)[0]);

        before = before.replace(before.match(reg)[0], '');
        //截取电话号码前第三个判断是否是姓
        if (surname.indexOf(before.substr(i - 3, 1)) !== -1) {
          //设置发件人姓名
          form.setFieldsValue({ senderName: before.substr(i - 3, 3) });
          before = before.replace(before.substr(i - 3, 3), '');
        } else {
          //设置发件人姓名
          form.setFieldsValue({ senderName: before.substr(i - 2, 2) });
          before = before.replace(before.substr(i - 2, 2), '');
        }
      }
      //设置截取后的详细地址
      form.setFieldsValue({ senderAddress: before });
      //解决页面与实际获取的数据不同步问题
      this.setState(
        {
          aa: { aa: 'a' },
        },
        () => this.setSenderProvince()
      );
    }
  }

  /**
   * 收发件人的自定义规则
   */
  provinceInfo = (rule, value, callback) => {
    if (value === undefined || value.length < 3) {
      callback('请选择完省市区 ');
    } else {
      callback();
    }
  };

  /**
   * 为解决收件人地址页面上数据和实际数据不同步问题
   */
  setReceiverProvince() {
    const { form } = this.props;
    let allArea = document.getElementsByClassName('ant-cascader-picker-label');
    let pattern = new RegExp(' ', 'g');
    allArea = allArea[0].innerHTML;
    let before = allArea.replace(pattern, '');
    before = before.split('/');
    form.setFieldsValue({ receiverProvince: before });
  }

  /**
   * 为解决发件人页面上数据和实际数据不同步问题
   */
  setSenderProvince() {
    const { form } = this.props;
    let allArea = document.getElementsByClassName('ant-cascader-picker-label');
    let pattern = new RegExp(' ', 'g');
    allArea = allArea[1].innerHTML;
    let before = allArea.replace(pattern, '');
    before = before.split('/');
    form.setFieldsValue({ senderProvince: before });
  }

  /**
   * 录入物流信息
   */
  entry = () => {
    const { form } = this.props;

    //设置截取后的详细地址
    //  const organizeId=user.currentUser.organizeId; 不是连调的时候应该把这里放开获取动态的organizeId(在上面的获取属性里面加user)
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      //添加组织ID
      fieldsValue.organizeId = 253274870;
      //这里其实传上来的shipperName中已经包含了shipperId和shipperCode，且用/隔开，所有这里要处理数据。
      let shipperInfo;
      if (fieldsValue.shipperName !== undefined) {
        shipperInfo = fieldsValue.shipperName.split('/');
        fieldsValue.shipperId = shipperInfo[0];
        fieldsValue.shipperName = shipperInfo[1];
        fieldsValue.shipperCode = shipperInfo[2];
      }
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
    const { kdientry: { kdientry }, loading } = this.props;

    return (
      <Form onSubmit={() => this.entry()} layout="inline">
        <Row gutter={{ md: 1, lg: 4, xl: 2 }}>
          <Col md={10} sm={24} push={1}>
            <h3 style={{ paddingTop: 20, marginBottom: 40 }}>收件人信息</h3>
            <FormItem label="智能解析" style={{ paddingLeft: 24 }}>
              {getFieldDecorator('receiver')(
                <Input onInput={() => this.receiver()} placeholder="请粘贴地址，姓名，手机号码" />
              )}
            </FormItem>
            <Divider />
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
                    message: ' ',
                  },
                  {
                    validator: this.provinceInfo,
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
              })(<Input placeholder="请输入收件人详细地址" />)}
            </FormItem>
          </Col>
          <Col md={1} sm={24} push={1} style={{ textAlign: 'center' }}>
            <Divider type="vertical" style={{ height: 255, marginTop: 155 }} />
          </Col>
          <Col md={10} sm={24} push={1}>
            <h3 style={{ paddingTop: 20, marginBottom: 40 }}>发件人信息</h3>
            <FormItem label="智能解析" style={{ paddingLeft: 24 }}>
              {getFieldDecorator('sender')(
                <Input onInput={() => this.sender()} placeholder="请粘贴地址，姓名，手机号码" />
              )}
            </FormItem>
            <Divider />
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
                    message: ' ',
                  },
                  ,
                  {
                    validator: this.provinceInfo,
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
              })(<Input placeholder="请输入发件人详细地址" />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col md={24} sm={24} push={1}>
            <h3 style={{ paddingTop: 20, marginBottom: 20 }}>物流信息</h3>
          </Col>
        </Row>
        <Row>
          <Col md={10} sm={24} push={1}>
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
          </Col>
          <Col md={10} sm={24} push={2}>
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
          </Col>
        </Row>
        <Row>
          <Col md={14} sm={24}>
            <FormItem>
              <Button style={{ float: 'right', marginRight: 30 }} type="primary" htmlType="submit">
                录入
              </Button>
              <Button style={{ float: 'right', marginRight: 35 }} onClick={this.handleReset}>
                重置
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { kdientry: { kdientry }, loading } = this.props;
    return (
      <PageHeaderLayout title="快递单录入">
        <div style={{ background: 'white' }} className={styles.tableListForm}>
          {this.renderSearchForm()}
        </div>
      </PageHeaderLayout>
    );
  }
}
