import dva from 'dva';
import { Component } from 'react';
import createLoading from 'dva-loading';
import history from '@tmp/history';

let app = null;

export function _onCreate() {
  const plugins = require('umi/_runtimePlugin');
  const runtimeDva = plugins.mergeConfig('dva');
  app = dva({
    history,
    
    ...(runtimeDva.config || {}),
    ...(window.g_useSSR ? { initialState: window.g_initialData } : {}),
  });
  
  app.use(createLoading());
  (runtimeDva.plugins || []).forEach(plugin => {
    app.use(plugin);
  });
  
  app.model({ namespace: 'activity', ...(require('E:/sln/shangshang/src/models/activity.ts').default) });
app.model({ namespace: 'bonus', ...(require('E:/sln/shangshang/src/models/bonus.ts').default) });
app.model({ namespace: 'brand', ...(require('E:/sln/shangshang/src/models/brand.js').default) });
app.model({ namespace: 'club', ...(require('E:/sln/shangshang/src/models/club.ts').default) });
app.model({ namespace: 'dashboard', ...(require('E:/sln/shangshang/src/models/dashboard.ts').default) });
app.model({ namespace: 'games', ...(require('E:/sln/shangshang/src/models/games.ts').default) });
app.model({ namespace: 'global', ...(require('E:/sln/shangshang/src/models/global.ts').default) });
app.model({ namespace: 'login', ...(require('E:/sln/shangshang/src/models/login.ts').default) });
app.model({ namespace: 'mail', ...(require('E:/sln/shangshang/src/models/mail.ts').default) });
app.model({ namespace: 'notice', ...(require('E:/sln/shangshang/src/models/notice.ts').default) });
app.model({ namespace: 'online', ...(require('E:/sln/shangshang/src/models/online.ts').default) });
app.model({ namespace: 'organizer', ...(require('E:/sln/shangshang/src/models/organizer.ts').default) });
app.model({ namespace: 'player', ...(require('E:/sln/shangshang/src/models/player.ts').default) });
app.model({ namespace: 'redeemCode', ...(require('E:/sln/shangshang/src/models/redeemCode.js').default) });
app.model({ namespace: 'reward', ...(require('E:/sln/shangshang/src/models/reward.ts').default) });
app.model({ namespace: 'setting', ...(require('E:/sln/shangshang/src/models/setting.js').default) });
app.model({ namespace: 'setting', ...(require('E:/sln/shangshang/src/models/setting.ts').default) });
app.model({ namespace: 'shop', ...(require('E:/sln/shangshang/src/models/shop.ts').default) });
app.model({ namespace: 'sponsor', ...(require('E:/sln/shangshang/src/models/sponsor.ts').default) });
app.model({ namespace: 'user', ...(require('E:/sln/shangshang/src/models/user.ts').default) });
  return app;
}

export function getApp() {
  return app;
}

export class _DvaContainer extends Component {
  render() {
    const app = getApp();
    app.router(() => this.props.children);
    return app.start()();
  }
}
