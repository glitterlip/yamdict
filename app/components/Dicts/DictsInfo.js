import React, { Component } from 'react';
import { Button, Col, PageHeader, Row, Statistic, Tag } from 'antd';

const { ipcRenderer } = require('electron');

const extraContent = (
  <Row>
    <Col span={12}>
      <Statistic title="总数" value="10"/>
    </Col>
    <Col span={12}>
      <Statistic title="启用" prefix="$" value={568.08}/>
    </Col>
  </Row>
);

export default class DictsInfo extends Component {
  addDict = () => {
    ipcRenderer.send('add-dict-dialog');
  };


  render() {
    return <PageHeader
      title="词典库"
      tags={<Tag color="red">Warning</Tag>}
      extra={[
        <Button key="1" type="primary" onClick={this.addDict}>
          新增
        </Button>
      ]}

    >
      <div className="wrap">
        <div className="extraContent">{extraContent}</div>
      </div>
    </PageHeader>;
  }
}


