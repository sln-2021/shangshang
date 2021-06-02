//@ts-check
import React from 'react';
import { Switch, Spin, message } from 'antd';
import { color } from '../../../common/color';

export default class FooterMockProxyStatus extends React.PureComponent {
  lastFetchTime = 0;
  lastToggleTime = 0;

  state = { loading: false, upstream: '', enable: false, error: '' };

  tryFetchStatus(then) {
    const now = Date.now();
    // 30s cache
    if (now < this.lastFetchTime + 30 * 1000)
      return;
    this.lastFetchTime = now;
    setTimeout(() => {
      this.setState({ error: '', loading: true });
      fetch(`/proxy/status?t=${Date.now()}`)
        .then(response => response.json())
        .then(data => {
          //@ts-ignore
          const { upstream, enable } = data || {};
          this.setState({ upstream, enable, loading: false });
          if (then) then(upstream, enable);
        }).catch(ex => {
          //eslint-disable-next-line
          console.error(ex);
          this.setState({ error: ex.message || String(ex), loading: false });
        });
    }, 15); // 15ms delay process.nextTick
  }

  onChange(_newState) {
    const now = Date.now();
    // 200ms debounced
    if (now < this.lastToggleTime + 200)
      return;
    this.lastToggleTime = now;

    const newState = _newState ? 'on' : 'off';
    this.setState({ error: '', loading: true });
    fetch(`/proxy/${newState}?t=${Date.now()}`)
      .then(response => response.text())
      .then(() => {
        this.lastFetchTime = 0;
        this.tryFetchStatus((upstream, enable) => {
          message.success(`Mock Proxy ${enable ? 'On' : 'Off'}`);
        });
      }).catch(ex => {
        //eslint-disable-next-line
        console.error(ex);
        this.setState({ error: ex.message || String(ex), loading: false });
      });
  }

  render() {
    const { loading, upstream, enable, error } = this.state;
    const { isMenu } = this.props;

    const style = isMenu ? ({
      margin: '5px 15px 5px 25px',
      color: 'rgba(255, 255, 255, 0.65)',
    }) : ({
      marginTop: 15, marginBottom: 20,
    });

    this.tryFetchStatus();
    return (
      <div style={style}>
        {loading ? <Spin /> : (
          <div>
            {error ? (
              <span style={{ color: color.error }}>获取 MOCK数据源 状态失败!</span>
            ) : (
              <span>
                <span style={{ marginRight: 10 }}>MOCK数据源:</span>
                {isMenu ? <br /> : null}
                <b>{enable ? upstream : '本地'}</b>
              </span>
            )}
          </div>
        )}
        <div>
          <Switch checkedChildren="上游" unCheckedChildren="本地" checked={enable} loading={loading}
            onChange={this.onChange.bind(this)} />
        </div>
      </div>
    );
  }
};
