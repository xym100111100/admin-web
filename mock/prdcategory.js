import { parse } from 'url';

const categoryTree = [
  {
    value: '603729874674253824',
    label: '食品饮料',
    children: [
      {
        value: '603729860396843008',
        label: '休闲食品',
        children: [
          {
            value: '603729858370994176',
            label: '薯片_膨化',
          },
        ],
      },
      {
        value: '603729862389137408',
        label: '蛋糕饼干',
        children: [
          {
            value: '603729860526866432',
            label: '进口饼干',
          },
        ],
      },
    ],
  },
  {
    value: '603729885277454336',
    label: '粮油副食',
    children: [
      {
        value: '603729875731218432',
        label: '食用油',
        children: [
          {
            value: '603729874804277248',
            label: '调和油',
          },
        ],
      },
      {
        value: '603729876750434304',
        label: '米面_面粉',
        children: [
          {
            value: '603729875857047552',
            label: '东北大米',
          },
        ],
      },
    ],
  },
];

/**
 * 获取产品分类树
 */
export function getCategoryTree(req, res) {
  res.json(categoryTree);
}
