import { Form } from '@ant-design/compatible';
// @ts-check
import React from 'react';
import {  Row, Col, Input, Card } from 'antd';
import { USER_TYPE_MAP, USER_STATE_MAP } from '../../../../common/convert';

/**
 * @augments {React.PureComponent<{
    loading: boolean;
    details: any;
  }, {}>}
 */

// @ts-ignore
@Form.create()
export default class DetailsBasicInfoCard extends React.PureComponent {
  render() {
    const { loading, details } = this.props;

    return (
      <Form layout="vertical" hideRequiredMark >
        <Card title="基础信息" bordered={false} loading={loading} style={{ marginBottom: 24 }}>
          <Row gutter={16} style={{ marginTop: '24px' }}>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="编号">
                <Input style={{ width: '100%' }}
                  value={details.id || '--'}
                  disabled />
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="用户名">
                <Input style={{ width: '100%' }}
                  value={details.username || '--'}
                  disabled />
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="用户类型">
                <Input style={{ width: '100%' }}
                  value={details.userType ? (
                    `${USER_TYPE_MAP[details.userType]} `
                  ) : '--'}
                  disabled />
              </Form.Item>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <Form.Item label="用户状态">
                <Input style={{ width: '100%' }}
                  value={details.userStatus ? (
                    `${USER_STATE_MAP[details.userStatus]} `
                  ) : '--'}
                  disabled />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    );
  }
}
