import React, { Component, Fragment } from 'react';
import { Avatar, Breadcrumb, Button, Icon, Input, Layout, List, Tabs } from 'antd';
import styles from './Discover.css';
import { PodService } from '../../services/podcast/PodcastService';
import { FavoriteService } from '../../services/favorite/FavoriteService';

const { Content } = Layout;
const { Search } = Input;
const { TabPane } = Tabs;


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
      podcastResult: [],
      radioResult: [],
      currentTab: 'podcast'
    };
    this.favService = new FavoriteService();


  }

  search = async (value) => {
    if (this.state.currentTab == 'podcast') {
      let podcastResult = await PodService.searchPodcast(value);
      this.setState({ podcastResult });
    } else {
      let radioResult = await PodService.searchRadio(value);
      console.log(radioResult);
      this.setState({ radioResult });
    }
  };

  subscribe = (item) => {
    PodService.subscribe(item);
  };


  render() {
    const podcastResult = this.state.podcastResult;
    const radioResult = this.state.radioResult;

    return (
      <Layout style={{ padding: '0 24px 24px', minHeight: '400px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <Content className={styles.content}>
          <Search placeholder="input search text" onSearch={this.search} enterButton/>
          <Tabs defaultActiveKey="podcast" onChange={(currentTab) => this.setState({ currentTab })}>
            <TabPane tab={<span><Icon type="wifi"/>Podcast</span>} key="podcast">
              <List
                itemLayout="horizontal"
                dataSource={podcastResult}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <Button type="primary" onClick={e => this.subscribe(item)}>subscribe</Button>,
                      <Button type="primary" onClick={e => this.favService.favorite(item, FavoriteService.TYPE_POCAST)}><Icon
                        type="heart"/></Button>
                    ]}>
                    <List.Item.Meta
                      avatar={<Avatar src={item.artworkUrl100}/>}
                      title={item.artistName}
                      description={item.collectionName}
                    />
                  </List.Item>
                )}
              />
            </TabPane>
            <TabPane tab={<span><Icon type="customer-service"/>Radio</span>} key="radio">
              <List
                itemLayout="horizontal"
                dataSource={radioResult}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <Button type="primary" onClick={e => this.props.play(PodService.radioToAudio(item))}><Icon
                        type="play-circle"/></Button>,
                      <Button type="primary"
                              onClick={e => this.favService.favorite(item, FavoriteService.TYPE_RADIO)}><Icon
                        type="heart"/></Button>,
                      <Button type="primary" onClick={e => this.radioDetail(item)}><Icon type="more"/></Button>
                    ]}>
                    <List.Item.Meta
                      avatar={<Avatar src={item.favicon}/>}
                      title={item.name}
                      description={<Fragment>
                        <Icon type="global"/> {item.countrycode} <Icon type="tags"/> {item.tags} <Icon
                        type="sound"/> {item.language}
                      </Fragment>}
                    />
                  </List.Item>
                )}
              />
            </TabPane>
          </Tabs>

        </Content>
      </Layout>
    );
  }
}
