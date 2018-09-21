import SimpleMng from 'components/Rebue/SimpleMng';
import React from 'react';
import { connect } from 'dva';
import { Row, Col, Radio, Form, Card, Button, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import TreeUtils from '../../utils/TreeUtils';
import styles from './ScriptMng.less';
//引入复制插件，报错需要yarn install
import copy from 'copy-to-clipboard';
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const FormItem = Form.Item;

@connect(({ pfmsys, pfmmenu, pfmroleacti, pfmfunc, pfmscript, user, pfmrole, pfmactimenu, pfmactiurn, loading }) => ({
  pfmscript,
  pfmmenu,
  pfmsys,
  pfmroleacti,
  pfmfunc,
  pfmrole,
  user,
  pfmactimenu,
  pfmactiurn,
  loading:
    loading.models.pfmscript ||
    loading.models.pfmmenu ||
    loading.models.pfmsys ||
    loading.models.pfmfunc ||
    loading.models.pfmrole ||
    loading.models.user ||
    loading.models.pfmactiurn ||
    loading.models.pfmactimenu ||
    loading.models.pfmroleacti,
}))
export default class ScriptMng extends SimpleMng {
  constructor() {
    super();
    this.moduleCode = 'pfmscript';
    this.state.option = 'sysScriptText';
    this.state.sysSql = '';
    this.state.roleSql = '';
    this.state.funcSql = '';
    this.state.menuSql = '';
    this.state.sysScriptText = '';
    this.state.roleScriptText = '';
    this.state.funcScriptText = '';
    this.state.menuScriptText = '';
  }

  componentDidMount() {
    this.props.dispatch({
      type: `pfmsys/list`,
      callback: data => {
        this.getSysScriptText(data);
      },
    });
    this.props.dispatch({
      type: `pfmrole/listAll`,
    });
    this.props.dispatch({
      type: 'pfmroleacti/list',
    });
    this.props.dispatch({
      type: 'pfmmenu/list',
      payload: { sysId: 'damai-admin' },
    });

    this.props.dispatch({
      type: `pfmfunc/list`,
    });

    this.props.dispatch({
      type: 'pfmactimenu/list',
    });
    this.props.dispatch({
      type: 'pfmactiurn/list',
    });
  }

  /**
   * 获取菜单sql
   * @param {*} dataArray
   */
  getMenuSql(dataArray) {
    const sqlArray = TreeUtils.convertTreeToFlat(dataArray);
    let menuSql = 'delete from  `PFM_MENU`  where 1=1;\n';
    for (const item of sqlArray) {
      item.icon = item.icon == null ? null : "'" + item.icon + "'";
      item.title = item.title == null ? null : "'" + item.title + "'";
      menuSql +=
        'INSERT INTO `PFM_MENU`(`ID`,`SYS_ID`,`CODE`,`TITLE`,`NAME`,`PATH`,`IS_ENABLED`,`ICON`,`REMARK`) values (' +
        item.id +
        ",'" +
        item.sysId +
        "','" +
        item.code +
        "'," +
        item.title +
        ",'" +
        item.name +
        "','" +
        item.path +
        "'," +
        item.isEnabled +
        ',' +
        item.icon +
        ",'" +
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
    let sysSql = 'delete from `PFM_SYS` where 1=1;\n';
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
    const ActiSql = this.getActiSql(dataArray);
    let funcSql = '-- 功能sql--\n';
    funcSql += 'delete from `PFM_FUNC` where 1=1;\n';
    for (const item of dataArray) {
      funcSql +=
        'INSERT INTO `PFM_FUNC`(`ID`,`SYS_ID`,`NAME`,`IS_ENABLED`,`ORDER_NO`,`REMARK`) values (' +
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
    funcSql += '\n' + ActiSql;
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
    let roleSql = '-- 角色sql \n';
    roleSql += 'delete from `PFM_ROLE` where 1=1;\n';
    for (const item of sqlArray) {
      roleSql +=
        'INSERT INTO `PFM_ROLE`(`ID`,`SYS_ID`,`NAME`,`IS_ENABLED`,`ORDER_NO`,`REMARK`) values (' +
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
    roleSql += '\n' + this.getRoleActiSql() + '\n';

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
      item.icon = item.icon == null ? null : "'" + item.icon + "'";
      item.title = item.title == null ? null : "'" + item.title + "'";
      menuScriptText +=
        'menuData.push({' +
        "id: '" +
        item.id +
        "'," +
        'sysId: ' +
        "'" +
        item.sysId +
        "'," +
        'code: ' +
        "'" +
        item.code +
        "'," +
        'title: ' +
        item.title +
        ',' +
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
        item.icon +
        ',' +
        "remark: '" +
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
    let sysScriptText = '';
    for (const item of dataArray) {
      sysScriptText +=
        "  { id: '" + item.id + "'," + " name: '" + item.name + "'," + " remark: '" + item.remark + "'},\n";
    }
    sysScriptText += '\n';
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
    const ActiScriptText = this.getActiScriptText(dataArray);
    let funcScriptText = '// 功能\n';
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
    funcScriptText += '\n';
    funcScriptText += ActiScriptText;
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
    let roleScriptText = '//角色\n';
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
    roleScriptText += '\n';
    roleScriptText += this.getRoleActiScriptTest() + '\n';
    // 设置状态值以便复制
    this.setState({
      roleScriptText: roleScriptText,
    });
    return roleScriptText;
  };

  /**
   * 获取动作actitext
   */
  getActiScriptText = dataArray => {
    dataArray = TreeUtils.convertTreeToFlat(dataArray);
    const array = [];
    for (let i = 0, j = 0; i < dataArray.length; i++) {
      if (dataArray[i].funcId !== undefined) {
        array[j] = dataArray[i];
        j++;
      }
    }
    let actiScriptText = '// 动作\n';
    for (const item of array) {
      actiScriptText +=
        "  { id: '" +
        item.id +
        "'," +
        "funcId: '" +
        item.funcId +
        "'," +
        'isAuth: ' +
        item.isAuth +
        ',' +
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
    actiScriptText += '\n';
    actiScriptText += this.getActiMenuScriptTest() + '\n';
    actiScriptText += this.getActiUrlScriptTest() + '\n';
    return actiScriptText;
  };

  /**
   * 获取动作actiSql
   */
  getActiSql = dataArray => {
    dataArray = TreeUtils.convertTreeToFlat(dataArray);
    const array = [];
    for (let i = 0, j = 0; i < dataArray.length; i++) {
      if (dataArray[i].funcId !== undefined) {
        array[j] = dataArray[i];
        j++;
      }
    }
    let actiSql = '-- 动作sql--\n';
    actiSql += 'delete from `PFM_ACTI` where 1=1;\n';
    for (const item of array) {
      actiSql +=
        'INSERT INTO `PFM_ACTI`(`ID`,`FUNC_ID`,`IS_AUTH`,`SYS_ID`,`NAME`,`IS_ENABLED`,`ORDER_NO`,`REMARK`) values (' +
        item.id +
        ',' +
        item.funcId +
        ',' +
        item.isAuth +
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

    actiSql += '\n' + this.getActiMenuSql() + '\n';
    actiSql += this.getActiUrnSql() + '\n';
    return actiSql;
  };

  /**
   * 获取角色动作sql
   */
  getRoleActiSql = () => {
    const { pfmroleacti } = this.props;
    let roleActiSql = '-- 角色动作sql--\n';
    roleActiSql += 'delete from `PFM_ROLE_ACTI` where 1=1;\n';
    for (const item of pfmroleacti.pfmroleacti) {
      roleActiSql +=
        'INSERT INTO `PFM_ROLE_ACTI`(`ID`,`ROLE_ID`,`ACTI_ID`) values (' +
        item.id +
        ',' +
        item.roleId +
        ',' +
        item.actiId +
        ');\n';
    }
    return roleActiSql;
  };

  /**
   * 获取角色动作script
   */
  getRoleActiScriptTest = () => {
    const { pfmroleacti } = this.props;
    let roleActiScript = '// 角色动作\n';
    for (const item of pfmroleacti.pfmroleacti) {
      roleActiScript += "{id:'" + item.id + "',roleId:'" + item.roleId + "',actiId:'" + item.actiId + "'},\n";
    }

    return roleActiScript;
  };

  getActiMenuScriptTest = () => {
    const { pfmactimenu } = this.props;
    let menuActiScript = '// 菜单动作\n';
    for (const item of pfmactimenu.pfmactimenu) {
      menuActiScript += "{id:'" + item.id + "',menuId:'" + item.menuId + "',actiId:'" + item.actiId + "'},\n";
    }
    return menuActiScript;
  };

  getActiMenuSql = () => {
    const { pfmactimenu } = this.props;
    let menuActiSql = '-- 动作菜单sql\n';
    menuActiSql += 'delete from  `PFM_ACTI_MENU`  where 1=1;\n';
    for (const item of pfmactimenu.pfmactimenu) {
      menuActiSql +=
        'INSERT INTO `PFM_ACTI_MENU`(`ID`,`MENU_ID`,`ACTI_ID`) values (' +
        item.id +
        ',' +
        item.menuId +
        ',' +
        item.actiId +
        ');\n';
    }
    return menuActiSql;
  };

  /**
   * 获取动作urn
   */
  getActiUrlScriptTest = () => {
    const { pfmactiurn } = this.props;
    let actiUrlScript = '// 动作urn\n';
    for (const item of pfmactiurn.pfmactiurn) {
      actiUrlScript += "{id:'" + item.id + "',actiId:'" + item.actiId + "',urn:'" + item.urn + "'},\n";
    }
    return actiUrlScript;
  };

  getActiUrnSql = () => {
    const { pfmactiurn } = this.props;
    let actiUrlSql = '-- 动作urnSql\n';
    actiUrlSql += 'delete from `PFM_ACTI_URN` where 1=1;\n';
    for (const item of pfmactiurn.pfmactiurn) {
      actiUrlSql +=
        'INSERT INTO `PFM_ACTI_URN`(`ID`,`ACTI_ID`,`URN`) values (' +
        item.id +
        ',' +
        item.actiId +
        ",'" +
        item.urn +
        "');\n";
    }
    return actiUrlSql;
  };

  select = obj => {
    const { pfmfunc, pfmsys, pfmrole, pfmmenu } = this.props;
    const menus = pfmmenu.pfmmenu;
    if (obj === 1) {
      this.props.dispatch({
        type: `pfmrole/listAll`,
      });
      this.props.dispatch({
        type: 'pfmroleacti/list',
      });

      this.setState({
        option: 'roleScriptText',
      });

      this.getRoleScriptText(pfmrole.pfmrole);
    } else if (obj === 2) {
      this.props.dispatch({
        type: `pfmfunc/list`,
      });

      this.props.dispatch({
        type: 'pfmactimenu/list',
      });
      this.props.dispatch({
        type: 'pfmactiurn/list',
      });
      this.getFuncScriptText(pfmfunc.pfmfunc);
      this.setState({
        option: 'funcScriptText',
      });
    } else if (obj === 3) {
      this.props.dispatch({
        type: `pfmsys/list`,
      });
      this.getSysScriptText(pfmsys.pfmsys);
      this.setState({
        option: 'sysScriptText',
      });
    } else if (obj === 4) {
      this.props.dispatch({
        type: 'pfmmenu/list',
        payload: { sysId: 'damai-admin' },
      });
      this.getMenuScriptText(menus);
      this.setState({
        option: 'menuScriptText',
      });
    } else if (obj === 5) {
      this.props.dispatch({
        type: `pfmfunc/list`,
      });

      this.props.dispatch({
        type: 'pfmactimenu/list',
      });
      this.props.dispatch({
        type: 'pfmactiurn/list',
      });
      this.getFuncScriptSql(pfmfunc.pfmfunc);
      this.setState({
        option: 'funcSql',
      });
    } else if (obj === 6) {
      this.props.dispatch({
        type: `pfmsys/list`,
      });
      this.getSysSql(pfmsys.pfmsys);
      this.setState({
        option: 'sysSql',
      });
    } else if (obj === 7) {
      this.props.dispatch({
        type: `pfmrole/listAll`,
      });
      this.props.dispatch({
        type: 'pfmroleacti/list',
      });
      this.getRoleScriptSql(pfmrole.pfmrole);
      this.setState({
        option: 'roleSql',
      });
    } else if (obj === 8) {
      this.props.dispatch({
        type: 'pfmmenu/list',
        payload: { sysId: 'damai-admin' },
      });
      this.getMenuSql(menus);
      this.setState({
        option: 'menuSql',
      });
    }
  };

  copyText = () => {
    console.log(this.props);
    if (this.state.option === 'menuSql') {
      copy(this.state.menuSql);
      message.success('复制菜单Sql成功');
    } else if (this.state.option === 'sysScriptText') {
      copy(this.state.sysScriptText);
      message.success('复制系统Script成功');
    } else if (this.state.option === 'funcScriptText') {
      copy(this.state.funcScriptText);
      message.success('复制功能Script成功');
    } else if (this.state.option === 'roleScriptText') {
      copy(this.state.roleScriptText);
      message.success('复制角色Script成功');
    } else if (this.state.option === 'menuScriptText') {
      copy(this.state.menuScriptText);
      message.success('复制菜单Script成功');
    } else if (this.state.option === 'sysSql') {
      copy(this.state.sysSql);
      message.success('复制系统Sql成功');
    } else if (this.state.option === 'funcSql') {
      copy(this.state.funcSql);
      message.success('复制功能Sql成功');
    } else if (this.state.option === 'roleSql') {
      copy(this.state.roleSql);
      message.success('复制角色Sql成功');
    }
  };

  render() {
    const { user, pfmfunc, pfmsys, pfmrole } = this.props;
    const menus = user.menus;
    return (
      <PageHeaderLayout title="脚本">
        <Card bordered={false}>
          <div className={styles.tableListForm}>
            <Form onSubmit={this.handleSearch} layout="inline">
              <Row gutter={{ md: 6, lg: 24, xl: 0 }}>
                <Col md={18} sm={24}>
                  <FormItem style={{ float: 'left' }}>
                    <RadioGroup defaultValue="3">
                      <RadioButton value="3" onClick={() => this.select(3)}>
                        系统Sript
                      </RadioButton>
                      <RadioButton value="4" onClick={() => this.select(4)}>
                        菜单Sript
                      </RadioButton>
                      <RadioButton value="2" onClick={() => this.select(2)}>
                        功能Sript
                      </RadioButton>
                      <RadioButton value="1" onClick={() => this.select(1)}>
                        角色Sript
                      </RadioButton>
                      <RadioButton value="6" onClick={() => this.select(6)}>
                        系统Sql
                      </RadioButton>
                      <RadioButton value="8" onClick={() => this.select(8)}>
                        菜单Sql
                      </RadioButton>
                      <RadioButton value="5" onClick={() => this.select(5)}>
                        功能Sql
                      </RadioButton>
                      <RadioButton value="7" onClick={() => this.select(7)}>
                        角色Sql
                      </RadioButton>
                    </RadioGroup>
                  </FormItem>
                </Col>
                <Col md={3} sm={24}>
                  <Button onClick={() => this.copyText()}>复制</Button>
                </Col>
              </Row>
            </Form>
          </div>
          <Row gutter={{ md: 6, lg: 24, xl: 0 }}>
            {this.state.option === 'menuSql' && (
              <Col md={24} sm={24}>
                <textarea
                  defaultValue={this.state.menuSql}
                  style={{ width: '100%', whiteSpace: 'pre', overflow: 'scroll', height: 500 }}
                />
              </Col>
            )}
            {this.state.option === 'sysScriptText' && (
              <Col md={24} sm={24}>
                <textarea
                  value={this.state.sysScriptText}
                  style={{ width: '100%', whiteSpace: 'pre', overflow: 'scroll', height: 500 }}
                >
                  {this.getSysScriptText(pfmsys.pfmsys)}
                </textarea>
              </Col>
            )}
            {this.state.option === 'funcScriptText' && (
              <Col md={24} sm={24}>
                <textarea
                  defaultValue={this.state.funcScriptText}
                  style={{ width: '100%', whiteSpace: 'pre', overflow: 'scroll', height: 500 }}
                />
              </Col>
            )}
            {this.state.option === 'funcSql' && (
              <Col md={24} sm={24}>
                <textarea
                  defaultValue={this.state.funcSql}
                  style={{ width: '100%', whiteSpace: 'pre', overflow: 'scroll', height: 500 }}
                />
              </Col>
            )}
            {this.state.option === 'roleScriptText' && (
              <Col md={24} sm={24}>
                <textarea
                  defaultValue={this.state.roleScriptText}
                  style={{ width: '100%', whiteSpace: 'pre', overflow: 'scroll', height: 500 }}
                />
              </Col>
            )}
            {this.state.option === 'roleSql' && (
              <Col md={24} sm={24}>
                <textarea
                  defaultValue={this.state.roleSql}
                  style={{ width: '100%', whiteSpace: 'pre', overflow: 'scroll', height: 500 }}
                />
              </Col>
            )}
            {this.state.option === 'menuScriptText' && (
              <Col md={24} sm={24}>
                <textarea
                  defaultValue={this.state.menuScriptText}
                  style={{ width: '100%', whiteSpace: 'pre', overflow: 'scroll', height: 500 }}
                />
              </Col>
            )}
            {this.state.option === 'sysSql' && (
              <Col md={24} sm={24}>
                <textarea
                  defaultValue={this.state.sysSql}
                  style={{ width: '100%', whiteSpace: 'pre', overflow: 'scroll', height: 500 }}
                />
              </Col>
            )}
          </Row>
        </Card>
      </PageHeaderLayout>
    );
  }
}
