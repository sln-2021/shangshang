import React from 'react';
import _ from 'lodash';
import { Base64 } from 'js-base64';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Alert, message, Button } from 'antd';
import { easyDispatch, easyRouteTo } from '@/utils/easyDispatch';
import { getErrorMessage } from '../../common/convertError';
import AvatarIcon from '../../components/AvatarIcon';
import IconCard from './cards/IconCard';
import DetailsBasicInfoCard from './cards/BasicInfoCard';
import BankInfoCard from './cards/BankInfoCard';
import OtherInfoCard from './cards/OtherInfoCard';

const defaultBack2 = '/club-manager/list';

// @ts-ignore
@connect(({ club, loading }) => ({
  club,
  loading: loading.effects['club/changeClub'],
}))
export default class clubDetail extends React.Component {
  state = {
    error: '',
  };

  // @ts-ignore
  back2 = defaultBack2;

  componentDidMount() {
    this.query();
  }

  // @ts-ignore
  onError(response) {
    this.setState({ error: getErrorMessage(response) });
  }

  // @ts-ignore
  clearError() {
    this.setState({ error: '' });
  }

  query() {
    const id = this.getID();
    if (!id) return;
    this.clearError();
    easyDispatch(this, 'club/fetchClubDetail', {
      id,
      onError: this.onError.bind(this),
    });
  }

  onChangBasicInfo(value) {
    this.clearError();
    easyDispatch(this, 'club/changeClub', {
      // ..._.pick(value, 'id', 'bonusTotal'),
      id: this.getID(),
      ...value,
      onError: code => {
        this.onError(code);
      },
      onOk: () => {
        message.success('修改成功!');
        this.query();
      },
    });
  }

  getID() {
    /** @type {string} */
    const raw = _.get(this.props, 'match.params.id');
    if (!raw) return;

    const border = raw.indexOf('-');
    if (border < 0) {
      this.back2 = defaultBack2;
      return raw;
    }
    const extra = decodeBase64Object(raw.slice(border + 1), null);
    if (extra && extra.back2) this.back2 = extra.back2;
    return raw.slice(0, border);
  }

  render() {
    const { error } = this.state;
    const { loading, club } = this.props;
    const { clubDetail } = club || {};

    const content = (
      <div>
        <Button
          icon="left"
          onClick={event => {
            event.preventDefault();
            // @ts-ignore
            easyRouteTo(this, this.back2 || defaultBack2);
          }}
        >
          返回列表
        </Button>
      </div>
    );

    return (
      <PageHeaderWrapper
        content={content}
        title={
          <>
            <AvatarIcon size={54} iconURL={clubDetail.logoUrl} name={clubDetail.name} />
            <span style={{ lineHeight: 3 }}> {clubDetail.name} 详细信息</span>
          </>
        }
      >
        {error ? (
          <Alert message={error} type="error" showIcon style={{ marginBottom: 10 }} />
        ) : null}

        <IconCard
          loading={loading}
          details={club.clubDetail}
          onChangBasicInfo={this.onChangBasicInfo.bind(this)}
        />

        <DetailsBasicInfoCard
          loading={loading}
          details={club.clubDetail}
          onChangBasicInfo={this.onChangBasicInfo.bind(this)}
        />

        <BankInfoCard
          loading={loading}
          details={club.clubDetail}
          onChangBasicInfo={this.onChangBasicInfo.bind(this)}
        />

        <OtherInfoCard
          loading={loading}
          details={club.clubDetail}
          onChangBasicInfo={this.onChangBasicInfo.bind(this)}
        />
      </PageHeaderWrapper>
    );
  }
}

// @ts-ignore
function decodeBase64Object(encoded, defaultValue) {
  try {
    return JSON.parse(Base64.decode(encoded));
  } catch (ex) {
    return defaultValue;
  }
}
