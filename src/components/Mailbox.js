import React, {Component} from 'react'
import MailboxLeftPanel from './MailboxLeftPanel'
import MailboxPanel from './MailboxPanel'
import TipDetail from './TipDetail'
import TipLongForm from './TipLongForm'

class Mailbox extends Component {

  renderRightPanel() {

    switch(this.props.mailboxRightPanel) {
      case 'mailbox':
        return (
          <MailboxPanel
            showTipDetail={this.props.showTipDetail}
            addSelectedItem={this.props.addSelectedItem}
            markTipAs={this.props.markTipAs}
            tipsToDisplay={this.props.tipsToDisplay}
            searchTips={this.props.searchTips}
            searchTerm={this.props.searchTerm}
            isAdmin={true}
            showNextButton={(Object.keys(this.props.tipsToDisplay).length < this.props.tipsPerPage) ? false: true}
            showPreviousButton={(this.props.showPage===0) ? false: true}
            changePage={this.props.changePage} />
        )
      case 'detail':
        return <TipDetail tipDetail={this.props.tipDetail} uid={this.props.uid} tips={this.props.tips} />
      case 'form':
        return <TipLongForm uid={this.props.uid} filterTips={this.props.filterTips} />
      default:
        console.error('Invalid Right Panel', 'mailBoxRightPanel must be mailbox, detail or form')
    }
  }

  render() {
    return (
      <div className="row" style={{
        margin: '10px 2px 8px 2px'
      }}>
        <MailboxLeftPanel
          unreadCount={this.props.unreadCount}
          filterTips={this.props.filterTips}
          openTipLongForm={this.props.openTipLongForm}/> 
        {this.renderRightPanel()}
      </div>
    )
  }
}

export default Mailbox