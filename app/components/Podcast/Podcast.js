import React, { Component } from 'react';
import { Breadcrumb, Icon, Layout, Rate, Table } from 'antd';
import styles from './Podcast.css';
import IndexHeader from '../Index/Header/Header';
import SideBar from '../General/SideBar/SideBar';
import AppFooter from '../General/Footer/Footer';
import { PodService } from '../../services/podcast/PodcastService';

const { Content } = Layout;

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
    this.state = { words: PodService.all() };

  }

  remove = (word) => {
    PodService.remove(word);
    this.setState({ words: PodService.all() });
  };

  like = (word, score) => {
    console.log(word, score);
    PodService.update(word, score);
    this.setState({ words: PodService.all() });
    // this.setState({ score: value });
  };

  render() {
    const columns = [
      {
        title: '单词',
        dataIndex: 'word'
      },
      {
        title: '添加时间',
        dataIndex: 'time',
        render: time => (new Date(time)).toLocaleString(),
        sorter: (a, b) => a.time - b.time,
        sortDirections: ['descend', 'ascend']
      },
      {
        title: '星级',
        sorter: (a, b) => a.score - b.score,
        sortDirections: ['descend', 'ascend'],
        render: record => <Rate character={<Icon type="heart"/>} style={{ color: 'red' }} value={record.score}
                                onChange={(newScore) => {
                                  this.like(record.word, newScore);
                                }}/>
      },
      {
        title: '查询次数',
        dataIndex: 'count'
      },
      {
        title: '操作',
        key: 'action',
        render: (record) => (
          <span>
        <Icon type="delete" theme="twoTone" style={{ fontSize: 20 }} onClick={() => {
          this.remove(record.word);
        }}/>
      </span>
        )
      }
    ];
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

              <Table dataSource={this.state.words} columns={columns} rowKey={'word'}>

              </Table>
            </Content>
          </Layout>
        </Layout>
        <AppFooter {...this.props}></AppFooter>
      </Layout>
    );
  }
}
