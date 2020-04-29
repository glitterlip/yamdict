import React, { Component, Fragment } from 'react';
import { Avatar, Breadcrumb, Button, Icon, Layout, List, Tabs } from 'antd';
import styles from './Favorites.css';
import { PodService } from '../../services/podcast/PodcastService';
import { FavoriteService } from '../../services/favorite/FavoriteService';

const { Content } = Layout;
const { TabPane } = Tabs;

type Props = {
  setDict: () => void,
  setResult: () => void,
  dict: {},
  setting: {}
};
export default class Favorites extends Component<Props> {
  props: Props;

  constructor() {
    super();
    this.favService = new FavoriteService();
    this.state = {
      currentTab: 'podcast',
      podcasts: this.favService.getFavorites(FavoriteService.TYPE_POCAST),
      radios: this.favService.getFavorites(FavoriteService.TYPE_RADIO),
      episodes: this.favService.getFavorites(FavoriteService.TYPE_EPISODE)
    };

  }


  render() {
    const { radios, podcasts, episodes } = this.state;
    return (
      <Layout style={{ padding: '0 24px 24px', height: '580px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <Content className={styles.content}>
          <Tabs defaultActiveKey="podcast" onChange={(currentTab) => this.setState({ currentTab })}>
            <TabPane tab={<span><Icon type="wifi"/>Podcast</span>} key="podcast">
              <List
                itemLayout="horizontal"
                dataSource={podcasts}
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
            </TabPane>
            <TabPane tab={<span><Icon type="customer-service"/>Radio</span>} key="radio">
              <List
                itemLayout="horizontal"
                dataSource={radios}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <Button type="primary" onClick={e => this.props.play(PodService.radioToAudio(item))}><Icon
                        type="play-circle"/></Button>,
                      <Button type="primary" onClick={e => this.favoriteRadio(item)}><Icon type="heart"/></Button>,
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
