// @flow
import React, { Component } from 'react';
import { Breadcrumb, Card, Col, Collapse, Icon, Layout, Row, Switch } from 'antd';
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
    this.state = { dicts };

  }

  toggleDict = (dict) => {

    configDb.get('dicts').find({ id: dict.id }).assign({ enabled: dict.enabled === 0 ? 1 : 0 }).write();
    let dicts = configDb.get('dicts').value();

    this.setState({ dicts });
    loadParsers();

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
              <Row>
                {this.state.dicts.map((dict) => {
                  return <Col span={8} key={dict.id}>
                    <Card
                      title={dict.name}
                      actions={[<Icon type="setting"/>, <Icon type="edit"/>, <Icon type="ellipsis"/>]}

                    >
                      <Switch checked={!!dict.enabled} checkedChildren="启用" unCheckedChildren="禁用"
                              onChange={() => {
                                this.toggleDict(dict);
                              }}/>
                      <br/>

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
