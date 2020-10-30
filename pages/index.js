import Head from 'next/head'

import { useState } from 'react';

import BodyVisualizer from '../components/BodyVisualizer';
import PicturesTab from '../components/Pictures';
import PainPointsTab from '../components/PainPoints';
import VideoTab from '../components/Video';

import { Layout, Menu, Breadcrumb } from 'antd';

import { Row, Col } from 'antd';
import { Tabs, Divider } from 'antd';

import Cursor3D from '../models/cursor';
import Pictures from '../models/pictures';
import PainPoints from '../models/painPoints';

const room = "test room"
const cursor = new Cursor3D(room);
const pictures = new Pictures(room);
const painPoints = new PainPoints(room);

const { TabPane } = Tabs;

const { Sider, Header, Content, Footer } = Layout;

const style = {
  height: '100vh'
};


export default function Home() {

  const [ mode, setMode ] = useState('images');

  return (
  <Layout className="layout" style={style}>
    <Header>
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
        <Menu.Item key="1">Virtual Consultation</Menu.Item>
        <Menu.Item key="2">Presecriptions</Menu.Item>
        <Menu.Item key="3">Medical Record</Menu.Item>
        <Menu.Item key="4">Settings</Menu.Item>
      </Menu>
    </Header>
    <Content style={{ padding: '30px', height: '100%'}}>
      <div className="site-layout-content" style={{ height: '100%'}}>
        <Row style={{ height: '100%' }}>
          <Col span={4}>
            <VideoTab room={room}/>
          </Col>
          <Col span={8}>
              <BodyVisualizer cursor={cursor} images={pictures} mode={mode} painPoints={painPoints}/>
          </Col>
          <Col span={12}>
            <div className="card-container">
                <Tabs type="card" activeKey={mode} onChange={(e) => {setMode(e)}}>
                  <TabPane tab="Pictures" key="images">
                    <PicturesTab cursor={cursor} pictures={pictures} />
                  </TabPane>
                  <TabPane tab="Pain" key="pain">
                    <PainPointsTab cursor={cursor} painPoints={painPoints}/>
                  </TabPane>
                </Tabs>
              </div>
            </Col>
        </Row>
      </div>
    </Content>
  </Layout>
  )

}
