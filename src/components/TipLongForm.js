import React, { Component } from 'react'
import { Card, Button } from 'semantic-ui-react'
import TipFormIntro from '../components/TipFormIntro'
import TipFormSuspect from '../components/TipFormSuspect'
import TipFormVehicle from '../components/TipFormVehicle'
import TipFormDrugs from '../components/TipFormDrugs'
import TipFormMedia from '../components/TipFormMedia'
import TipFormConclusion from '../components/TipFormConclusion'
import { firebaseApp } from '../helpers/firebase'
import { language } from '../helpers/languages'

export default class TipLongForm extends Component {
  state = {
    tip: {
      archived: false,
      read: true,
      attachment: false,
      type: 'phone',
    }
  }

  handleInputChange = (e, { name, value }) => {
    const tip = {...this.state.tip}
    tip[name] = value
    this.setState({tip})
  }

  handleCheckChange = (e, { name }) => {
    const tip = {...this.state.tip}
    tip[name] = tip[name] ? !tip[name] : true
    this.setState({tip})
  }

  createTip = (event) => {
    event.preventDefault();
    var tip = {...this.state.tip}
    tip['submitted'] = true
    tip['timestamp'] = Date.now()
    tip['uid'] = firebaseApp.auth().currentUser.uid
    firebaseApp.database().ref('tips/').push({...tip})
    this.setState({tip: {}});
    this.props.filterTips('archived', false)
  }

  render() {
    const lang = language['english']
    const style = {
      card: {margin: '10px'},
      header: {backgroundColor: '#E0E0E0'},
      actions: {textAlign: 'right'}
    }
    return (
      <Card fluid>
        <Card.Content header='New Crime Tip' />
        <Card fluid style={style.card}>
          <Card.Content header='1. Incident' style={style.header} />
          <Card.Content>
            <TipFormIntro 
              tip={this.state.tip}
              handleInputChange={this.handleInputChange} 
              handleCheckChange={this.handleCheckChange}
              lang={lang}
              handleFormModuleChange={this.handleFormModuleChange}
              errorText={false}
            />
          </Card.Content>
        </Card>
        <Card fluid style={style.card}>
          <Card.Content header='2. Suspect' style={style.header} />
          <Card.Content>
            <TipFormSuspect
              tip={this.state.tip}
              handleInputChange={this.handleInputChange}
              lang={lang}
            />
          </Card.Content>
        </Card>
        <Card fluid style={style.card}>
          <Card.Content header='3. Vehicle' style={style.header} />
          <Card.Content>
            <TipFormVehicle
              tip={this.state.tip}
              handleInputChange={this.handleInputChange}
              lang={lang}
            />
          </Card.Content>
        </Card>
        <Card fluid style={style.card}>
          <Card.Content title='4. Drugs' style={style.header} />
          <Card.Content>
            <TipFormDrugs
              tip={this.state.tip}
              handleInputChange={this.handleInputChange}
              lang={lang}
            />
          </Card.Content>
        </Card>
        <Card fluid style={style.card}>
          <Card.Content title='5. Media' style={style.header} />
          <Card.Content>
            <TipFormMedia tip={this.state.tip} />
          </Card.Content>
        </Card>
        <Card fluid style={style.card}>
          <Card.Content header='6. Final' style={style.header} />
          <Card.Content>
            <TipFormConclusion
              tip={this.state.tip}
              handleInputChange={this.handleInputChange}
              lang={lang}
            />
          </Card.Content>
        </Card>
        <Card.Content style={{textAlign: 'right'}}>
          <Button content='Discard' />
          <Button content='Save Draft' />
          <Button content='Submit' color='violet' onClick={(e) => this.createTip(e)} />
        </Card.Content>
      </Card>
    )
  }
}