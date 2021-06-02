import React from 'react';
import _ from "lodash";
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Alert, message,  Button, Row, Col, Upload, Card, Icon, Input, Tag } from 'antd';
import { easyDispatch } from '@/utils/easyDispatch';
import { getErrorMessage } from '../../../common/convertError';
import { getId, getUserType, getUserStatus } from '@/utils/tokenStorage';
import { StateType } from '../../../models/club';
import AvatarIcon from '../../../components/AvatarIcon';
import Pictures from '../../../components/Pictures/index'
import { ORGANIZER_STATE_MAP } from '../../../common/convert';
import { Form } from '@ant-design/compatible';
// @ts-ignore
@Form.create()
class UnverifiedClub extends React.Component {
  state = {
    error: '',
    isUpload: false,
    isBusinessLicenseButton: false,
    isCorporateFileButton: false,
    isCorporateFanFileButton: false,
  }

  componentDidMount() {
    const flag = this.isFirstLanding();
    flag ? null : this.queryClub()
  }


  onClearIsUpload() {
    this.setState({
      isBusinessLicenseButton: false,
      isCorporateFileButton: false,
      isCorporateFanFileButton: false,
    })
  }

  // @ts-ignore
  onError(response) { this.setState({ error: getErrorMessage(response) }); }

  // @ts-ignore
  clearError() { this.setState({ error: '' }); }


  handleSubmit = e => {
    e.preventDefault();
    // 此处获取的 falg 是为了判断登录用户是否有提交过表单数据
    // 如果提交过执行修改操作，没提交过执行添加操作
    const flag = this.isFirstLanding()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) return;

      easyDispatch(this, flag ? 'club/addClub' : 'club/changeClub', {
        // 普通字符串数据 key:values
        ..._.pick(
          values,
          'accountNumber', 'bankBranch', 'bankName', 'corporateAddress',
          'corporateEmail', 'corporateId', 'corporateName', 'name'
        ),
        id: getId('clubId'),
        // 二进制文件数据
        logoFile: values.logoFile && values.logoFile.fileList[0] ? values.logoFile.fileList[0].originFileObj : null,
        businessLicenseFile: values.businessLicenseFile && values.businessLicenseFile.fileList[0] ? values.businessLicenseFile.fileList[0].originFileObj : null,
        corporateFile: values.corporateFile && values.corporateFile.fileList[0] ? values.corporateFile.fileList[0].originFileObj : null,
        corporateFanFile: values.corporateFanFile && values.corporateFanFile.fileList[0] ? values.corporateFanFile.fileList[0].originFileObj : null,
        // 回调方法处理事务
        onError: (code: any) => message.error(code.msg),
        //  this.onError.bind(this),
        onOk: () => {
          message.success('操作成功!');
          this.onClearIsUpload();
          // 如果用户提交过表单，去请求数据填充表单
          // 去执行刷新用户信息，将用户信息存入 localStorage
          if (flag) {
            easyDispatch(this, 'user/fetchUserInfo', {
              onOk: () => { this.queryClub(); this.isFirstLanding() },
              onError: () => console.log('刷新用信息失败')
            })
            this.onClearIsUpload();
          }
        },
      });
    });
  };

  queryClub() {
    const id = getId('clubId')
    if (!id) return;
    this.clearError();
    easyDispatch(this, 'club/fetchClubDetail', {
      id,
      onError: this.onError.bind(this),
    });
  }

  isFirstLanding() {
    // 1. 先判断身份，用户有没有提交过数据
    const userType = getUserType()
    const flag = userType === 'UNAUTHCLUBUSER' ? true : false;
    // 2. 如果提交过数据,那么下次提交数据的时候，走修改数据接口
    return flag
  }

  /*
  这个函数是获取用户登录状态是否为 6(被拒绝)，
  还有登录者的类型是不是第一次登录
  来判断当前页面的按钮是否显示
  */
  pageButtonState() {
    const isFirstLanding = this.isFirstLanding()
    const isRejective = getUserStatus()?.toString() === '5'
    if (isFirstLanding || isRejective) {
      return true
    } else {
      return false
    }
  }

  render() {
    const IconFont = Icon.createFromIconfontCN({ scriptUrl: '//at.alicdn.com/t/font_1625968_d6hvs7qs18.js' });
    const simpleRules = (message: string) => ([{ required: true, message }]);
    const { error, isUpload, isBusinessLicenseButton, isCorporateFileButton, isCorporateFanFileButton } = this.state;
    const { loadingfetch, loadingAdd, loadingChange, form, clubDetail } = this.props;
    const isBtnDisplay = this.pageButtonState()

    return (
      <Form layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>
        <PageHeaderWrapper
          content={
            <div>当前审核状态：<Tag>
              {
                clubDetail.status ? (
                  `${ORGANIZER_STATE_MAP[clubDetail.status].name} ${ORGANIZER_STATE_MAP[clubDetail.status].icon}`
                ) : '待提交资料'
              }
            </Tag>
              <div>
                请耐心等待管理员审核，当管理员拒绝时可以修改审核信息.
            </div>
            </div>
          }
          extraContent={
            isBtnDisplay ? <Button loading={loadingAdd || loadingChange} type='primary' htmlType="submit">提交</Button> : null
          }
        >
          {error ? (<Alert message={error} type="error" showIcon style={{ marginBottom: 10 }} />) : null}


          <Card title="图标" bordered={false} loading={loadingfetch} style={{ marginBottom: 24 }}>
            <Row gutter={16} style={{ marginTop: 24, marginBottom: 24 }}>
              <Col span={12}>
                <AvatarIcon size={54}
                  iconURL={clubDetail.logoUrl || ''}
                  name={clubDetail.name || ''}
                />
              </Col>
              <Col lg={12} md={12} >
                <Form.Item>
                  {form.getFieldDecorator('logoFile', {
                    rules: simpleRules('请上传图标文件'),
                  })(
                    <Upload name="logo" accept="image/*"
                      listType="picture"
                      onRemove={() => {
                        this.setState({ isUpload: false });
                        this.props.form.setFieldsValue({ logoFile: null }); // 比较奇怪这种方式清除的数据是 fileList
                      }}
                    >
                      {
                        isBtnDisplay ? <Button
                          onClick={() => this.setState({ isUpload: true })}
                          disabled={isUpload}
                        >
                          <Icon type="upload" /> 点击上传
                      </Button> : null
                      }
                    </Upload>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="基础信息" bordered={false} loading={loadingfetch} style={{ marginBottom: 24 }}>
            <Row gutter={16} style={{ marginTop: '24px' }}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="协办方名称">
                  {form.getFieldDecorator('name',
                    {
                      initialValue: clubDetail.name || '',
                      rules: simpleRules('请输入协办方名称'),
                    })
                    (<Input style={{ width: '100%' }} />)
                  }
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="公司地址">
                  {form.getFieldDecorator('corporateAddress',
                    {
                      initialValue: clubDetail.corporateAddress || '',
                      rules: simpleRules('请输入公司地址'),
                    })
                    (<Input style={{ width: '100%' }} />)
                  }
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="法人邮箱地址">
                  {form.getFieldDecorator('corporateEmail',
                    {
                      initialValue: clubDetail.corporateEmail || '',
                      rules: simpleRules('请输入邮箱地址'),
                    })
                    (<Input style={{ width: '100%' }} />)
                  }
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="法人名称">
                  {form.getFieldDecorator('corporateName',
                    {
                      initialValue: clubDetail.corporateName || '',
                      rules: simpleRules('请输入法人名称'),
                    })
                    (<Input style={{ width: '100%' }} />)
                  }
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="法人证件号">
                  {form.getFieldDecorator('corporateId',
                    {
                      initialValue: clubDetail.corporateId || '',
                      rules: simpleRules('请输入法人证件号'),
                    })
                    (<Input style={{ width: '100%' }} />)
                  }
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="银行信息" bordered={false} loading={loadingfetch} style={{ marginBottom: 24 }}>

            <Row gutter={16} style={{ marginTop: '24px' }}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="银行名称">
                  {form.getFieldDecorator('bankName',
                    {
                      initialValue: clubDetail.bankName || '',
                      rules: simpleRules('请输入银行名称'),
                    })
                    (<Input
                      prefix={<IconFont type="icon-yinxing" />}
                      style={{ width: '100%' }} />)
                  }
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="银行账号">
                  {form.getFieldDecorator('accountNumber',
                    {
                      initialValue: clubDetail.accountNumber || '',
                      rules: simpleRules('请输入银行账号'),
                    })
                    (<Input
                      prefix={<IconFont type="icon-yinlian1" />}
                      style={{ width: '100%' }} />)
                  }
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <Form.Item label="开户支行">
                  {form.getFieldDecorator('bankBranch',
                    {
                      initialValue: clubDetail.bankBranch || '',
                      rules: simpleRules('请输入开户支行'),
                    })
                    (<Input
                      prefix={<IconFont type="icon-zhihangmingcheng" />}
                      style={{ width: '100%' }} />)
                  }
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="资质文件" bordered={false} loading={loadingfetch} style={{ marginBottom: 24 }}>
            <Row gutter={16} style={{ marginTop: '24px' }}>
              <Col lg={6} md={12} sm={24}>
                <Row>
                  <Pictures
                    pictureURL={clubDetail.businessLicenseUrl || ''}
                    Placeholder='businessLicense'
                    title={`营业执照`} hideRemark />
                </Row>
                <Row >
                  <Form.Item extra={isBtnDisplay ? "点此上传营业执照" : null}>
                    {form.getFieldDecorator('businessLicenseFile', {
                      rules: simpleRules('请上传营业执照文件'),
                    })(
                      <Upload name="logo" accept="image/*"
                        listType="picture"
                        onRemove={() => {
                          this.setState({ isBusinessLicenseButton: false });
                          this.props.form.setFieldsValue({ businessLicenseFile: null }); // 比较奇怪这种方式清除的数据是 fileList
                        }}
                      >
                        {
                          isBtnDisplay ? <Button
                            style={{ width: 250 }}
                            onClick={() => this.setState({ isBusinessLicenseButton: true })}
                            disabled={isBusinessLicenseButton}
                          >
                            <Icon type="upload" /> 点击上传
                      </Button> : null
                        }

                      </Upload>
                    )}
                  </Form.Item>
                </Row>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Row>
                  <Pictures
                    pictureURL={clubDetail.corporateUrl || ''}
                    Placeholder='IDPicturesFront'
                    title={`身份证正面`} hideRemark />
                </Row>
                <Row>
                  <Form.Item extra={isBtnDisplay ? "点此上传法人证件正面照" : null} >
                    {form.getFieldDecorator('corporateFile', {
                      rules: simpleRules('请上传法人证件正面照文件'),
                    })(
                      <Upload name="logo" accept="image/*"
                        listType="picture"
                        onRemove={() => {
                          this.setState({ isCorporateFileButton: false });
                          this.props.form.setFieldsValue({ corporateFile: null }); // 比较奇怪这种方式清除的数据是 fileList
                        }}
                      >
                        {
                          isBtnDisplay ? <Button
                            style={{ width: 250 }}
                            onClick={() => this.setState({ isCorporateFileButton: true })}
                            disabled={isCorporateFileButton}
                          >
                            <Icon type="upload" /> 点击上传
                      </Button> : null
                        }
                      </Upload>
                    )}
                  </Form.Item>
                </Row>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Row>
                  <Pictures
                    pictureURL={clubDetail.corporateFanUrl || ''}
                    Placeholder='IDPicturesReverse'
                    title={`身份证反面`} hideRemark />
                </Row>
                <Row>
                  <Form.Item extra={isBtnDisplay ? "点此上传法人证件反面照" : null} >
                    {form.getFieldDecorator('corporateFanFile', {
                      rules: simpleRules('请上传法人证件正反面文件'),
                    })(
                      <Upload name="logo" accept="image/*"
                        listType="picture"
                        onRemove={() => {
                          this.setState({ isCorporateFanFileButton: false });
                          this.props.form.setFieldsValue({ corporateFanFile: null }); // 比较奇怪这种方式清除的数据是 fileList
                        }}
                      >
                        {
                          isBtnDisplay ? <Button
                            style={{ width: 250 }}
                            onClick={() => this.setState({ isCorporateFanFileButton: true })}
                            disabled={isCorporateFanFileButton}
                          >
                            <Icon type="upload" /> 点击上传
                      </Button> : null
                        }

                      </Upload>
                    )}
                  </Form.Item>
                </Row>
              </Col>
            </Row>
          </Card>
        </PageHeaderWrapper >
      </Form>
    )

  }
}


export default connect(
  ({
    club: { clubDetail },
    loading
  }: {
    club: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    clubDetail,
    loadingAdd: loading.effects['club/addClub'],
    loadingChange: loading.effects['club/changeClub'],
    loadingFetch: loading.effects['club/fetchClubDetail'],
  }),
)(UnverifiedClub);
