import React from 'react'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';

const TipFormIntro = (props) => {
  const style = {
    prompt: {
      fontFamily: 'Roboto',
      margin: '14px 0px 8px 0px',
      fontSize: '16px',
    },
    required: {
      color: '#FF5252',
      fontSize: '16px',
    }
  }
  return (
    <div>
      <div style={style.required}>* Required</div>
      <div style={style.prompt}>
        What kind of crime was committed?<span style={style.required}> *</span>
      </div>
      <div>
        <SelectField
          hintText="Select a crime type"
          value={props.tip.crimeType}
          errorText={props.errorText.crimeType && props.errorText.crimeType}
          onChange={props.handleSelectChange.bind(null, "crimeType")}
        >
          <MenuItem value="Murder" primaryText="Murder"/>
          <MenuItem value="Shooting" primaryText="Shooting"/>
          <MenuItem value="Illegal Gun Possession / Sale" primaryText="Illegal Gun Possession / Sale"/>
          <MenuItem value="Rape / Sexual Assault" primaryText="Rape / Sexual Assault"/>
          <MenuItem value="Robbery" primaryText="Robbery"/>
          <MenuItem value="Assault" primaryText="Assault"/>
          <MenuItem value="Drug Sale / Possession" primaryText="Drug Sale / Possession"/>
          <MenuItem value="Human Trafficking / Prostitution" primaryText="Human Trafficking / Prostitution"/>
          <MenuItem value="Other" primaryText="Other"/>
        </SelectField>
      </div>
      <div style={style.prompt}>
        Please tell us the information you wanted to share.<span style={style.required}> *</span>
      </div>
      <div>
        <TextField
          hintText="Tip description"
          multiLine={true}
          fullWidth={true}
          value={props.tip.tipText}
          errorText={props.errorText.tipText && props.errorText.tipText}
          onChange={props.handleTextChange.bind(null, "tipText")}
        />
      </div>
      <div className="row">
        <div className="col-lg-6 col-md-12 col-s-12 col-xs-12">
          <div style={style.prompt}>
            Where did the incident take place?<span style={style.required}> *</span>
          </div>
          <div>
            <TextField
              hintText="Incident location"
              value={props.tip.incidentLocation}
              onChange={props.handleTextChange.bind(null, "incidentLocation")}
            />
          </div>
        </div>
        <div className="col-lg-6 col-md-12 col-s-12 col-xs-12">
          <div style={style.prompt}>
            When did the incident occur?<span style={style.required}> *</span>
          </div>
          <div>
            <DatePicker
              autoOk={true}
              hintText="Pick a date"
              value={props.tip.incidentDate}
              onChange={props.handleDatePickerChange.bind(null, "incidentDate")}
            />
          </div>
        </div>
      </div>
      <div style={style.prompt}>
        How are you aware of this crime?<span style={style.required}> *</span>
      </div>
      <div>
        <SelectField
          hintText="Select a source"
          value={props.tip.tipsterAwareOfCrimeMethod}
          onChange={props.handleSelectChange.bind(null, "tipsterAwareOfCrimeMethod")}
        >
          <MenuItem value="I was a witness" primaryText="I was a witness"/>
          <MenuItem value="It happened to me directly" primaryText="It happened to me directly"/>
          <MenuItem value="Somebody told me about it" primaryText="Somebody told me about it"/>
          <MenuItem value="I overheard a conversation" primaryText="I overheard a conversation"/>
          <MenuItem value="I prefer not to answer" primaryText="I prefer not to answer"/>
          <MenuItem value="Other" primaryText="Other"/>
        </SelectField>
      </div>
    </div>
  );
}

TipFormIntro.propTypes = {
  handleSelectChange: React.PropTypes.func.isRequired,
  handleTextChange: React.PropTypes.func.isRequired,
  handleDatePickerChange: React.PropTypes.func.isRequired,
  tip: React.PropTypes.object.isRequired
}

export default TipFormIntro