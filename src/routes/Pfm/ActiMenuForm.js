import { Card, Input, Tree } from 'antd';
import EditForm from 'components/Rebue/EditForm';
import { connect } from 'dva';
import React, { Fragment, PureComponent } from 'react';
import TreeUtils from '../../utils/TreeUtils';
import styles from './ActiMenuForm.less';

// 添加与编辑的表单
@connect(({ pfmactimenu, pfmmenu, loading }) => ({
  pfmactimenu,
  pfmmenu,
  loading: loading.models.pfmacti || loading.effects['pfmactimenu/list'] || loading.models.pfmmenu,
  submitting: loading.effects['pfmactimenu/modify'],
}))
@EditForm
export default class ActiMenuForm extends PureComponent {
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
      type: 'pfmmenu/list',
      payload: { sysId },
      callback: () => {
        const { pfmmenu: { pfmmenu }, actiId } = this.props;
        // 刷新
        this.props.dispatch({
          type: 'pfmactimenu/list',
          payload: { actiId },
          callback: () => {
            const { form, pfmactimenu: { pfmactimenu } } = this.props;
            const checkedIds = [];
            form.setFieldsInitialValue({ actiId, menuIds: pfmactimenu });
            for (const item of pfmactimenu) {
              checkedIds.push(`${item.menuId}`);
            }
            this.setState({ checkedIds, treeData: pfmmenu });
          },
        });
      },
    });
  }

  onCheck = checkedKeys => {
    const { form } = this.props;
    let menuIds = checkedKeys.checked ? checkedKeys.checked : [];
    menuIds = checkedKeys.halfChecked ? menuIds.concat(checkedKeys.halfChecked) : [];
    menuIds = menuIds.map(Number);
    form.setFieldsValue({ menuIds });
  };

  render() {
    const { form, loading } = this.props;
    const { treeData, checkedIds } = this.state;

    return (
      <Fragment>
        <Card className={styles.body} loading={loading} bordered={false}>
          {form.getFieldDecorator('actiId')(<Input type="hidden" />)}
          {form.getFieldDecorator('menuIds')(<Input type="hidden" />)}
          <Tree
            defaultCheckedKeys={checkedIds}
            checkable
            checkStrictly
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
