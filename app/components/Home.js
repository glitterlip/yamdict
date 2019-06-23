// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import styles from './Home.css';
import Parser from '../utils/MdictParser';
import IndexHeader from './Index/Header/Header';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import SideBar  from './General/SideBar/SideBar';
import AppFooter from './General/Footer/Footer';

const { SubMenu } = Menu;
const { Content, Sider, Footer } = Layout;

type Props = {
  setDict: ()=>void,
  setResult: ()=>void,
  dict: {},
  setting: {}
};
export default class Home extends Component<Props> {
  props: Props;


  constructor(props) {
    super(props);
    let parser;
    if (typeof parser == 'undefined' && props.dict.engine == null) {
      this.parser = parser = new Parser();
      props.setDict(parser);

    }

  }

  render() {
    let { findWord } = this.parser || this.props.dict;
    let { setResult } = this.props;
    return (
      <Layout>
        {/*<Header className="header">*/}
        {/*<div className="logo"/>*/}
        {/*<Menu*/}
        {/*theme="dark"*/}
        {/*mode="horizontal"*/}
        {/*defaultSelectedKeys={['2']}*/}
        {/*style={{ lineHeight: '64px' }}*/}
        {/*>*/}
        {/*<Menu.Item key="1">nav 1</Menu.Item>*/}
        {/*<Menu.Item key="2">nav 2</Menu.Item>*/}
        {/*<Menu.Item key="3">nav 3</Menu.Item>*/}
        {/*</Menu>*/}
        {/*</Header>*/}
        <IndexHeader engine={findWord} {...this.props}/>
        <Layout>
          {/*<Sider width={200} style={{ background: '#fff' }} theme={this.props.setting.theme}>*/}
          {/*<Menu*/}
          {/*mode="inline"*/}
          {/*defaultSelectedKeys={['1']}*/}
          {/*defaultOpenKeys={['sub1']}*/}
          {/*theme={this.props.theme}*/}
          {/*style={{ height: '100%', borderRight: 0 }}*/}
          {/*>*/}
          {/*<Menu.Item key="main1">*/}
          {/*<Icon type="search"/>*/}
          {/*<span><Link to={routes.HOME}>查询</Link></span>*/}
          {/*</Menu.Item>*/}

          {/*<Menu.Item key="main2">*/}
          {/*<Icon type="font-size" />*/}
          {/*<span><Link to={routes.TRANSLATE}>翻译</Link></span>*/}
          {/*</Menu.Item>*/}
          {/*<SubMenu*/}
          {/*key="sub3"*/}
          {/*title={*/}
          {/*<span>*/}
          {/*<Icon type="notification"/>*/}
          {/*单词本*/}
          {/*</span>*/}
          {/*}*/}
          {/*>*/}
          {/*<Menu.Item key="9">option9</Menu.Item>*/}
          {/*<Menu.Item key="10">option10</Menu.Item>*/}
          {/*<Menu.Item key="11">option11</Menu.Item>*/}
          {/*<Menu.Item key="12">option12</Menu.Item>*/}
          {/*</SubMenu>*/}
          {/*<SubMenu*/}
          {/*key="sub4"*/}
          {/*title={*/}
          {/*<span>*/}
          {/*<Icon type="notification"/>*/}
          {/*词典库*/}
          {/*</span>*/}
          {/*}*/}
          {/*>*/}
          {/*<Menu.Item key="13">option9</Menu.Item>*/}
          {/*<Menu.Item key="14">option10</Menu.Item>*/}
          {/*<Menu.Item key="15">option11</Menu.Item>*/}
          {/*<Menu.Item key="16">option12</Menu.Item>*/}
          {/*</SubMenu>*/}

          {/*</Menu>*/}
          {/*</Sider>*/}
          <SideBar></SideBar>
          <Layout style={{ padding: '0 24px 24px', height: '580px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <Content className={styles.content}

            >
              <div dangerouslySetInnerHTML={{ __html: this.props.dict.result }}/>
            </Content>
          </Layout>
        </Layout>
        <AppFooter></AppFooter>
      </Layout>

    );
  }
}
