import React, { Component } from 'react';
import { Breadcrumb, Icon, Layout, Rate, Table, Input, List, Avatar, Button } from 'antd';
import styles from './Discover.css';
import IndexHeader from '../Index/Header/Header';
import SideBar from '../General/SideBar/SideBar';
import AppFooter from '../General/Footer/Footer';
import { PodService } from '../../services/podcast/PodcastService';
import axios from 'axios';
import qs from 'qs';

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
    this.state = {
      results: []
    };

  }

  search = (value) => {
    const api = `https://itunes.apple.com/search?term=${value}&limit=30&media=podcast&country=US`;
    axios.get(api).then((response) => {
      const { results } = response.data;
      console.log(response);
      this.setState({
        results
      });

    });
  };

  subscribe = (item) => {
    PodService.subscribe(item);
  };

  render() {
    const results = this.state.results;

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
              <List
                itemLayout="horizontal"
                dataSource={results}
                renderItem={item => (
                  <List.Item
                    actions={[<Button type="primary" onClick={e => this.subscribe(item)}>subscribe</Button>]}>
                    <List.Item.Meta
                      avatar={<Avatar src={item.artworkUrl100}/>}
                      title={item.artistName}
                      description={item.collectionName}
                    />
                  </List.Item>
                )}
              />
            </Content>
          </Layout>
        </Layout>
        <AppFooter {...this.props}></AppFooter>
      </Layout>
    );
  }
}
