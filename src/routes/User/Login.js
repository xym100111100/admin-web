import React, { PureComponent } from 'react';
import { connect } from 'dva';
import CryptoJS from 'crypto-js';
import { Checkbox, Alert } from 'antd';
import Login from 'components/Login';
import styles from './Login.less';

const { Tab, UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends PureComponent {
  state = {
    type: 'account',
    autoLogin: true,
  };

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;
    const tempValues = values;
    if (!err) {
      tempValues.loginPswd = CryptoJS.MD5(values.loginPswd).toString();
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...tempValues,
          sysId: 'damai-admin',
          type,
        },
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  render() {
    const { login, submitting } = this.props;
    const { type } = this.state;
    const userNameRules = {
      rules: [
        {
          required: true,
          message: '请输入email/手机号/登录名称!',
        },
      ],
    };
    const loginPswdRules = {
      rules: [
        {
          required: true,
          message: '请输入登录密码!',
        },
      ],
    };
    return (
      <div className={styles.main}>
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          <Tab key="account" tab="账户密码登录">
            {login.status !== 1 && login.type === 'account' && !submitting && this.renderMessage(login.msg)}
            <UserName name="userName" placeholder="email/手机号/登录名称" {...userNameRules} />
            <Password name="loginPswd" placeholder="登录密码" {...loginPswdRules} />
          </Tab>
          <div>
            <Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>
              自动登录
            </Checkbox>
            <a style={{ float: 'right' }} href="">
              忘记密码
            </a>
          </div>
          <Submit loading={submitting}>登录</Submit>
        </Login>
      </div>
    );
  }
}
