import React, { Component } from 'react';
import { Breadcrumb, Icon, Layout, Rate, Table, Input, List, Avatar, Button, Card, Row, Col, Modal } from 'antd';
import styles from './Subscribe.css';
import IndexHeader from '../Index/Header/Header';
import SideBar from '../General/SideBar/SideBar';
import AppFooter from '../General/Footer/Footer';
import { PodService } from '../../services/podcast/PodcastService';
import axios from 'axios';
import qs from 'qs';

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
      modal: null
    };

  }

  lists = async (podcast) => {
    let { collectionId } = podcast;
    let detail = (await PodService.parseXML(collectionId)).rss.channel[0];

    console.log(detail);
    console.log(podcast);
    let modal = <Modal title={detail.title[0]} visible={true} width={800} onCancel={this.setState({ visible: false })}>
      <Row>
        <Col span={4}>
          <Avatar src={podcast.artworkUrl100} style={{ width: 100, height: 100 }}/>
        </Col>
        <Col span={16}>
          {detail.title} by {detail['itunes:author']}
          <br/>
          {detail['itunes:subtitle'][0]}
          <br/>
          {detail['itunes:summary'][0]}
        </Col>
      </Row>
      <Row>
        <Col span={16} offset={4}>
          <List dataSource={detail.item} renderItem={item => (
            <List.Item
              actions={[
                <Icon type="customer-service" key="setting" onClick={() => {
                  console.log(item);
                  this.props.play({ ...item, img: podcast.artworkUrl100 });
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
                        <Icon type="ellipsis" key="ellipsis"/>
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
        </Layout>
        <AppFooter {...this.props}></AppFooter>
      </Layout>
    );
  }
}
