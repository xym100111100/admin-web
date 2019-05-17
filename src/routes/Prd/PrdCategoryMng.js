import SimpleMng from 'components/Rebue/SimpleMng';
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Input, Divider, Switch } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './PrdCategoryMng.less';
import PrdCategoryForm from './PrdCategoryForm';

const Search = Input.Search;

@connect(({ onlsearchcategory, slrshop, loading }) => ({
  onlsearchcategory,
  slrshop,
  loading: loading.models.onlsearchcategory,
}))
export default class PrdCategoryMng extends SimpleMng {
  state = {
    sonClassData: [],
  };
  constructor() {
    super();
    this.moduleCode = 'onlsearchcategory';
    this.state.options = {
      pageNum: 1,
      pageSize: 5,
    };
  }

  componentDidMount() {
    // 刷新
    this.props.dispatch({
      type: `slrshop/shopList`,
      callback: () => {
        const { slrshop: { slrshop } } = this.props;
        this.handleReload({ shopId: slrshop[0].id });
      },
    });
  }

  // 刷新用户列表
  handleUserReload(selectedRows) {
    // 加载用户信息
    this.props.dispatch({
      /* type: 'onlsearchcategory/list',
            payload: {
                pageNum: 1,
                pageSize: 5,
                shopId: selectedRows.shopId,
            },
            callback: () => {
                this.setState({ selectedRows });
            }, */
    });
  }

  // 启用/禁用搜索分类
  handleEnable(record) {
    console.log(record);
    // this.props.dispatch({
    //   type: `onlsearchcategory/enable`,
    //   payload: {
    //     sellerId: record.sellerId,
    //     shopId: record.shopId,
    //     code: record.code,
    //     isEnabled: !record.isEnabled,
    //   },
    //   callback: () => {
    //     this.handleReload({ shopId: record.shopId });
    //   },
    // });
  }

  showSonCategory(record) {
    console.log(record);
    // 第二级分类数据
    const data = [
      { id: 123, name: '休闲食品' },
      { id: 456, name: '蛋糕饼干' },
      { id: 789, name: '坚果炒货' },
      { id: 1011, name: '蜜饯果干' },
      { id: 1213, name: '糖果_巧克力' },
      { id: 1415, name: '茗茶' },
      { id: 1617, name: '饮料_水' },
      { id: 1819, name: '冲调保健' },
      { id: 2021, name: '粮油调味' },
      { id: 2223, name: '冷饮' },
    ];

    this.setState({ sonClassData: data });
  }

  render() {
    // const { onlsearchcategory: { onlsearchcategory }, slrshop: { slrshop }, loading } = this.props;
    const { editForm, editFormType, editFormTitle, editFormRecord, sonClassData } = this.state;
    console.log(sonClassData);
    /* let ps;
    if (onlsearchcategory === undefined || onlsearchcategory.pageSize === undefined) {
      ps = 5;
    } else {
      ps = onlsearchcategory.pageSize;
    }
    let tl;
    if (onlsearchcategory === undefined || onlsearchcategory.total === undefined) {
      tl = 1;
    } else {
      tl = Number(onlsearchcategory.total);
    }
    let onlsearchcategoryData;
    if (onlsearchcategory === undefined) {
      onlsearchcategoryData = [];
    } else {
      onlsearchcategoryData = onlsearchcategory.list;
    } */

    // 第一级分类数据
    const data = [
      { id: 123, name: '食品饮料', isEnabled: false },
      { id: 456, name: '粮油副食', isEnabled: true },
      { id: 789, name: '个人护理', isEnabled: true },
      { id: 1011, name: '美容洗护', isEnabled: false },
      { id: 1213, name: '清洁用品', isEnabled: true },
      { id: 1415, name: '母婴用品', isEnabled: false },
      { id: 1617, name: '中外名酒', isEnabled: true },
      { id: 1819, name: '超市生鲜', isEnabled: false },
      { id: 2021, name: '家居家电', isEnabled: true },
      { id: 2223, name: '文体用品', isEnabled: true },
    ];

    // 分页
    const firstLevelPaginationProps = {
      showSizeChanger: true,
      pageSize: 5,
      total: data.length,
      pageSizeOptions: ['5', '10'],
      size: 'small',
    };

    // 第三级分类数据
    const thirdLevelData = [
      { id: 123, name: '薯片_膨化' },
      { id: 456, name: '海苔_海带' },
      { id: 789, name: '果蔬干' },
      { id: 1011, name: '果冻_龟苓膏_布丁' },
      { id: 1213, name: '辣条' },
      { id: 1415, name: '卤蛋' },
      { id: 1617, name: '熟食' },
      { id: 1819, name: '肉干_肉脯' },
      { id: 2021, name: '海鸭蛋' },
      { id: 2223, name: '豆制品' },
      { id: 2223, name: '油炸类糕点' },
      { id: 2223, name: '鱿鱼丝' },
      { id: 2223, name: '肉灌肠类' },
      { id: 2223, name: '笋' },
      { id: 2223, name: '凤爪' },
      { id: 2223, name: '鹌鹑蛋' },
      { id: 2223, name: '鱼仔' },
    ];

    // 分页
    const thirdLevelPaginationProps = {
      showSizeChanger: true,
      pageSize: 5,
      total: thirdLevelData.length,
      pageSizeOptions: ['5', '10'],
      size: 'small',
    };

    return (
      <Fragment>
        <PageHeaderLayout>
          <div className="div1" style={{ display: 'flex' }}>
            <div style={{ width: '30%', backgroundColor: '#fff' }}>
              <div className={styles.main}>
                <div>
                  <Search placeholder="分类名称" />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '1.1rem',
                    height: '25rem',
                    overflow: 'auto',
                  }}
                >
                  <div className={styles.classList}>
                    <div className={styles.classList__content}>
                      {data.map(item => (
                        <ul>
                          <li
                            onClick={() => {
                              this.showSonCategory(item);
                            }}
                          >
                            {item.name}
                          </li>
                          <li>
                            <Switch
                              checkedChildren="启用"
                              unCheckedChildren="停用"
                              checked={item.isEnabled}
                              onChange={() => this.handleEnable(item)}
                            />
                          </li>
                          <li>
                            <a
                              onClick={() =>
                                this.showAddForm({
                                  editForm: 'onlOnlineSpecForm',
                                  editFormTitle: '规格信息',
                                })
                              }
                            >
                              编辑
                            </a>
                            <Divider type="vertical" />
                            <a
                              onClick={() =>
                                this.showEditForm({
                                  editForm: 'onlineForm',
                                  editFormTitle: '重新上线',
                                })
                              }
                            >
                              添加
                            </a>
                          </li>
                        </ul>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageHeaderLayout>,
        {editForm === 'prdCategoryForm' && (
          <PrdCategoryForm
            visible
            title={editFormTitle}
            editFormType={editFormType}
            record={editFormRecord}
            closeModal={() => this.setState({ editForm: undefined })}
            onSubmit={fields => this.handleSubmit({ fields })}
          />
        )}
      </Fragment>
    );
  }
}
