// @flow
import React, { Component } from 'react';
import { Breadcrumb, Button, Card, Col, Collapse, Layout, Modal, Row, Switch } from 'antd';
import styles from './Dict.css';
import IndexHeader from '../Index/Header/Header';
import SideBar from '../General/SideBar/SideBar';
import AppFooter from '../General/Footer/Footer';
import { configDb } from '../../utils/config';
import { loadParsers } from '../../services/dict/DictService';

const { Content } = Layout;
const { ipcRenderer } = require('electron');
const { Panel } = Collapse;
type Props = {
  setDict: () => void,
  setResult: () => void,
  dict: {},
  setting: {}
};
export default class Dict extends Component<Props> {
  props: Props;

  constructor() {
    super();
    let dicts = configDb.get('dicts').value();
    let visible = false;
    let title = '';
    let content = '';
    this.state = { dicts, title, visible, content };

  }

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  toggleDict = (dict) => {

    configDb.get('dicts').find({ name: dict.name }).assign({ enabled: dict.enabled === 0 ? 1 : 0 }).write();
    let dicts = configDb.get('dicts').value();

    this.setState({ dicts });
    loadParsers();
    console.log(this.state.dicts);

  };

  format = (str) => {
    return (new DOMParser()).parseFromString(str, 'text/xml').querySelector('Dictionary').attributes.getNamedItem('Description').value;
  };

  dictInfo = (dict) => {

    let content = this.format(dict.info);
    this.setState({
      visible: true,
      title: dict.name,
      content
    });
  };

  render() {
    return (
      <Layout>
        <IndexHeader  {...this.props} />
        <Layout>
          <SideBar></SideBar>
          <Layout style={{ padding: '0 24px 24px', height: '580px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>词典</Breadcrumb.Item>
            </Breadcrumb>
            <Content className={styles.content}>
              <Modal
                title={this.state.title}
                visible={this.state.visible}
                onOk={this.handleOk}
                okText={'确定'}
                width={'70%'}
                maskClosable={true}
                closable={false}
                footer={[
                  <Button key="ok" type="primary" onClick={this.handleOk}>
                    确定
                  </Button>
                ]}
              >
                <div dangerouslySetInnerHTML={{ __html: this.state.content }}></div>


              </Modal>
              <Row>
                {this.state.dicts.map((dict) => {
                  return <Col span={8} key={dict.name}>
                    <Card
                      title={dict.name}
                      actions={[<Button icon="ellipsis" shape="round" onClick={() => {
                        this.dictInfo(dict);
                      }}/>,
                        <Switch checked={!!dict.enabled} checkedChildren="启用" unCheckedChildren="禁用"
                                onChange={() => {
                                  this.toggleDict(dict);
                                }}/>]}

                    >


                    </Card>
                  </Col>;
                })}

              </Row>

            </Content>
          </Layout>
        </Layout>
        <AppFooter></AppFooter>
      </Layout>
    );
  }
}
