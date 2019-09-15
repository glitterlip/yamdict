// @flow
import React, { Component } from 'react';
import { Breadcrumb, Col, Icon, Layout, PageHeader, Row, Statistic, Table, Tag } from 'antd';
import styles from './History.css';
import IndexHeader from '../Index/Header/Header';
import SideBar from '../General/SideBar/SideBar';
import AppFooter from '../General/Footer/Footer';
import { History as HistoryService } from '../../services/history/history';

const { Content } = Layout;

type Props = {
  setDict: () => void,
  setResult: () => void,
  dict: {},
  setting: {}
};
const extraContent = (
  <Row>
    <Col span={12}>
      <Statistic title="已查" value="10"/>
    </Col>
    {/*<Col span={12}>*/}
    {/*  <Statistic title="本月"  value={568.08}/>*/}
    {/*</Col>*/}
  </Row>
);
export default class History extends Component<Props> {
  props: Props;

  constructor() {
    super();
    this.state = { words: HistoryService().all() };

  }

  remove = (word) => {
    HistoryService().remove(word);
    this.setState({ words: HistoryService().all() });
  };

  render() {
    const columns = [
      {
        title: '单词',
        dataIndex: 'word'
      },
      {
        title: '上次查询时间',
        key: 'last_time',
        dataIndex: 'records',
        render: records => (new Date(records[records.length - 1])).toLocaleString()
        // sorter: (a, b) => a.time - b.time,
        // sortDirections: ['descend', 'ascend']
      },

      {
        title: '查询次数',
        key: 'count',
        dataIndex: 'records',
        render: records => (records.length)
        // sorter: (a, b) => a.time - b.time,
        // sortDirections: ['descend', 'ascend']
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
              <PageHeader
                title="历史"
                tags={<Tag color="red">Warning</Tag>}
              >
                <div className="wrap">
                  <div className="extraContent">{extraContent}</div>
                </div>
              </PageHeader>

              <Table dataSource={this.state.words} columns={columns} rowKey={'word'}>

              </Table>
            </Content>
          </Layout>
        </Layout>
        <AppFooter></AppFooter>
      </Layout>
    );
  }
}
