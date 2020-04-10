import React, { Component } from 'react';
import { Breadcrumb, Icon, Layout, Rate, Table, Input, List, Avatar, Button, Card,Row,Col } from 'antd';
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
      subscribes: PodService.allSubscribes()
    };

  }


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
                  return <Col span={8}>
                    <Card
                      style={{ width: 150 }}
                      cover={
                        <img
                          src={podcast.artworkUrl100}
                        />
                      }
                      actions={[
                        <Icon type="setting" key="setting" />,
                        <Icon type="edit" key="edit" />,
                        <Icon type="ellipsis" key="ellipsis" />,
                      ]}
                    >
                      <Meta
                        title={podcast.collectionName}
                        description={podcast.artistName}
                      />
                    </Card>
                  </Col>
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
