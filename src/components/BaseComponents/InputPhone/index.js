import React from 'react';
import { Input, Select } from 'antd';

import CN from '../../../assets/flags/cn.svg';
import US from '../../../assets/flags/us.svg';
import JP from '../../../assets/flags/jp.svg';
import TW from '../../../assets/flags/tw.svg';
import AU from '../../../assets/flags/au.svg';

const defaultArea = 886;
const areaCodes = [
  { code: 886, src: TW },
  { code: 86, src: CN },
  { code: 81, src: JP },
  { code: 61, src: AU },
  { code: 1, src: US },
];

function expandPhoneNumber(phoneNumber = '') {
  const t = { area: defaultArea, main: phoneNumber.replace(/^\+/, '') };
  for (const it of areaCodes) {
    const code = String(it.code);
    if (phoneNumber.startsWith(code)) {
      t.area = code;
      t.main = phoneNumber.slice(code.length);
      break;
    }
  }
  return t;
}

/**
 * @augments {React.PureComponent<{
    value?: string;
    onChange?: Function;
    size?: string;
    style?: any;
  }, {}>}
 */
export default class InputPhone extends React.PureComponent {
  onChange(area, main) {
    const { onChange } = this.props;
    if (!onChange) return;

    const all = `${area}${main}`;
    return onChange(all.replace(/^\+/, ''));
  }

  onChangeArea(area) {
    const phone = expandPhoneNumber(this.props.value);
    return this.onChange(area, phone.main);
  }

  onChangeMain(e) {
    const phone = expandPhoneNumber(this.props.value);
    return this.onChange(phone.area, e.target.value);
  }

  render() {
    const { value, size, style } = this.props;
    const phone = expandPhoneNumber(value);

    const areaCode = (
      <Select
        style={{ width: 110 }}
        value={`+${phone.area}`}
        onChange={this.onChangeArea.bind(this)}
      >
        {areaCodes.map(it => (
          <Select.Option key={it.code} value={it.code}>
            <img src={it.src} alt={it.code} style={{ height: '1em', marginRight: 10 }} />
            {`+${it.code}`}
          </Select.Option>
        ))}
      </Select>
    );

    return (
      <Input
        addonBefore={areaCode}
        value={phone.main}
        onChange={this.onChangeMain.bind(this)}
        size={size}
        style={style}
      />
    );
  }
}
