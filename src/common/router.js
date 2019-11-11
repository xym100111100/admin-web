import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach(model => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () => models.filter(model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = app => {
  const routerConfig = {
    // ****************** 业务路由 *******************
    '/home/index': {
      component: dynamicWrapper(app, ['homeindex', 'user', 'ordorder'], () =>
        import('../routes/Home/HomeIndex')
      ),
    },
    '/home/SupIndex': {
      component: dynamicWrapper(app, ['homeindex', 'user', 'ordorder'], () =>
        import('../routes/Home/SupIndex')
      ),
    },
    '/stu/stu-student': {
      component: dynamicWrapper(app, ['student'], () => import('../routes/stu/student')),
    },
    '/pnt/pnt-list': {
      component: dynamicWrapper(app, ['pntList'], () => import('../routes/Pnt/pntList')),
    },
    '/rna/rna-realname': {
      component: dynamicWrapper(app, ['rnarealname'], () => import('../routes/Rna/RnaRealname')),
    },
    '/rep/rep-logistic': {
      component: dynamicWrapper(app, ['replogistic', 'kdicompany', 'user'], () => import('../routes/Rep/RepLogistic')),
    },
    '/rep/rep-revenue': {
      component: dynamicWrapper(app, ['reprevenue', 'kdicompany', 'user' ], () => import('../routes/Rep/RepRevenue')),
    },
    '/kdi/kdi-mng': {
      component: dynamicWrapper(app, ['kdilogistic', 'kdientry', 'kdicompany'], () =>
        import('../routes/Kdi/KdiLogistic')
      ),
    },
    '/kdi/kdi-eorder': {
      component: dynamicWrapper(app, ['kdieorder', 'kdisender', 'user', 'kdireceiver', 'kdicompany', 'kdilogistic'], () =>
        import('../routes/Kdi/KdiEorder')
      ),
    },
    '/kdi/kdi-cfg/kdi-template-cfg': {
      component: dynamicWrapper(app, ['kditemplate', 'kdicompany', 'user'], () => import('../routes/Kdi/KdiTemplate')),
    },
    '/kdi/kdi-cfg/kdi-company-cfg': {
      component: dynamicWrapper(app, ['kdicompany', 'slrshop', 'kditemplate', 'kdicompanydic', 'user'], () => import('../routes/Kdi/KdiCompany')),
    },
    '/kdi/kdi-batch': {
      component: dynamicWrapper(app, ['kdieorder', 'kdicompany', 'kditemplate', 'kdicompanydic', 'user', 'kdisender'], () => import('../routes/Kdi/KdiBatch')),
    },
    '/kdi/kdi-batch-sub': {
      component: dynamicWrapper(app, ['kdieorder', 'kdicompany', 'kditemplate', 'kdicompanydic', 'user', 'kdisender'], () => import('../routes/Kdi/KdiBatchSubscribe')),
    },
    '/kdi/kdi-cfg/kdi-sender-cfg': {
      component: dynamicWrapper(app, ['kdisender', 'slrshop', 'user'], () => import('../routes/Kdi/KdiSenderCfg')),
    },
    '/ord/ord-order': {
      component: dynamicWrapper(app, ['ordorder', 'slrshopaccount', 'kdicompany', 'user', 'kdisender', 'suporder'], () =>
        import('../routes/Ord/OrdOrder')
      ),
    },
    '/ord/ord-return': {
      component: dynamicWrapper(app, ['ordreturn', 'user'], () =>
        import('../routes/Ord/OrdReturn')
      ),
    },
    '/sup/sup-order': {
      component: dynamicWrapper(app, ['suporder', 'kdicompany', 'user', 'kdisender'], () =>
        import('../routes/Sup/SupOrder')
      ),
    },
    '/sup/sup-account': {
      component: dynamicWrapper(app, ['supaccount', 'ordorder', 'kdicompany', 'afcapplywithdrawaccount', 'user', 'kdisender'], () =>
        import('../routes/Sup/SupAccount')
      ),
    },
    '/sup/sup-goods': {
      component: dynamicWrapper(app, ['supgoods', 'user', 'onlonline'], () =>
        import('../routes/Sup/SupGoods')
      ),
    },
    '/pfm/sys-mng': {
      component: dynamicWrapper(app, ['pfmsys'], () => import('../routes/Pfm/SysMng')),
    },
    '/suc/domain-mng': {
      component: dynamicWrapper(app, ['sucdomain'], () => import('../routes/Suc/DomainMng')),
    },
    '/suc/user-domain-mng': {
      component: dynamicWrapper(app, ['sucdomain', 'sucuserdomain'], () => import('../routes/Suc/UserDomainMng')),
    },
    '/xyz/area': {
      component: dynamicWrapper(app, ['xyzarea'], () => import('../routes/Xyz/XyzArea')),
    },
    '/xyz/areasendorg': {
      component: dynamicWrapper(app, ['xyzareasendorg', 'sucorg'], () => import('../routes/Xyz/XyzAreaSendOrg')),
    },
    '/pfm/menu-mng': {
      component: dynamicWrapper(app, ['pfmsys', 'pfmmenu'], () => import('../routes/Pfm/MenuMng')),
    },
    '/pfm/func-mng': {
      component: dynamicWrapper(app, ['pfmsys', 'pfmfunc', 'pfmacti', 'pfmactimenu', 'pfmactiurn', 'pfmmenu'], () =>
        import('../routes/Pfm/FuncMng')
      ),
    },
    '/afc/afc-applywithdrawaccount-mng': {
      component: dynamicWrapper(app, ['afcapplywithdrawaccount'], () =>
        import('../routes/Afc/ApplyWithdrawAccountMng')
      ),
    },
    '/afc/afc-withdraw-mng': {
      component: dynamicWrapper(app, ['afcwithdraw'], () =>
        import('../routes/Afc/WithdrawMng')
      ),
    },
    '/afc/afc-withdrawaccount-mng': {
      component: dynamicWrapper(app, ['afcwithdrawaccount'], () =>
        import('../routes/Afc/WithdrawAccountMng')
      ),
    },
    '/afc/afc-flow-mng': {
      component: dynamicWrapper(app, ['afcflow'], () =>
        import('../routes/Afc/FlowMng')
      ),
    },
    '/afc/afc-org-account': {
      component: dynamicWrapper(app, ['orgaccount', 'sucorg'], () =>
        import('../routes/Afc/OrgAccount')
      ),
    },
    '/prm/prm-partner-mng': {
      component: dynamicWrapper(app, ['prmpartner'], () =>
        import('../routes/Prm/PartnerMng')
      ),
    },
    '/slr/slr-shop-mng': {
      component: dynamicWrapper(app, ['slrshop', 'slrshopaccount', 'onlsearchcategory', 'user'], () =>
        import('../routes/Slr/SlrShopMng')
      ),
    },
    '/slr/slr-seller-mng': {
      component: dynamicWrapper(app, ['slrseller', 'user', 'slrshop', 'slrshopaccount'], () =>
        import('../routes/Slr/SlrSellerMng')
      ),
    },
    '/slr/slr-onl-search-category-mng': {
      component: dynamicWrapper(app, ['onlsearchcategory', 'user', 'slrshop'], () =>
        import('../routes/Slr/SlrOnlSearchCategoryMng')
      ),
    },

    '/pfm/script-mng': {
      component: dynamicWrapper(
        app,
        [
          'kdicompany',
          'pfmroleacti',
          'pfmscript',
          'pfmmenu',
          'user',
          'pfmactimenu',
          'pfmactiurn',
          'pfmsys',
          'pfmrole',
          'pfmfunc',
        ],
        () => import('../routes/Pfm/ScriptMng')
      ),
    },
    '/pfm/role-mng': {
      component: dynamicWrapper(app, ['pfmsys', 'pfmrole', 'pfmroleacti', 'pfmfunc', 'sucuser', 'pfmuserrole'], () =>
        import('../routes/Pfm/RoleMng')
      ),
    },
    '/suc/user-mng': {
      component: dynamicWrapper(app, ['sucuser', 'pfmsys', 'pntList', 'pfmuserrole', 'sucorg', 'sucuserorg'], () =>
        import('../routes/Suc/UserMng')
      ),
    },
    '/suc/org-mng': {
      component: dynamicWrapper(app, ['sucuser', 'sucorg', 'sucuserorg', 'user', 'slrshop'], () => import('../routes/Suc/OrgMng')),
    },
    '/suc/org-user-mng': {
      component: dynamicWrapper(app, ['sucuser', 'pfmsys', 'pntList', 'pfmuserrole', 'sucorg', 'sucuserorg'], () =>
        import('../routes/Suc/OrgUserMng')
      ),
    },
    '/onl/onl-mng': {
      component: dynamicWrapper(app, ['onlonline', 'slrshop', 'user', 'BraftEditorUpload', 'onlonlineporomotion', 'prmpartner'], () =>
        import('../routes/Onl/OnlineMng')
      ),
    },
    '/onl/onl-import-product': {
      component: dynamicWrapper(app, ['importproduct',], () =>
        import('../routes/Onl/ImportProduct')
      ),
    },
    '/onl/onl-good-from-product': {
      component: dynamicWrapper(app, ['goodfromproduct','prdproductspec','prdproductpic','prdproduct','onlonline', 'slrshop', 'user', 'BraftEditorUpload', 'onlonlineporomotion', 'prmpartner'], () =>
        import('../routes/Onl/GoodFromProduct')
      ),
    },
    '/prd/prd-category-mng': {
      component: dynamicWrapper(app, ['prdproductcategory', 'slrshop', 'onlonline', 'BraftEditorUpload', 'onlonlineporomotion', 'prmpartner'], () =>
        import('../routes/Prd/PrdCategoryMng')
      ),
    },
    '/prd/prd-product-mng': {
      component: dynamicWrapper(app, ['BraftEditorUpload', 'prdproductpic', 'prdproductcategory', 'prdproduct', 'prdproductspec'], () =>
        import('../routes/Prd/PrdProductMng')
      ),
    },
    // ****************** 基础路由 ******************
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../routes/User/Login')),
    },
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },

    // ****************** Ant Design Pro原始示例 ******************
    '/dashboard/analysis': {
      component: dynamicWrapper(app, ['chart'], () => import('../routes/Dashboard/Analysis')),
    },
    '/dashboard/monitor': {
      component: dynamicWrapper(app, ['monitor'], () => import('../routes/Dashboard/Monitor')),
    },
    '/dashboard/workplace': {
      component: dynamicWrapper(app, ['project', 'activities', 'chart'], () => import('../routes/Dashboard/Workplace')),
      // hideInBreadcrumb: true,
      // name: '工作台',
      // authority: 'admin',
    },
    '/form/basic-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/BasicForm')),
    },
    '/form/step-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm')),
    },
    '/form/step-form/info': {
      name: '分步表单（填写转账信息）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step1')),
    },
    '/form/step-form/confirm': {
      name: '分步表单（确认转账信息）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step2')),
    },
    '/form/step-form/result': {
      name: '分步表单（完成）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step3')),
    },
    '/form/advanced-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/AdvancedForm')),
    },
    '/list/table-list': {
      component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList')),
    },
    '/list/basic-list': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/BasicList')),
    },
    '/list/card-list': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/CardList')),
    },
    '/list/search': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/List')),
    },
    '/list/search/projects': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Projects')),
    },
    '/list/search/applications': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Applications')),
    },
    '/list/search/articles': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Articles')),
    },
    '/profile/basic': {
      component: dynamicWrapper(app, ['profile'], () => import('../routes/Profile/BasicProfile')),
    },
    '/profile/advanced': {
      component: dynamicWrapper(app, ['profile'], () => import('../routes/Profile/AdvancedProfile')),
    },
    '/result/success': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Success')),
    },
    '/result/fail': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Error')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () => import('../routes/Exception/triggerException')),
    },
    '/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    },
    // '/user/:id': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/SomeComponent')),
    // },
  };
  // Get name from ./menu.js or just set it in the router data.
  // const menuData = getFlatMenuData(getMenuData());
  const menuData = getFlatMenuData([]);

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];

    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
    };
    routerData[path] = router;
  });

  return routerData;
};