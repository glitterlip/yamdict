import React, { Component } from 'react';
import { Col, Input, Layout, Row, Switch } from 'antd';
import styles from './Header.css';

const { ipcRenderer } = require('electron');
const { Header } = Layout;
type Props = {
  toggleTheme: () => void,
  engine: () => {},
  setResult: () => void,
  setting: {}
};

export default class IndexHeader extends Component<Props> {
  props: Props;

  search = value => {
    ipcRenderer.send('search-word', value);
  };

  render() {
    const { setting, toggleTheme } = this.props;
    return (
      <Header
        className={styles.header}
        style={{ height: '70px' }}
        theme={setting.theme}
      >
        <Row>
          <Col span={5}>占位</Col>
          <Col span={14}>
            <div className={styles.searchWrapper}>
              <Input.Search
                placeholder="input search text"
                onSearch={value => this.search(value)}
                enterButton
              />
            </div>
          </Col>
          <Col span={5}>
            <Switch
              checked={setting.theme === 'dark'}
              onChange={toggleTheme}
              checkedChildren="Dark"
              unCheckedChildren="Light"
            />
          </Col>
        </Row>
      </Header>
    );
  }
}
