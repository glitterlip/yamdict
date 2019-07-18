// @flow
import React, { Component } from 'react';
import styles from './Home.css';
import IndexHeader from './Index/Header/Header';
import { Breadcrumb, Card, Col, Collapse, Icon, Layout, Rate, Row } from 'antd';
import SideBar from './General/SideBar/SideBar';
import AppFooter from './General/Footer/Footer';
import { parserNames } from '../utils/config';
import ReactAudioPlayer from 'react-audio-player';
import { note as NoteService } from '../../app/services/note/NoteService';

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
    this.state = {
      word: '',
      result: [],
      read: '',
      score: 0
    };

    ipcRenderer.on('search-results', (event, arg) => {
      //下次搜索是清空网络词典
      this.props.setResult(arg);
      this.setState({ result: [] });

    });
    ipcRenderer.on('search-word', (event, arg) => {
      this.setState({ word: arg });
    });

  }

  setWord = (word) => {
    this.setState({ word: word });
    let favo = NoteService.find(word);
    if (favo) {
      this.setState({ score: favo.score });
    } else {
      this.setState({ score: 0 });

    }
  };

  internet = () => {
    ipcRenderer.send('translate-request', this.state.word);
    ipcRenderer.on('translate-result', (event, arg) => {
      let result;
      if (arg.hasOwnProperty('dict')) {
        result = arg.dict;
      } else {
        result = arg.result;
      }
      this.setState({
        result
      });
    });

  };

  spell = () => {
    ipcRenderer.send('read-request', this.state.word);
    ipcRenderer.on('read-result', (event, arg) => {
      let player = this.player.audioEl;
      player.src = arg;
      player.load();
      player.play();
    });
  };

  like = (value) => {
    NoteService.add({ word: this.state.word, score: value });
    this.setState({ score: value });
  };

  render() {

    return (
      <Layout>

        <IndexHeader setWord={this.setWord} {...this.props} />
        <Layout>

          <SideBar></SideBar>
          <Layout style={{ padding: '0 24px 24px', height: '580px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <Card>
              <Row>
                <Col span={2}>
                  <Icon type="audio" theme="twoTone" width='2em' height='2em' onClick={this.spell}/>
                </Col>
                <Col span={2}>
                  <Icon type="compass" theme="twoTone" width={'20'} height='20' onClick={this.internet}/>
                </Col>
                <Col span={6}>
                  <Rate character={<Icon type="heart"/>} style={{ color: 'red' }} onChange={this.like}
                        value={this.state.score}/>
                </Col>
                <ReactAudioPlayer
                  ref={element => {
                    this.player = element;
                  }}
                  src=""
                />
              </Row>
              <Row>
                {this.state.result.length ?
                  <Card>
                    {
                      this.state.result.map((item, index) => {
                        return <p key={index}>{item}</p>;
                      })
                    }
                  </Card>
                  : ''
                }
              </Row>

            </Card>
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
