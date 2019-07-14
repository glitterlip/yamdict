// @flow
import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb,  Row, Col, Input, Button } from 'antd';
import ReactAudioPlayer from 'react-audio-player';
import styles from './Note.css';
import IndexHeader from '../Index/Header/Header';
import SideBar from '../General/SideBar/SideBar';
import AppFooter from '../General/Footer/Footer';

const { Content} = Layout;
const { ipcRenderer } = require('electron');

type Props = {
  setDict: () => void,
  setResult: () => void,
  dict: {},
  setting: {}
};
export default class Note extends Component<Props> {
  props: Props;

  constructor() {
    super();

    this.state = {
      target: '',
      result: '',
      read: ''
    };

    ipcRenderer.on('translate-result', (event, arg) => {
      this.setState({
        result: arg
      });
    });

    ipcRenderer.on('read-result', (event, arg) => {
      const player = this.player.audioEl;
      player.src = arg;
      player.load();
      player.play();
    });
  }

  translate = () => {
    ipcRenderer.send('translate-request', this.state.target);
  };

  read = () => {
    ipcRenderer.send('read-request', this.state.target);
  };

  handleChange = e => {
    this.setState({
      target: e.target.value
    });
  };

  render() {

    return (
      <Layout>
        <IndexHeader {...this.props} />
        <Layout>
          <SideBar></SideBar>
          <Layout style={{ padding: '0 24px 24px', height: '580px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <Content className={styles.content}>
              <Row>
                <Col span={24}>
                  <Input.TextArea rows={8} onChange={this.handleChange} />
                </Col>
              </Row>
              <br />
              <Row>
                <Col span={24}>
                  <Input.TextArea rows={8} value={this.state.result.result} />
                </Col>
              </Row>
              <br />

              <Row>
                <Col span={6}>
                  <Button
                    type="primary"
                    icon="audio"
                    className={styles['tans-button']}
                    block
                    onClick={this.read}
                  >
                    朗读
                  </Button>
                </Col>
                <Col span={3}></Col>
                <Col span={6}>
                  <Button
                    type="primary"
                    icon="search"
                    className={styles['tans-button']}
                    block
                    onClick={this.translate}
                  >
                    翻译
                  </Button>
                </Col>
                <Col span={3}></Col>

                <Col span={6}>
                  <Button
                    type="primary"
                    icon="search"
                    className={styles['tans-button']}
                    block
                  >
                    Search
                  </Button>
                </Col>
              </Row>

              <Row>
                <Col>
                  <ReactAudioPlayer
                    ref={element => {
                      this.player = element;
                    }}
                    src=""
                  />
                </Col>
              </Row>
            </Content>
          </Layout>
        </Layout>
        <AppFooter></AppFooter>
      </Layout>
    );
  }
}
