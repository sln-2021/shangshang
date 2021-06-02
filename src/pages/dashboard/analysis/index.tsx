import { Col, Row, DatePicker } from 'antd';
import React, { Component, Suspense } from 'react';
import { easyDispatch } from '@/utils/easyDispatch';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'umi';
import PageLoading from './components/PageLoading';
import moment from 'moment';

const IntroduceRow = React.lazy(() => import('./components/IntroduceRow'));
const TopSearch = React.lazy(() => import('./components/TopSearch'));

const { RangePicker } = DatePicker;
const ExtraContent: React.FC<{ onChange: () => void; onOk: () => void }> = ({ onChange, onOk }) => {
  return (
    <div>
      <RangePicker
        showTime={{ format: 'HH:mm' }}
        format="YYYY-MM-DD HH:mm"
        placeholder={['开始时间', '结束时间']}
        onOk={onOk}
      />
    </div>
  );
};

class Analysis extends Component {
  componentDidMount() {
    easyDispatch(this, 'dashboard/fetchStatistics');
  }

  onOk(value: any) {
    const [startTime, stopTime] = value
      ? [moment(value[0]).format('X'), moment(value[1]).format('X')]
      : [null, null];
    easyDispatch(this, 'dashboard/fetchStatistics', {
      startTime,
      stopTime,
    });
  }

  render() {
    const { statistics, loading } = this.props;
    let tableData = [
      {
        name: '赛事数',
        total: statistics.matchSubmitNumTotal,
        new: statistics.matchSubmitNumToday,
      },
      {
        name: '报名费',
        total: statistics.matchFeeTotal,
        new: statistics.matchFeeToday,
      },
      {
        name: '渠道',
        total: statistics.conNumTotal,
        new: statistics.conNumToday,
      },
      {
        name: '协办方',
        total: statistics.clubNumTotal,
        new: statistics.clubNumToday,
      },
      {
        name: '用户',
        total: statistics.userNumTotal,
        new: statistics.userNumToday,
      },
      {
        name: '玩家',
        total: statistics.playerNumTotal,
        new: statistics.playerNumToday,
      },
      {
        name: '比赛',
        total: statistics.matchNumTotal,
        new: statistics.matchNumToday,
      },
    ];

    return (
      <PageHeaderWrapper extraContent={<ExtraContent onOk={this.onOk.bind(this)} />}>
        <GridContent>
          <React.Fragment>
            <Suspense fallback={<PageLoading />}>
              <IntroduceRow loading={loading} visitData={statistics} />
            </Suspense>

            <Row
              gutter={24}
              type="flex"
              style={{
                marginTop: 24,
              }}
            >
              <Col span={24}>
                <Suspense fallback={null}>
                  <TopSearch loading={loading} searchData={tableData} />
                </Suspense>
              </Col>
            </Row>
          </React.Fragment>
        </GridContent>
      </PageHeaderWrapper>
    );
  }
}

export default connect(
  ({
    dashboard,
    loading,
  }: {
    dashboard: any;
    loading: {
      effects: { [key: string]: boolean };
    };
  }) => ({
    statistics: dashboard.statistics,
    loading: loading.effects['dashboard/fetchStatistics'],
  }),
)(Analysis);
