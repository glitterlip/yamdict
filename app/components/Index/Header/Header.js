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
    if (value) {
      ipcRenderer.send('search-word', value);
      if (this.props.setWord !== undefined) {
        this.props.setWord(value);
      }
    }


  };

  handleInput = (e) => {
    this.props.setWord(e.target.value)
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
                onSearch={value => this.search(value)}
                enterButton
                value={this.props.dict.word}
                onChange={this.handleInput}

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
