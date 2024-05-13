import Header from './Header';
import PropTypes from 'prop-types';
import React from 'react';

const Layout = props => {
    return (
        <div className="main">
            <div className="main_section">
                <Header />
                {props.children}
            </div>
        </div>
    );
};

Layout.propTypes = {
    children: PropTypes.any
};

export default Layout;
