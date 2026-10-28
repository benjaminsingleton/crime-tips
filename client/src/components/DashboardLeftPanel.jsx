import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Panel } from './ui';

export default class DashboardLeftPanel extends Component {
  state = { activeItem: 'inbox' };

  handleItemClick = (name) => {
    switch (name) {
      case 'inbox':
        this.props.filterTips('archived', false);
        break;
      case 'abandoned':
        this.props.filterTips('abandoned', true);
        break;
      case 'important':
        this.props.filterTips('important', true);
        break;
      case 'archive':
        this.props.filterTips('archived', true);
        break;
      case 'draft':
        this.props.filterTips('draft', true);
        break;
      default:
        console.error('invalid filterTip name');
    }
    this.setState({ activeItem: name });
  };

  render() {
    const { activeItem } = this.state;
    const items = [
      { name: 'inbox', label: 'Tip inbox' },
      { name: 'abandoned', label: 'Abandoned tips' },
      { name: 'important', label: 'Important' },
      { name: 'archive', label: 'Archive' },
      { name: 'draft', label: 'Tip drafts' },
    ];

    return (
      <Panel>
        <Button
          content="New tip"
          variant="primary"
          block
          onClick={() => this.props.changePanel('form')}
        />
        <p className="panel__section-title">Folders</p>
        <ul className="side-nav">
          {items.map((item) => (
            <li key={item.name}>
              <button
                type="button"
                className={activeItem === item.name ? 'is-active' : undefined}
                onClick={() => this.handleItemClick(item.name)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        <p className="panel__section-title">Categories</p>
      </Panel>
    );
  }
}

DashboardLeftPanel.propTypes = {
  filterTips: PropTypes.func.isRequired,
  changePanel: PropTypes.func.isRequired,
};
