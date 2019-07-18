// @flow
import React, { Component } from 'react';
import { Breadcrumb, Icon, Layout, Rate, Table } from 'antd';
import styles from './Note.css';
import IndexHeader from '../Index/Header/Header';
import SideBar from '../General/SideBar/SideBar';
import AppFooter from '../General/Footer/Footer';
import { note as NoteService } from '../../services/note/NoteService';

const { Content } = Layout;

type Props = {
  setDict: () => void,
  setResult: () => void,
  dict: {},
  setting: {}
};
export default class Note extends Component<Props> {
  props: Props;

  constructor() {
    super();
    this.words = NoteService.all();

  }

  remove = (word) => {
    NoteService.remove(word);
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
        render: time => (new Date(time)).toLocaleString()
      },
      {
        title: '星级',
        dataIndex: 'score',
        render: score => <Rate character={<Icon type="heart"/>} style={{ color: 'red' }} value={score}/>
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
        <Icon type="delete" theme="twoTone" onClick={() => {
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

              <Table dataSource={this.words} columns={columns}>

              </Table>
            </Content>
          </Layout>
        </Layout>
        <AppFooter></AppFooter>
      </Layout>
    );
  }
}
