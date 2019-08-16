import React, { Component } from 'react';
import { Col, Input, Layout, Row, Switch } from 'antd';
import styles from './Header.css';

const { ipcRenderer } = require('electron');

const { Header } = Layout;
type Props = {
  toggleTheme: () => void,
  engine: () => {},
  setResult: () => void,
  setting: {},
  setWord: ()=>void
};

export default class IndexHeader extends Component<Props> {
  props: Props;

  search = value => {
    ipcRenderer.send('search-word', value);
    //在渲染器进程 (网页) 中。

    ipcRenderer.send('asynchronous-message', 'ping');
    if (this.props.setWord !== undefined) {
      this.props.setWord(value);
    }
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
          <Col span={5}>
            <span style={{ color: 'white' }}>后退</span>
          </Col>
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
            <span style={{ color: 'white' }}>历史记录</span>
          </Col>
        </Row>
      </Header>
    );
  }
}
