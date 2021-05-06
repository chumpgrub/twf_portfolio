import * as React from "react"
import { Link } from "gatsby"

const Footer = () => (
  <footer>
    © {new Date().getFullYear()}{` `}<Link to={`/copyright/`}>Copyright</Link>
  </footer>
)

export default Footer