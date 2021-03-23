import React, { Component } from 'react';
import { Avatar, Breadcrumb, Card, Col, Icon, Input, Layout, List, Modal, Row } from 'antd';
import styles from './Subscribe.css';
import { PodService } from '../../services/podcast/PodcastService';

const { Content } = Layout;
const { Search } = Input;
const { Meta } = Card;
type Props = {};
export default class Subscribe extends Component<Props> {
  props: Props;

  constructor() {
    super();
    this.state = {
      subscribes: PodService.allSubscribes(),
      podcast: null,
      detail: null,
      modal: null,
      visible: false
    };

  }

  lists = async (podcast) => {
    let { collectionId } = podcast;
    let detail = (await PodService.parseXML(collectionId)).rss.channel[0];

    let modal = <Modal title={detail.title[0]} visible={this.state.visible} width={800} onCancel={() => {
      this.close();
    }} maskClosable={true}>
      <Row>
        <Col span={4}>
          <Avatar src={podcast.artworkUrl100} style={{ width: 100, height: 100 }}/>
        </Col>
        <Col span={16}>
          {detail.title} by {detail['itunes:author']}
          <br/>
          {detail['itunes:subtitle'][0]}
          <br/>
          {/*{detail['itunes:summary'][0]}*/}
        </Col>
      </Row>
      <Row>
        <Col span={16} offset={4}>
          <List dataSource={detail.item} renderItem={item => (
            <List.Item
              actions={[
                <Icon type="customer-service" key="setting" onClick={() => {
                  this.props.play(PodService.episodeToAudio({ ...item, img: podcast.artworkUrl100 }));
                }}/>,
                <Icon type="download" key="save"/>,
                <Icon type="bars" key="bars"/>,
                <Icon type="link" key="link"/>
              ]}>

              <List.Item.Meta
                title={item.title}
                description={item.summary}
              />
              [{item['itunes:duration']}] [{item.pubDate}]

            </List.Item>
          )

          }/>
        </Col>
      </Row>
    </Modal>;
    this.setState({ visible: true, podcast, detail, modal });

  };

  close = () => {
    this.setState({ visible: false, modal: null });
  };

  sync = (podcast) => {
    PodService.sync(podcast);
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
            {this.state.subscribes.map((podcast) => {
              return <Col span={8} key={podcast.collectionId}>
                <Card
                  style={{ width: 200 }}
                  cover={
                    <img
                      src={podcast.artworkUrl100}
                    />
                  }
                  actions={[
                    <Icon type="menu" key="setting" onClick={() => {
                      this.lists(podcast);
                    }}/>,
                    <Icon type="edit" key="edit"/>,
                    <Icon type="ellipsis" key="ellipsis"/>,
                    <Icon type="sync" key="sync" onClick={() => {
                      this.sync(podcast);
                    }}/>
                  ]}

                >
                  <Meta
                    title={podcast.collectionName}
                    description={podcast.artistName}
                  />
                </Card>
              </Col>;
            })}
          </Row>

          {this.state.modal}
        </Content>
      </Layout>
    );
  }
}
