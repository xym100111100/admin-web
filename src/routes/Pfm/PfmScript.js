import SimpleMng from 'components/Rebue/SimpleMng';
import React from 'react';
import { connect } from 'dva';
import { Row, Col, Radio, Form, Card, Button, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import TreeUtils from '../../utils/TreeUtils';
import styles from './PfmScript.less';
//引入复制插件，报错需要yarn install
import copy from 'copy-to-clipboard';
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;

@connect(({ pfmsys, pfmfunc, pfmscript, user, pfmrole, loading }) => ({
  pfmscript,
  pfmsys,
  pfmfunc,
  pfmrole,
  user,
  loading:
    loading.models.pfmscript ||
    loading.models.pfmsys ||
    loading.models.pfmfunc ||
    loading.models.pfmrole ||
    loading.models.user,
}))
export default class PfmScript extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'pfmscript';
    this.state.option = 'menuScriptText';
  }

  componentDidMount() {
    this.props.dispatch({
      type: `pfmsys/list`,
    });
    this.props.dispatch({
      type: `pfmrole/list`,
      payload: { sysId: 'pfm-admin' },
    });
    this.props.dispatch({
      type: `pfmfunc/list`,
      payload: { sysId: 'pfm-admin' },
    });
  }

  /**
   * 获取菜单sql
   * @param {*} dataArray
   */
  getMenuSql(dataArray) {
    const sqlArray = TreeUtils.convertTreeToFlat(dataArray);
    let menuSql = '';
    for (const item of sqlArray) {
      menuSql +=
        'INSERT INTO `PFM_MENU`(`ID`,`SYS_ID`,`CODE`,`NAME`,`PATH`,`IS_ENABLED`,`ICON`,`REMARK`) values (' +
        item.id +
        ",'" +
        item.sysId +
        "','" +
        item.code +
        "','" +
        item.name +
        "','" +
        item.path +
        "'," +
        item.isEnabled +
        ",'" +
        item.icon +
        "','" +
        item.remark +
        "');\n";
    }
    //设置状态值以便复制
    this.setState({
      menuSql: menuSql,
    });
    return menuSql;
  }

  /**
   * 获取系统sql
   * @param {*} dataArray
   */
  getSysSql(dataArray) {
    const sqlArray = TreeUtils.convertTreeToFlat(dataArray);
    let sysSql = '';
    for (const item of sqlArray) {
      sysSql +=
        "INSERT INTO `PFM_SYS`(`ID`,`NAME`,`REMARK`) values ('" +
        item.id +
        "','" +
        item.name +
        "','" +
        item.remark +
        "');\n";
    }
    //设置状态值以便复制
    this.setState({
      sysSql: sysSql,
    });
    return sysSql;
  }

  /**
   * 获取功能sql
   * @param {*} dataArray
   */
  getFuncScriptSql(dataArray) {
    const sqlArray = TreeUtils.convertTreeToFlat(dataArray);
    let funcSql = '';
    for (const item of sqlArray) {
      funcSql +=
        'INSERT INTO `PFM_FUNC`(`ID`,`SYS_ID``,`NAME`,`IS_ENABLED`,`ORDER_NO,`REMARK`) values (' +
        item.id +
        ",'" +
        item.sysId +
        "','" +
        item.name +
        "'," +
        item.isEnabled +
        ',' +
        item.orderNo +
        ",'" +
        item.remark +
        "');\n";
    }
    //设置状态值以便复制
    this.setState({
      funcSql: funcSql,
    });
    return funcSql;
  }

  /**
   * 获取角色sql
   * @param {*} dataArray
   */
  getRoleScriptSql(dataArray) {
    const sqlArray = TreeUtils.convertTreeToFlat(dataArray);
    let roleSql = '';
    for (const item of sqlArray) {
      roleSql +=
        'INSERT INTO `PFM_ROLE`(`ID`,`SYS_ID``,`NAME`,`IS_ENABLED`,`ORDER_NO,`REMARK`) values (' +
        item.id +
        ",'" +
        item.sysId +
        "','" +
        item.name +
        "'," +
        item.isEnabled +
        ',' +
        item.orderNo +
        ",'" +
        item.remark +
        "');\n";
    }
    //设置状态值以便复制
    this.setState({
      roleSql: roleSql,
    });
    return roleSql;
  }

  /**
   * 获取MuneScriptText
   * @param {*} dataArray
   */
  getMenuScriptText(dataArray) {
    const menuscriptArray = TreeUtils.convertTreeToFlat(dataArray);
    let menuScriptText = '';
    for (const item of menuscriptArray) {
      menuScriptText +=
        'menuData.push({' +
        'id: ' +
        item.id +
        ',' +
        'sysId: ' +
        "'" +
        item.sysId +
        "'," +
        'code: ' +
        "'" +
        item.code +
        "'," +
        'name: ' +
        "'" +
        item.name +
        "'," +
        'path: ' +
        "'" +
        item.path +
        "'," +
        'isEnabled:' +
        item.isEnabled +
        ',' +
        'icon: ' +
        "'" +
        item.icon +
        "'," +
        'remark: ' +
        "'" +
        item.remark +
        "'});\n";
    }

    //设置状态值以便复制
    this.setState({
      menuScriptText: menuScriptText,
    });
    return menuScriptText;
  }

  /**
   * 获取SysScriptText
   */
  getSysScriptText = dataArray => {
    dataArray = TreeUtils.convertTreeToFlat(dataArray);
    let sysScriptText = 'const tableListDataSource = [\n';
    for (const item of dataArray) {
      sysScriptText +=
        "  { id: '" + item.id + "'," + " name: '" + item.name + "'," + " remark: '" + item.remark + "'},\n";
    }
    sysScriptText += ']\n';
    //设置状态值以便复制
    this.setState({
      sysScriptText: sysScriptText,
    });
    return sysScriptText;
  };

  /**
   * 获取funcScriptText
   */
  getFuncScriptText = dataArray => {
    dataArray = TreeUtils.convertTreeToFlat(dataArray);
    let funcScriptText = 'const tableListDataSource = [\n';
    for (const item of dataArray) {
      funcScriptText +=
        "  { id: '" +
        item.id +
        "'," +
        " sysId: '" +
        item.sysId +
        "'," +
        " name: '" +
        item.name +
        "'," +
        ' isEnabled: ' +
        item.isEnabled +
        ',' +
        ' orderNo: ' +
        item.orderNo +
        ',' +
        " remark: '" +
        item.remark +
        "'},\n";
    }
    funcScriptText += ']\n';
    //设置状态值以便复制
    this.setState({
      funcScriptText: funcScriptText,
    });
    return funcScriptText;
  };

  /**
   * 获取roleScriptText
   */
  getRoleScriptText = dataArray => {
    dataArray = TreeUtils.convertTreeToFlat(dataArray);
    let roleScriptText = 'const tableListDataSource = [\n';
    for (const item of dataArray) {
      roleScriptText +=
        "  { id: '" +
        item.id +
        "'," +
        " sysId: '" +
        item.sysId +
        "'," +
        " name: '" +
        item.name +
        "'," +
        ' isEnabled: ' +
        item.isEnabled +
        ',' +
        ' orderNo: ' +
        item.orderNo +
        ',' +
        " remark: '" +
        item.remark +
        "'},\n";
    }
    roleScriptText += ']\n';
    //设置状态值以便复制
    this.setState({
      roleScriptText: roleScriptText,
    });
    return roleScriptText;
  };

  select = obj => {
    if (obj === 1) {
      this.setState({
        option: 'roleScriptText',
      });
    } else if (obj === 2) {
      this.setState({
        option: 'funcScriptText',
      });
    } else if (obj === 3) {
      this.setState({
        option: 'sysScriptText',
      });
    } else if (obj === 4) {
      this.setState({
        option: 'menuScriptText',
      });
    } else if (obj === 5) {
      this.setState({
        option: 'funcSql',
      });
    } else if (obj === 6) {
      this.setState({
        option: 'sysSql',
      });
    } else if (obj === 7) {
      this.setState({
        option: 'roleSql',
      });
    } else if (obj === 8) {
      this.setState({
        option: 'menuSql',
      });
    }
  };

  copyText = () => {
    if (this.state.option === 'menuSql') {
      copy(this.state.menuSql);
      message.success('复制menuSql成功');
    } else if (this.state.option === 'sysScriptText') {
      copy(this.state.sysScriptText);
      message.success('复制sysScriptText成功');
    } else if (this.state.option === 'funcScriptText') {
      copy(this.state.funcScriptText);
      message.success('复制funcScriptText成功');
    } else if (this.state.option === 'roleScriptText') {
      copy(this.state.roleScriptText);
      message.success('复制roleScriptText成功');
    } else if (this.state.option === 'menuScriptText') {
      copy(this.state.menuScriptText);
      message.success('复制menuScriptText成功');
    } else if (this.state.option === 'sysSql') {
      copy(this.state.sysSql);
      message.success('复制funcSql成功');
    } else if (this.state.option === 'funcSql') {
      copy(this.state.funcSql);
      message.success('复制funcSql成功');
    } else if (this.state.option === 'roleSql') {
      copy(this.state.roleSql);
      message.success('复制roleSql成功');
    }
  };

  render() {
    const { user, pfmfunc, pfmsys, pfmrole } = this.props;
    const menus = user.menus;
    console.log('11111');
    console.log(this.props);
    return (
      <PageHeaderLayout title="脚本">
        <Card bordered={false}>
          <div className={styles.tableListForm}>
            <Form onSubmit={this.handleSearch} layout="inline">
              <Row gutter={{ md: 6, lg: 24, xl: 0 }}>
                <Col md={18} sm={24}>
                  <FormItem style={{ float: 'left' }}>
                    <RadioGroup defaultValue="4">
                      <RadioButton value="4" onClick={() => this.select(4)}>
                        menuSript
                      </RadioButton>
                      <RadioButton value="1" onClick={() => this.select(1)}>
                        roleSript
                      </RadioButton>
                      <RadioButton value="2" onClick={() => this.select(2)}>
                        funcSript
                      </RadioButton>
                      <RadioButton value="3" onClick={() => this.select(3)}>
                        sysSript
                      </RadioButton>
                      <RadioButton value="8" onClick={() => this.select(8)}>
                        menuSql
                      </RadioButton>
                      <RadioButton value="5" onClick={() => this.select(5)}>
                        funcSql
                      </RadioButton>
                      <RadioButton value="6" onClick={() => this.select(6)}>
                        sysSql
                      </RadioButton>
                      <RadioButton value="7" onClick={() => this.select(7)}>
                        roleSql
                      </RadioButton>
                    </RadioGroup>
                  </FormItem>
                </Col>
                <Col md={4} sm={24}>
                  <Button onClick={() => this.copyText()}>复制</Button>
                </Col>
              </Row>
            </Form>
          </div>
          <Row gutter={{ md: 6, lg: 24, xl: 0 }}>
            {this.state.option === 'menuSql' && (
              <Col md={24} sm={24}>
                <textarea style={{ width: '100%', whiteSpace: 'pre', overflow: 'scroll', height: 500 }}>
                  {this.getMenuSql(menus)}
                </textarea>
              </Col>
            )}
            {this.state.option === 'sysScriptText' && (
              <Col md={24} sm={24}>
                <textarea style={{ width: '100%', whiteSpace: 'pre', overflow: 'scroll', height: 500 }}>
                  {this.getSysScriptText(pfmsys.pfmsys)}
                </textarea>
              </Col>
            )}
            {this.state.option === 'funcScriptText' && (
              <Col md={24} sm={24}>
                <textarea style={{ width: '100%', whiteSpace: 'pre', overflow: 'scroll', height: 500 }}>
                  {this.getFuncScriptText(pfmfunc.pfmfunc)}
                </textarea>
              </Col>
            )}
            {this.state.option === 'funcSql' && (
              <Col md={24} sm={24}>
                <textarea style={{ width: '100%', whiteSpace: 'pre', overflow: 'scroll', height: 500 }}>
                  {this.getFuncScriptSql(pfmfunc.pfmfunc)}
                </textarea>
              </Col>
            )}
            {this.state.option === 'roleScriptText' && (
              <Col md={24} sm={24}>
                <textarea style={{ width: '100%', whiteSpace: 'pre', overflow: 'scroll', height: 500 }}>
                  {this.getRoleScriptText(pfmrole.pfmrole)}
                </textarea>
              </Col>
            )}
            {this.state.option === 'roleSql' && (
              <Col md={24} sm={24}>
                <textarea style={{ width: '100%', whiteSpace: 'pre', overflow: 'scroll', height: 500 }}>
                  {this.getRoleScriptSql(pfmrole.pfmrole)}
                </textarea>
              </Col>
            )}
            {this.state.option === 'menuScriptText' && (
              <Col md={24} sm={24}>
                <textarea style={{ width: '100%', whiteSpace: 'pre', overflow: 'scroll', height: 500 }}>
                  {this.getMenuScriptText(menus)}
                </textarea>
              </Col>
            )}
            {this.state.option === 'sysSql' && (
              <Col md={24} sm={24}>
                <textarea style={{ width: '100%', whiteSpace: 'pre', overflow: 'scroll', height: 500 }}>
                  {this.getSysSql(pfmsys.pfmsys)}
                </textarea>
              </Col>
            )}
          </Row>
        </Card>
      </PageHeaderLayout>
    );
  }
}
