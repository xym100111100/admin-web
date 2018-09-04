import { isUrl } from '../utils/utils';

function formatter(data, parentPath = '/', parentAuthority) {
  // if (!data) return [];
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

/**
 * 原数据库的菜单数据的path只是当前这一级的路径，所以需要转换成全路径的形式
 */
export const getMenuData = menuData => formatter(menuData);
