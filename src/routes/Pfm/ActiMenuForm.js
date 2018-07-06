import React, { Fragment, PureComponent } from 'react';
import { Form, Input, Tree } from 'antd';
import { connect } from 'dva';
import EditForm from 'components/Rebue/EditForm';
import TreeUtils from '../../utils/TreeUtils';

const FormItem = Form.Item;

// 添加与编辑的表单
@connect(({ pfmmenu, loading }) => ({
  pfmmenu,
  loading: loading.models.pfmacti || loading.models.pfmactimenu,
}))
@EditForm
export default class ActiMenuForm extends PureComponent {
  constructor() {
    super();
    this.state = {
      treeData: [],
    };
  }

  componentDidMount() {
    const { sysId } = this.props;
    // 刷新
    this.props.dispatch({
      type: 'pfmmenu/refresh',
      payload: { sysId },
      callback: () => {
        console.log(this.props);
        const { pfmmenu: { pfmmenu } } = this.props;
        this.setState({ treeData: pfmmenu });
      },
    });
  }

  render() {
    const { form } = this.props;
    const { treeData } = this.state;
    return (
      <Fragment>
        <FormItem>{form.getFieldDecorator('id')(<Input type="hidden" />)}</FormItem>
        <Tree>{TreeUtils.renderTreeNodes(treeData)}</Tree>
      </Fragment>
    );
  }
}
