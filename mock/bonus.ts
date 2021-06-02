import { Request, Response } from 'express';
import Mock from 'mockjs';

const getBonus = (req: Request, res: Response) => {
  res.json(
    Mock.mock({
      data: {
        endRow: 2,
        hasNextPage: false,
        hasPreviousPage: false,
        isFirstPage: true,
        isLastPage: true,
        'list|100': [
          {
            'bonusTotal|1-100': -510.0,
            'bonusType|0-2': 1,
            'createTime|1581503546000-1591904546000': 1581503546000,
            'id|1-100': 33,
            'matchId|1-100': 141,
            matchScheduleName: '渠道申报比赛测试',
          },
        ],
        navigateFirstPage: 1,
        navigateLastPage: 1,
        navigatePages: 8,
        navigatepageNums: [1],
        nextPage: 0,
        pageNum: 1,
        pageSize: 10,
        pages: 1,
        prePage: 0,
        size: 2,
        startRow: 1,
        total: 2,
      },
      msg: 'success',
      status: 200,
    }),
  );
};

export default {
  'GET /api/bonus': getBonus,
};
