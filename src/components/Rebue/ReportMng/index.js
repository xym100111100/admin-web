import { PureComponent } from 'react';

// 简单的增删改查的管理函数
// 可编辑的管理页面
export default class ReportMng extends PureComponent {
  state = {
    reportMethod: undefined, // 请求报表的方法名称
  };

  componentDidMount() {
    this.handleReload();
  }

  // 刷新
  handleReload(params) {
    if (params) {
      Object.assign(this.state.options, params);
    }
    const payload = this.state.options;

    // 刷新
    this.props.dispatch({
      type: `${this.moduleCode}/${this.reportMethod}`,
      payload,
    });
  }

  // 查询
  handleSearch = e => {
    // 如果是查询form的提交
    if (e.preventDefault) {
      e.preventDefault();
      const { form } = this.props;

      form.validateFields((err, fieldsValue) => {
        if (err) return;
        this.handleReload({ ...fieldsValue });
      });
    } else {
      // 否则是直接传值的查询
      this.handleReload({ keys: e });
    }
  };
}
