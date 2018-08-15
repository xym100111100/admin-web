import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '快递管理',
    icon: 'profile',
    path: 'kdi',
    children: [
      {
        name: '快递下单',
        path: 'kdi-eorder',
      },
      {
        name: '快递单录入',
        path: 'kdi-entry',
      },
      {
        name: '快递单管理',
        path: 'kdi-mng',
      },
      {
        name: '快递配置',
        path: 'kdi-cfg',
        children: [
          {
            name: '快递面单配置',
            path: 'kdi-eorder-cfg',
          },
          {
            name: '快递公司配置',
            path: 'kdi-company-cfg',
          },
        ],
      },
    ],
  },
  {
    name: '实名认证',
    icon: 'hdd',
    path: 'rna',
    children: [
      {
        name: '认证用户信息',
        path: 'rna-realname',
      },
    ],
  },
  {
    name: '系统配置',
    icon: 'setting',
    path: 'pfm',
    children: [
      {
        name: '系统',
        path: 'sys-mng',
      },
      {
        name: '菜单',
        path: 'menu-mng',
      },
      {
        name: '功能',
        path: 'func-mng',
      },
      {
        name: '角色',
        path: 'role-mng',
      },
    ],
  },
  {
    name: '用户管理',
    icon: 'user',
    path: 'suc',
    children: [
      {
        name: '用户信息',
        path: 'user-mng',
      },
      {
        name: '组织信息',
        path: 'org-mng',
      },
    ],
  },
  {
    name: 'dashboard',
    icon: 'dashboard',
    path: 'dashboard',
    children: [
      {
        name: '分析页',
        path: 'analysis',
      },
      {
        name: '监控页',
        path: 'monitor',
      },
      {
        name: '工作台',
        path: 'workplace',
        // hideInBreadcrumb: true,
        // hideInMenu: true,
      },
    ],
  },
  {
    name: '表单页',
    icon: 'form',
    path: 'form',
    children: [
      {
        name: '基础表单',
        path: 'basic-form',
      },
      {
        name: '分步表单',
        path: 'step-form',
      },
      {
        name: '高级表单',
        authority: 'admin',
        path: 'advanced-form',
      },
    ],
  },
  {
    name: '列表页',
    icon: 'table',
    path: 'list',
    children: [
      {
        name: '查询表格',
        path: 'table-list',
      },
      {
        name: '标准列表',
        path: 'basic-list',
      },
      {
        name: '卡片列表',
        path: 'card-list',
      },
      {
        name: '搜索列表',
        path: 'search',
        children: [
          {
            name: '搜索列表（文章）',
            path: 'articles',
          },
          {
            name: '搜索列表（项目）',
            path: 'projects',
          },
          {
            name: '搜索列表（应用）',
            path: 'applications',
          },
        ],
      },
    ],
  },
  {
    name: '详情页',
    icon: 'profile',
    path: 'profile',
    children: [
      {
        name: '基础详情页',
        path: 'basic',
      },
      {
        name: '高级详情页',
        path: 'advanced',
        authority: 'admin',
      },
    ],
  },
  {
    name: '结果页',
    icon: 'check-circle-o',
    path: 'result',
    children: [
      {
        name: '成功',
        path: 'success',
      },
      {
        name: '失败',
        path: 'fail',
      },
    ],
  },
  {
    name: '异常页',
    icon: 'warning',
    path: 'exception',
    children: [
      {
        name: '403',
        path: '403',
      },
      {
        name: '404',
        path: '404',
      },
      {
        name: '500',
        path: '500',
      },
      {
        name: '触发异常',
        path: 'trigger',
        hideInMenu: true,
      },
    ],
  },
  {
    name: '账户',
    icon: 'user',
    path: 'user',
    authority: 'guest',
    children: [
      {
        name: '登录',
        path: 'login',
      },
      {
        name: '注册',
        path: 'register',
      },
      {
        name: '注册结果',
        path: 'register-result',
      },
    ],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
