import React from 'react'

const Header = () => {
  return (
    <header className="header" style={{ borderBottom: '1px solid #f1efef' }}>
      <span style={{ float: 'right', marginRight: '10px' }}>
        <img style={{ height: 25, width: 25 }} src='/images/icon/myaccount.png' alt='user-logo' title='demo-user' />
      </span>
    </header>
  )
}

export default Header