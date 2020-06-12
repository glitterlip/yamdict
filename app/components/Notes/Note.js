// @flow
import React, { Component } from 'react';
import { Breadcrumb, Icon, Layout, Rate, Table } from 'antd';
import styles from './Note.css';
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
    this.state = { words: NoteService.all() };

  }

  remove = (word) => {
    NoteService.remove(word);
    this.setState({ words: NoteService.all() });
  };

  like = (word, score) => {
    console.log(word, score);
    NoteService.update(word, score);
    this.setState({ words: NoteService.all() });
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

    );
  }
}
