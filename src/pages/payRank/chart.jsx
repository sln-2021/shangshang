import { Icon } from '@ant-design/compatible';
/* eslint-disable react/jsx-no-bind */
import React, { Fragment, useState, useRef, useEffect } from 'react';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { message,  Tag, Card } from 'antd';
import ProTable from '@ant-design/pro-table';
import { COMMODITY_TYPE } from '../../common/convert'
import { queryPayRankTotal } from './service';
import { Column } from '@ant-design/charts';

const PayRank = () => {
  const [data, setData] = useState([{

  }]);
  const actionRef = useRef();

  useEffect(() => {
    queryPayRankTotal().then((res) => {
      if (res.status === 200) {
        setData(res.data);
        console.log(res.data)
        const type = ['app', 'wechat', 'wxmini']
        const appObj = []
        const wxminiObj = []
        const wechatObj = []
        for (let i = 0; i < 7; i++) {
          appObj.push({
            name: '安卓',
            date: moment().subtract(7 - i - 1, 'days').format("YYYY-MM-DD"),
            num: res.data['app'][i]
          })
          wxminiObj.push({
            name: '小游戏',
            date: moment().subtract(7 - i - 1, 'days').format("YYYY-MM-DD"),
            num: res.data['wxmini'][i]
          })
          wechatObj.push({
            name: 'H5',
            date: moment().subtract(7 - i - 1, 'days').format("YYYY-MM-DD"),
            num: res.data['wechat'][i]
          })
        }


        setData([...appObj, ...wxminiObj, ...wechatObj])


      }
    });
  }, []);

  const chartData = [
    {
      name: 'app',
      月份: 'Jan.',
      月均降雨量: 18.9,
    },
    {
      name: 'London',
      月份: 'Feb.',
      月均降雨量: 28.8,
    },
    {
      name: 'London',
      月份: 'Mar.',
      月均降雨量: 39.3,
    },
    {
      name: 'London',
      月份: 'Apr.',
      月均降雨量: 81.4,
    },
    {
      name: 'London',
      月份: 'May',
      月均降雨量: 47,
    },
    {
      name: 'London',
      月份: 'Jun.',
      月均降雨量: 20.3,
    },
    {
      name: 'London',
      月份: 'Jul.',
      月均降雨量: 24,
    },
    {
      name: 'London',
      月份: 'Aug.',
      月均降雨量: 35.6,
    },
    {
      name: 'Berlin1',
      月份: 'Jan.',
      月均降雨量: 12.4,
    },
    {
      name: 'Berlin2',
      月份: 'Jan.',
      月均降雨量: 12.4,
    },
    {
      name: 'Berlin',
      月份: 'Jan.',
      月均降雨量: 12.4,
    },
    {
      name: 'Berlin',
      月份: 'Feb.',
      月均降雨量: 23.2,
    },
    {
      name: 'Berlin',
      月份: 'Mar.',
      月均降雨量: 34.5,
    },
    {
      name: 'Berlin',
      月份: 'Apr.',
      月均降雨量: 99.7,
    },
    {
      name: 'Berlin',
      月份: 'May',
      月均降雨量: 52.6,
    },
    {
      name: 'Berlin',
      月份: 'Jun.',
      月均降雨量: 35.5,
    },
    {
      name: 'Berlin',
      月份: 'Jul.',
      月均降雨量: 37.4,
    },
    {
      name: 'Berlin',
      月份: 'Aug.',
      月均降雨量: 42.4,
    },
  ];
  const config = {
    data,
    isGroup: true,
    xField: 'date',
    yField: 'num',
    seriesField: 'name',
    color: ['#f50', '#2db7f5', '#87d068'],
    label: {
      position: 'middle',
      layout: [{ type: 'interval-adjust-position' }, { type: 'adjust-color' }],
    },
    marginRatio: 0
  };
  console.log(data)
  return (
    <PageHeaderWrapper>
      <Card >
        <div style={{ width: '100%', height: '700px', padding: '20px' }}>

          <Column {...config} />
        </div>
      </Card>
    </PageHeaderWrapper>
  );
}


export default PayRank;