import React from 'react'
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';

const Navigation = (props) => {

    return (
        <AppBar 
            title="Gotham Police Crime Tips"
            iconElementRight={props.uid ? <FlatButton label="Log Out" href="log_out" /> : null} 
            zDepth={0}
        />
    );
}

export default Navigation