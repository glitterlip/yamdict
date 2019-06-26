// @flow
import React, { Component } from 'react';
import styles from './Home.css';
import IndexHeader from './Index/Header/Header';
import { Breadcrumb, Collapse, Icon, Layout } from 'antd';
import SideBar from './General/SideBar/SideBar';
import AppFooter from './General/Footer/Footer';
import { parserNames } from '../utils/config';

const { ipcRenderer } = require('electron');
const { Content } = Layout;

type Props = {
  setDict: ()=>void,
  setResult: ()=>void,
  dict: {},
  setting: {}
};
export default class Home extends Component<Props> {
  props: Props;


  constructor(props) {
    super(props);
    ipcRenderer.on('search-results', (event, arg) => {

      console.log('result received');
      this.props.setResult(arg);
    });
  }

  render() {

    return (
      <Layout>

        <IndexHeader {...this.props}/>
        <Layout>

          <SideBar></SideBar>
          <Layout style={{ padding: '0 24px 24px', height: '580px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <Content className={styles.content}
            >
              {Object.keys(this.props.dict.result) ? <Definitions result={this.props.dict.result}/> : ''}
            </Content>
          </Layout>
        </Layout>
        <AppFooter></AppFooter>
      </Layout>

    );
  }
}


const customPanelStyle = {
  background: '#f7f7f7',
  borderRadius: 4,
  marginBottom: 24,
  border: 0,
  overflow: 'hidden'
};
const { Panel } = Collapse;

const Definitions = ({ result }) => <Collapse
  bordered={false}
  defaultActiveKey={parserNames()}
  expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0}/>}
>

  {
    Object.keys(result).map((key) => {
      return <Panel key={key} header={key} style={customPanelStyle}>
        <div dangerouslySetInnerHTML={{ __html: result[key] }}/>

      </Panel>;


    })}

</Collapse>;
