import React, { Component } from 'react';
import { Breadcrumb, Icon, Layout, Rate, Table, Input } from 'antd';
import styles from './Discover.css';
import IndexHeader from '../Index/Header/Header';
import SideBar from '../General/SideBar/SideBar';
import AppFooter from '../General/Footer/Footer';
import { PodService } from '../../services/podcast/PodcastService';

const { Content } = Layout;
const { Search } = Input;
type Props = {
  setDict: () => void,
  setResult: () => void,
  dict: {},
  setting: {}
};
export default class Podcast extends Component<Props> {
  props: Props;

  constructor() {
    super();

  }

  search = (value) => {
    const api = `https://itunes.apple.com/search?term=${value}&limit=10&media=podcast&country=US`;
    console.log(value);
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
              <Search placeholder="input search text" onSearch={this.search} enterButton/>
            </Content>
          </Layout>
        </Layout>
        <AppFooter></AppFooter>
      </Layout>
    );
  }
}
