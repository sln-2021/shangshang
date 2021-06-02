import React from 'react';
import _ from "lodash"
import { Base64 } from "js-base64";
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Alert, message, Button } from 'antd';
import DetailsBasicInfoCard from "./cards/BasicInfoCard";
import { easyDispatch, easyRouteTo } from '@/utils/easyDispatch';
import { getErrorMessage } from '../../common/convertError';

const defaultBack2 = '/bonus';

// @ts-ignore
@connect(({ bonus, loading }) => ({
  bonus,
  loading: loading.effects['bonus/fetchBonusDetail'],
}))


export default class bonusDetail extends React.Component {
  state = {
    error: '',
  }

  // @ts-ignore
  back2 = defaultBack2;

  componentDidMount() { this.query(); }

  // @ts-ignore
  onError(response) { this.setState({ error: getErrorMessage(response) }); }

  // @ts-ignore
  clearError() { this.setState({ error: '' }); }

  query() {
    const id = this.getID();
    if (!id) return;
    this.clearError();
    easyDispatch(this, 'bonus/fetchBonusDetail', {
      id,
      onError: this.onError.bind(this),
    });

    easyDispatch(this, 'bonus/fetchBonusTotal', {
      onError: this.onError.bind(this),
    });
  }

  onChangeBonus(value) {
    this.clearError();
    easyDispatch(this, 'bonus/changeBonus', {
      ..._.pick(value, 'id', 'bonusTotal'),
      onError: code => {
        this.onError(code);
      },
      onOk: () => {
        message.success('修改成功!');
        this.query()
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
    if (extra && extra.back2)
      this.back2 = extra.back2;
    return raw.slice(0, border);
  }


  render() {
    const { error } = this.state;
    const { loading, bonus } = this.props;
    console.log(bonus)
    const content = (
      <div>
        <Button icon="left" onClick={event => {
          event.preventDefault();
          // @ts-ignore
          easyRouteTo(this, this.back2 || defaultBack2);
        }}>
          返回列表
        </Button>
      </div>
    );

    return (
      <PageHeaderWrapper content={content} title='兑换券池详情' >
        {error ? (<Alert message={error} type="error" showIcon style={{ marginBottom: 10 }} />) : null}

        <DetailsBasicInfoCard
          loading={loading}
          details={bonus.bonusDetail}
          onChangeBonus={this.onChangeBonus.bind(this)}
        />

      </PageHeaderWrapper >
    )

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
