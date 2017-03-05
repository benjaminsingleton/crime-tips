import React from 'react'
import { Link } from 'react-router' 

const Navigation = (props) => {

    const { isAdmin, logout } = props;

    return (
        <div className="row border-bottom white-bg">
            <nav className="navbar navbar-static-top" role="navigation">
                <div className="navbar-header">
                    <button data-target="#navbar" data-toggle="collapse" className="navbar-toggle collapsed" type="button">
                    <i className="fa fa-reorder"></i>
                    </button>
                    <a href="#" className="navbar-brand">Crime Tips { isAdmin ? ' Admin' : null }</a>
                </div>
                { !isAdmin ? 
                    <div className="navbar-collapse collapse" id="navbar">
                        <ul className="nav navbar-nav">
                            <li className="active">
                                <Link to="admin" role="button">Admin</Link>
                            </li>
                        </ul>
                    </div> : 
                    <div className="navbar-collapse collapse" id="navbar">
                        <ul className="nav navbar-nav">
                            <li className="active">
                                <Link to="admin" role="button">Dashboard</Link>
                            </li>
                            <li>
                                <Link to="settings" role="button">Settings</Link>
                            </li>
                        </ul>
                        <ul className="nav navbar-top-links navbar-right">
                            <li>
                                <a onClick={() => logout()}><i className="fa fa-sign-out"></i> Log out</a>
                            </li>
                        </ul>
                    </div>
                }
            </nav>
        </div>
    );
}

export default Navigation