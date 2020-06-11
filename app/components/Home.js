// @flow
import React, { Component } from 'react';
import styles from './Home.css';
import { Breadcrumb, Card, Col, Collapse, Empty, Icon, Layout, Rate, Row, Statistic } from 'antd';
import { parserNames } from '../utils/config';
import ReactAudioPlayer from 'react-audio-player';
import { note as NoteService } from '../../app/services/note/NoteService';

const { ipcRenderer, dialog } = require('electron');
const { Content } = Layout;

type Props = {
  setDict: ()=>void,
  setResult: ()=>void,
  dict: {},
  setting: {},
  setWord: ()=>void,
  setScore: ()=>void,
  setPredictions: ()=>void,
  predictions: []

};
export default class Home extends Component<Props> {
  props: Props;


  constructor(props) {
    super(props);
    this.state = {
      result: [],
      read: '',
      score: 0,
      record: 0
    };

    ipcRenderer.on('search-results', (event, arg) => {
      if (arg) {
        if (this.props.history.location.pathname !== '/') {
          this.props.history.push('/');
        }
        //下次搜索时清空网络词典
        this.props.setResult(arg);
        this.setState({ result: [], record: arg.hasOwnProperty('history') ? arg.history.records.length : 0 });

        let favo = NoteService.find(arg.word);
        if (favo) {
          this.props.setScore(favo.score);
        } else {
          this.props.setScore(0);
        }
      }
    });

    ipcRenderer.on('predictions', (event, arg) => {
      this.props.setPredictions(arg);
    });
    ipcRenderer.on('translate-result', (event, arg) => {
      if (arg.text === this.props.dict.word) {
        let result;
        if (arg.hasOwnProperty('dict')) {
          result = arg.dict;
        } else {
          result = arg.result;
        }
        this.setState({
          result
        });
      } else {
        this.props.history.push('/translate');
      }
    });
    ipcRenderer.on('forward', (event, arg) => {
      let [action, param] = arg;
      ipcRenderer.send(action, param);
    });
  }


  internet = () => {
    ipcRenderer.send('translate-request', this.props.dict.word);
  };

  spell = () => {
    ipcRenderer.send('read-request', this.props.dict.word);
    ipcRenderer.on('read-result', (event, arg) => {
      let player = this.player.audioEl;
      player.src = arg;
      player.load();
      player.play();
    });
  };

  like = (value) => {
    if (value && this.props.dict.word) {
      NoteService.add({ word: this.props.dict.word, score: value });
      this.props.setScore(value);
    }
  };

  select = () => {
    let txt = document.getSelection().toString();
    if (txt) {
      this.props.setWord(txt);
      ipcRenderer.send('search-word', txt);
    }

  };

  render() {

    return (
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
                    value={this.props.setting.score}/>
            </Col>
            <Col span={6}>
              {this.state.record ?
                <Statistic
                  value={this.state.record}
                  valueStyle={{ color: '#cf1322' }}
                  suffix={<Icon type="rise"/>}
                  prefix="已查"
                /> : ''}
            </Col>
            <ReactAudioPlayer
              ref={element => {
                this.player = element;
              }}
              src=""
            />
          </Row>
          <Row>
            <Card className={this.state.result&&this.state.result.length ? styles.show : styles.hidden}>
              {
                this.state.result.map((item, index) => {
                  return <p key={index}>{item}</p>;
                })
              }
            </Card>
          </Row>

        </Card>
        <Content className={styles.content}
        >
          {Object.keys(this.props.dict.result) ?
            <Definitions result={this.props.dict.result} select={this.select}/> : <Empty/>}
        </Content>
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

const Definitions = ({ result, select }) => <Collapse
  bordered={false}
  defaultActiveKey={parserNames()}
  expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0}/>}
>

  {
    parserNames().map((key) => {
      if (result.hasOwnProperty(key)) {
        let content = result[key] ?
          <div className={'Definitions'} onDoubleClick={select}
               dangerouslySetInnerHTML={{ __html: result[key] }}/>
          :
          <div><Empty/></div>;
        return <Panel key={key} header={key} style={customPanelStyle}>{content}</Panel>;

      }

    })

  }

</Collapse>;
