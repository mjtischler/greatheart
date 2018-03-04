import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Card, CardHeader, CardTitle, CardText} from 'material-ui/Card';
import AppBar from 'material-ui/AppBar';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import './Sidebar.css';

const SidebarStyles = {
  appBar: {
    backgroundColor: 'rgb(161, 92, 230)'
  },
  card: {
    backgroundColor: 'rgb(112, 112, 112)',
    height: 'inherit'
  }
};

class Sidebar extends Component {
  constructor (props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount () {
  }

  render () {
    return (
      <div className="Sidebar-container">
        <Card style={ SidebarStyles.card }>
          <AppBar
            style={ SidebarStyles.appBar }
            title="Catch Up"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
          />
          <CardHeader
            title="URL Avatar"
            subtitle="Subtitle"
          />
          <CardTitle title="Card title" subtitle="Card subtitle" />
          <CardText>
            <List>
              <Subheader>Today</Subheader>
              <Divider inset={true} />
              <ListItem>Test 123 This is a test</ListItem>
              <ListItem>Test 123 This is a test</ListItem>
              <ListItem>Test 123 This is a test</ListItem>
              <ListItem>Test 123 This is a test</ListItem>
              <ListItem>Test 123 This is a test</ListItem>
              <ListItem>Test 123 This is a test</ListItem>
              <ListItem>Test 123 This is a test</ListItem>
              <ListItem>Test 123 This is a test</ListItem>
            </List>
          </CardText>
        </Card>
      </div>
    );
  }
}

Sidebar.propTypes = {
};

export default Sidebar;
