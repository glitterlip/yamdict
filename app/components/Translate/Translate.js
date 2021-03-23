// @flow
import React, { Component } from 'react';
import { Breadcrumb, Button, Col, Input, Layout, Row } from 'antd';
import ReactAudioPlayer from 'react-audio-player';
import styles from './Translate.css';
import axios from 'axios';
import md5 from 'md5';
import qs from 'qs';


const { Content } = Layout;
const { ipcRenderer, remote, dialog } = require('electron');

type Props = {
  setDict: () => void,
  setResult: () => void,
  dict: {},
  setting: {},
};
export default class Translate extends Component<Props> {
  props: Props;

  constructor() {
    super();

    this.state = {
      target: '',
      result: '',
      read: '',
      base64: ''
    };

    ipcRenderer.on('translate-result', (event, arg) => {

      this.setState({
        result: arg,
        target: arg.text
      });

      console.log(arg);
    });

    ipcRenderer.on('read-result', (event, arg) => {
      const player = this.player.audioEl;
      player.src = arg;
      player.load();
      player.play();
    });


    remote.ipcMain.on('capture-screen', (e, { type = 'start', url: data } = {}) => {
      if (type === 'complete') {
        this.setState({
          base64: data.substring(22)
        });
        this.recognize();
      }
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

  handleOcr = () => {
    remote.app.hide();
    ipcRenderer.send('capture-screen');
  };

  recognize = () => {
    //todo: use user own config
    const app_id = 2122174291;
    const app_key = 'AotWYIsIKc30FegX';
    const url = 'https://api.ai.qq.com/fcgi-bin/ocr/ocr_generalocr';

    let obj = {
      app_id,
      image: this.state.base64,
      time_stamp: Math.round(new Date().getTime() / 1000),
      nonce_str: '1333753988'
    };

    let sign = '';
    Object.keys(obj).sort().map((key) => {
      sign += `${key}=${encodeURIComponent(obj[key])}&`;
    });

    sign = `${sign}app_key=${app_key}`;
    obj.sign = (md5(sign)).toUpperCase();
    axios.post(url, qs.stringify(obj), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
      .then((response) => {

        console.log(response);
        const { data } = response;
        if (data.ret === 0) {
          let target = '';
          data.data.item_list.map((item) => {
            target += `${item.itemstring} `;
          });
          this.setState({
            target
          });
        } else {
          dialog.showErrorBox('出错了,腾讯的锅', data.msg);
        }

      });
  };

  render() {

    return (
      <Layout style={{ padding: '0 24px 24px', minHeight: '400px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <Content className={styles.content}>
          <Row>
            <Col span={24}>
              <Input.TextArea rows={8} onChange={this.handleChange} value={this.state.target}/>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span={24}>
              <Input.TextArea rows={8} value={this.state.result.result}/>
            </Col>
          </Row>
          <br/>

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
                icon="camera"
                className={styles['tans-button']}
                block
                onClick={this.handleOcr}
              >
                截图识别并翻译
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
    );
  }
}
