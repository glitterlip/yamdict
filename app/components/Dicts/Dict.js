// @flow
import React, { Component } from 'react';
import { Breadcrumb, Button, Col, Collapse, Icon, Input, Layout, Modal, Row, Switch, Table, Tabs } from 'antd';
import styles from './Dict.css';
import IndexHeader from '../Index/Header/Header';
import SideBar from '../General/SideBar/SideBar';
import AppFooter from '../General/Footer/Footer';
import DictsInfo from './DictsInfo';
import { configDb } from '../../utils/config';
import { DictService, loadParsers } from '../../services/dict/DictService';

const { Content } = Layout;
const { ipcRenderer } = require('electron');
const { Panel } = Collapse;
const { TabPane } = Tabs;
type Props = {
  setDict: () => void,
  setResult: () => void,
  dict: {},
  setting: {}
};
export default class Dict extends Component<Props> {
  props: Props;

  constructor() {
    super();
    let dicts = DictService.getAllDicts();
    let visible = false;
    let title = '';
    let content = '';
    this.state = {
      dicts, title, visible, content,
      oldName: '',
      newName: ''
    };
    ipcRenderer.on('dicts:update', (event, arg) => {
      this.setState({ dicts: DictService.getAllDicts() });
    });


  }

  handleOk = e => {
    this.setState({
      visible: false
    });
  };

  toggleDict = (dict) => {

    configDb.get('dicts').find({ name: dict.name }).assign({ enabled: dict.enabled === 0 ? 1 : 0 }).write();
    let dicts = configDb.get('dicts').value();

    this.setState({ dicts });
    loadParsers();

  };

  format = (str) => {
    return (new DOMParser()).parseFromString(str, 'text/xml').querySelector('Dictionary').attributes.getNamedItem('Description').value;
  };

  dictInfo = (dict) => {

    let content = this.format(dict.info);
    this.setState({
      visible: true,
      title: dict.name,
      content
    });
  };

  rename = (dict, oldName, newName) => {
    console.log(dict);

  };

  deleteDict = (dict) => {
    console.log(dict);

  };

  handleEdit = () => {

    DictService.rename(this.state.newName, this.state.oldName);

    let dicts = [...this.state.dicts];
    for (let i = 0; i < dicts.length; i++) {
      let item = dicts[i];
      if (item.name === this.state.oldName) {
        item.name = this.state.newName;
        break;
      }
    }

    this.setState({ dicts });
    this.closeEditModal();

  };

  closeEditModal=()=>{
    this.setState({ oldName: '' });
  };
  orderUp = (dict) => {

    let dicts = [...this.state.dicts];
    for (let i = 0; i < dicts.length; i++) {
      let item = dicts[i];
      if (item.name === dict.name) {
        let temp = dicts[i - 1];
        dicts[i - 1] = dict;
        dicts[i] = temp;
        break;
      }
    }

    this.setState({ dicts });
    console.log(dicts);
    DictService.updateSort(dicts);

  };


  orderDown = (dict) => {
    let dicts = [...this.state.dicts];
    for (let i = 0; i < dicts.length; i++) {
      let item = dicts[i];
      if (item.name === dict.name) {
        let temp = dicts[i + 1];
        dicts[i + 1] = dict;
        dicts[i] = temp;
        break;
      }
    }

    this.setState({ dicts });
    DictService.updateSort(dicts);
  };


  render() {
    let items = DictService.getAllDicts();
    const columns = [
      {
        title: '文件名',
        dataIndex: 'name'
      },
      {
        title: '词条数',
        dataIndex: 'items'
      },
      {
        title: '详情',
        key: 'info',
        render: (text, dict, index) => <Button icon="ellipsis" shape="round" onClick={() => {
          this.dictInfo(dict);
        }}/>
      },
      {
        title: '状态',
        key: 'enabled',
        render: (text, dict, index) =>
          <Switch checked={!!dict.enabled}
                  checkedChildren="启用"
                  unCheckedChildren="禁用"
                  onChange={() => {
                    this.toggleDict(dict);
                  }}/>
      },

      {
        title: '排序',
        key: 'sort',
        render: (text, record, index) => {

          if (index === items.length - 1) {
            return <span>
              <Icon type="up-circle" style={{ fontSize: 20 }} theme="twoTone" onClick={() => {
                this.orderUp(record);
              }}/>
            </span>;
          } else if (index === 0) {
            return <span>
              <Icon type="down-circle" style={{ fontSize: 20 }} theme="twoTone" onClick={() => {
                this.orderDown(record);
              }}/>
            </span>;
          } else {
            return (
              <span>
                <Icon type="up-circle" style={{ fontSize: 20 }} theme="twoTone" onClick={() => {
                  this.orderUp(record);
                }}/>
                <br/>
                <Icon type="down-circle" style={{ fontSize: 20 }} theme="twoTone" onClick={() => {
                  this.orderDown(record);
                }}/>
            </span>
            );

          }
        }


      },
      {
        title: '操作',
        key: 'operations',
        render: (record) => (
          <span>
            <Icon type="edit" theme="twoTone" style={{ fontSize: 20 }} onClick={() => {
              this.setState({ oldName: record.name });
            }}>重命名</Icon>
        <Icon type="delete" theme="twoTone" style={{ fontSize: 20 }} onClick={() => {
          this.deleteDict(record);
        }}>删除</Icon>
      </span>
        )
      }
    ];

    return (
      <Layout style={{ padding: '0 24px 24px', minHeight: '400px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>词典</Breadcrumb.Item>
        </Breadcrumb>
        <Content className={styles.content}>
          <Modal
            title={this.state.title}
            visible={this.state.visible}
            onOk={this.handleOk}
            okText={'确定'}
            width={'70%'}
            maskClosable={true}
            closable={false}
            footer={[
              <Button key="ok" type="primary" onClick={this.handleOk}>
                确定
              </Button>
            ]}
          >
            <div dangerouslySetInnerHTML={{ __html: this.state.content }}></div>

          </Modal>
          <Modal
            title='词典修改'
            visible={this.state.oldName.length > 0}
            onOk={this.handleEdit}
            okText={'确定'}
            width={'70%'}
            maskClosable={true}
            closable={true}
            footer={[
              <Button key="cancel" type="primary" onClick={this.closeEditModal}>
                取消
              </Button>,
              <Button key="ok" type="primary" onClick={this.handleEdit}>
                确定
              </Button>
            ]}
          >
            <Input placeholder="请输入新名字(原文件名不变)" onChange={(e) => {
              this.setState({ newName: e.target.value });
            }}/>

          </Modal>
          <Row>
            <Col span={24}>
              <DictsInfo></DictsInfo>
            </Col>
          </Row>
          <Row>
            {/*<Table dataSource={this.state.dicts} columns={columns} rowKey={'name'}/>*/}
            <Table dataSource={items} columns={columns} rowKey={'name'}/>
          </Row>
        </Content>
      </Layout>

    );
  }
}
