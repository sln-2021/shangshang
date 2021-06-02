import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tooltip } from 'antd';
import React from 'react';
import { ChartCard } from './Charts';
import { VisitDataType } from '../data.d';
import Yuan from '../utils/Yuan';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const IntroduceRow = ({ loading, visitData }: { loading: boolean; visitData: VisitDataType }) => (
  <Row gutter={24} type="flex">
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title="组织总预存金额"
        action={
          <Tooltip
            title="组织总预存金额"
          >
            <InfoCircleOutlined />
          </Tooltip>
        }
        loading={loading}
        total={() => <Yuan>{visitData.prestoreGroupBonusTotal || '--'}</Yuan>}
        contentHeight={46}
      >
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title="缴纳金额"
        action={
          <Tooltip
            title="缴纳金额"
          >
            <InfoCircleOutlined />
          </Tooltip>
        }
        loading={loading}
        total={() => <Yuan>{visitData.payGroupBonusTotal || '--'}</Yuan>}
        contentHeight={46}
      >
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title="退款金额"
        action={
          <Tooltip
            title="退款金额"
          >
            <InfoCircleOutlined />
          </Tooltip>
        }
        loading={loading}
        total={() => <Yuan>{visitData.refundGroupBonusTotal || '--'}</Yuan>}
        contentHeight={46}
      >
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title="当前总金额"
        action={
          <Tooltip
            title="当前总金额"
          >
            <InfoCircleOutlined />
          </Tooltip>
        }
        loading={loading}
        total={() => <Yuan>{visitData.nowGroupBonusTotal || '--'}</Yuan>}
        contentHeight={46}
      >
      </ChartCard>
    </Col>
  </Row>
);

export default IntroduceRow;
