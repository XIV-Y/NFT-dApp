'use client';

import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, theme } from 'antd';
import React from 'react';

const { Header, Content, Sider } = Layout;

const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
  key,
  label: `nav ${key}`,
}));

const items2: MenuProps['items'] = [
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
].map((icon, index) => {
  const key = String(index + 1);

  return {
    key: `sub${key}`,
    icon: React.createElement(icon),
    label: `subnav ${key}`,

    children: new Array(4).fill(null).map((_, j) => {
      const subKey = index * 4 + j + 1;
      return {
        key: subKey,
        label: `option${subKey}`,
      };
    }),
  };
});

const Home: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Layout>
        <Layout>
          <Content
            style={{
              margin: 0,
              minHeight: '100vh',
              backgroundImage:
                'linear-gradient(40deg, rgba(243, 221, 254, 1), rgba(255, 188, 212, 1) 20%, rgba(243, 221, 254, 0.75) 50%, rgba(237, 188, 245, 1) 84%, rgba(194, 109, 238, 1) 94%);',
            }}
          >
            <img src="/main.svg" />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Home;
