import { Card, Input, Tree } from 'antd';
import EditForm from 'components/Rebue/EditForm';
import { connect } from 'dva';
import React, { Fragment, PureComponent } from 'react';
import TreeUtils from '../../utils/TreeUtils';
import styles from './RoleActiForm.less';

// 添加与编辑的表单
@connect(({ pfmroleacti, pfmfunc, loading }) => ({
  pfmroleacti,
  pfmfunc,
  loading: loading.effects['pfmroleacti/list'] || loading.effects['pfmfunc/list'],
  submitting: loading.effects['pfmroleacti/modify'],
}))
@EditForm
export default class RoleActiForm extends PureComponent {
  constructor() {
    super();
    this.state = {
      treeData: [],
      checkedIds: [],
    };
  }

  componentDidMount() {
    const { sysId } = this.props;
    // 刷新
    this.props.dispatch({
      type: 'pfmfunc/list',
      payload: { sysId, isAuth: true },
      callback: () => {
        const { pfmfunc: { pfmfunc }, roleId } = this.props;
        // 刷新
        this.props.dispatch({
          type: 'pfmroleacti/list',
          payload: { roleId },
          callback: () => {
            const { form, pfmroleacti: { pfmroleacti } } = this.props;
            const checkedIds = [];
            for (const item of pfmroleacti) {
              checkedIds.push(`${item.actiId}`);
            }
            form.setFieldsInitialValue({ roleId, actiIds: checkedIds });
            this.setState({ checkedIds, treeData: pfmfunc });
          },
        });
      },
    });
  }

  onCheck = checkedKeys => {
    const { form } = this.props;
    const actiIds = checkedKeys
      ? checkedKeys.filter(key => key.substr(0, 4) === 'acti').map(key => Number(key.substr(4)))
      : [];
    form.setFieldsValue({ actiIds });
  };

  render() {
    const { form, loading } = this.props;
    const { treeData, checkedIds } = this.state;

    return (
      <Fragment>
        <Card className={styles.body} loading={loading} bordered={false}>
          {form.getFieldDecorator('roleId')(<Input type="hidden" />)}
          {form.getFieldDecorator('actiIds')(<Input type="hidden" />)}
          <Tree
            defaultCheckedKeys={checkedIds.map(id => `acti${id}`)}
            checkable
            defaultExpandAll
            multiple
            onCheck={this.onCheck}
          >
            {TreeUtils.renderTreeNodes(treeData)}
          </Tree>
        </Card>
      </Fragment>
    );
  }
}
