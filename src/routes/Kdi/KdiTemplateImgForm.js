import React, { Fragment, PureComponent } from 'react';
import { Form, Row, Col,} from 'antd';
import { connect } from 'dva';
import EditForm from 'components/Rebue/EditForm';


// 添加与编辑的表单
@connect(({ kditemplate, kdicompany, loading }) => ({ kditemplate, kdicompany, loading: loading.models.kditemplate || loading.models.kdicompany }))
@EditForm
export default class KdiTemplateImgForm extends PureComponent {


  componentDidMount() {

  }

 

  render() {
    const { record } = this.props;
    console.log(record);
    return (
      <Fragment>
        <Form layout="inline">
          <Row gutter={{ md: 6, lg: 24, xl: 48 }}  >
            <Col md={24} sm={24} style={{textAlign:'center'}} >
                 <img  src={record.templateImgPath} />
            </Col>
          </Row>
        </Form>
      </Fragment>
    );
  }
}
