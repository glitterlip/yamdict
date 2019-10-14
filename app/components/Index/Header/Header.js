import React, { Component } from 'react';
import { Col, Icon, Layout, Row, Select, Switch } from 'antd';
import styles from './Header.css';

const { ipcRenderer } = require('electron');

const { Header } = Layout;
type Props = {
  toggleTheme: () => void,
  engine: () => {},
  setResult: () => void,
  setting: {},
  setWord: ()=>void,
  predict: ()=>void,
  predictions: []
};

export default class IndexHeader extends Component<Props> {
  props: Props;

  render() {
    const { setting, toggleTheme } = this.props;
    const { Option } = Select;

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
              <Select
                style={{ width: '100%' }}
                showSearch
                value={this.props.dict.word}
                defaultActiveFirstOption={false}
                filterOption={false}
                suffixIcon={<Icon type="search" style={{ fontSize: '20px', color: '#1790ff' }}/>}
                onSearch={value => {
                  if (this.props.setWord !== undefined) {
                    this.props.setWord(value);
                  }
                  ipcRenderer.send('predict', value);
                }}
                onInputKeyDown={(e) => {
                  if (e.which === 13) {
                    ipcRenderer.send('search-word', this.props.dict.word);
                  }
                }}

                onSelect={(value) => {
                  if (value) {
                    ipcRenderer.send('search-word', value);
                    if (this.props.setWord !== undefined) {
                      this.props.setWord(value);
                    }
                  }
                }}

                notFoundContent={null}
              >
                {this.props.dict.predictions.length ? this.props.dict.predictions.map(d => <Option
                  key={d.word}>{d.word}</Option>) : ''}
              </Select>

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
