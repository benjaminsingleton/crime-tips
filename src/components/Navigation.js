import React from 'react'
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';

const Navigation = (props) => {

    return (
        <AppBar 
            title="Gotham Police Crime Tips" 
            iconElementRight={<FlatButton label="Log Out" href="log_out" />} 
            zDepth={0} 
        />
    );
}

export default Navigation