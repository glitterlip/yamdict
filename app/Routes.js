import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/HomePage';
import TranslatePage from './containers/TranslatePage';
import NotePage from './containers/NotePage';
import DictPage from './containers/DictPage';
import History from './containers/HistoryPage';
import PodcastPage from './containers/PodcastPage';
import DiscoverPage from './containers/podcast/DiscoverPage';
import SubscribesPage from './containers/podcast/SubscribesPage';
import IndexHeader from './components/Index/Header/Header';
import { Layout } from 'antd';
import SideBar from './components/General/SideBar/SideBar';
import AppFooter from './components/General/Footer/Footer';
import { defaultFunctions, defaultProps } from './reducers/index';
import { connect } from 'react-redux';


function mapStateToProps(state) {
  return { ...defaultProps(state) };
}

function mapDispatchToProps(dispatch, ownProps) {

  return { ...defaultFunctions(dispatch) };

}

class Routes extends Component<Props> {

  props: Props;

  render() {
    return <App>
      <Switch>
        <React.Fragment>
          <Layout>
            <IndexHeader {...this.props}/>
            <Layout>
              <SideBar></SideBar>
              <Route path={routes.TRANSLATE.path} component={TranslatePage}/>
              <Route path={routes.HOME.path} exact component={HomePage}/>
              <Route path={routes.NOTE.path} exact component={NotePage}/>
              <Route path={routes.DICTS.path} exact component={DictPage}/>
              <Route path={routes.HISTORY.path} exact component={History}/>
              <Route path={routes.PODCAST.path} exact component={PodcastPage}/>
              <Route path='/podcast/discover' exact component={DiscoverPage}/>
              <Route path='/podcast/subscribes' exact component={SubscribesPage}/>
            </Layout>
            <AppFooter {...this.props}/>
          </Layout>
        </React.Fragment>

      </Switch>
    </App>;
  };

};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Routes);
