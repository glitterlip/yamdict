import { Icon, Layout, Menu } from 'antd';

import { Link } from 'react-router-dom';
import React from 'react';
import routes from '../../../constants/routes';
import style from './SideBar.css';

const { SubMenu } = Menu;
const { Sider } = Layout;
const SideBar = (props) => {
  const ROUTEARR = Object.keys(routes).map(item => {
    return {
      key: item,
      children: routes[item].children ? routes[item].children : null,
      path: routes[item].path,
      icon: routes[item].icon,
      type: routes[item].type,
      name: routes[item].name
    };
  });

  return (
    <Sider width={200} style={{ background: '#fff' }} collapsible={true} trigger={null} breakpoint={'lg'} collapsed={props.setting.collapsed}
    onBreakpoint={b=>props.setCollaspsed(b)} theme={props.setting.theme} collapsedWidth={100}
    >
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        style={{ height: '100%', borderRight: 0 }}
        theme={props.setting.theme}
        inlineCollapsed={props.setting.collapsed}
      >
        {ROUTEARR.map(item => {
          return item.type === 'single' ? (
            <Menu.Item key={item.key}>
              <Link to={item.path} className={style.link}>
                <Icon type={item.icon} />
                <span>{item.name}</span>
              </Link>
            </Menu.Item>
          ) : (
            <SubMenu
              key={item.path}
              title={
                <span>
                  <Icon type={item.icon} />
                  <span>{item.name}</span>
                </span>
              }
            >
              {item.children.map(child => {
                return (
                  <Menu.Item key={child.name}>
                    <Link to={`${item.path}${child.path}`} className={style.link}>
                      <Icon type={child.icon} />
                      <span>{child.name}</span>
                    </Link>
                  </Menu.Item>
                );
              })}
            </SubMenu>
          );
        })}
      </Menu>
    </Sider>
  );
};
export default SideBar;
