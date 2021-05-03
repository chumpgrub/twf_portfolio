import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

import PrimaryMenu from "../PrimaryMenu"

import "./Header.scss"

const Header = ({ siteTitle }) => (
  <header className="siteHeader">
    <div className="siteHeader__logo">
      ---------------------------------<br/>
      ---------------------------------<br/>
      ---------- <Link to="/">{siteTitle}</Link> ----------<br/>
      ---------------------------------<br/>
      ---------------------------------<br/>
    </div>
    <PrimaryMenu/>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
