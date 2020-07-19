/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import CssBaseline from "@material-ui/core/CssBaseline"
import Header from "./header"
import "./layout.css"
import {
  createMuiTheme,
  ThemeProvider,
  makeStyles,
} from "@material-ui/core/styles"
import { dark } from "@material-ui/core/styles/createPalette"
const useStyles = makeStyles(theme => ({
  bg: {
    backgroundColor: theme.palette.background.default,
  },
}))

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)
  const [darkState, setDarkState] = React.useState(false)
  const palletType = darkState ? "dark" : "light"
  // const mainPrimaryColor = darkState ? orange[500] : lightBlue[500]
  // const mainSecondaryColor = darkState ? deepOrange[900] : deepPurple[500]
  const darkTheme = createMuiTheme({
    palette: {
      type: palletType,
    },
  })

  const handleThemeChange = async () => {
    console.log("hello")
    setDarkState(!darkState)
  }
  const classes = useStyles()
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline>
        <div
          style={{
            overflow: "auto",
            backgroundColor: darkTheme.palette.background.default,
          }}
        >
          <Header
            siteTitle={`Shrey's ${data.site.siteMetadata.title}`}
            themeChange={handleThemeChange}
            themeDirection={darkState}
          />
          <div
            style={{
              margin: `0 auto`,
              maxWidth: 960,
              padding: `0 1.0875rem 1.45rem`,
              paddingTop: 65,
            }}
          >
            <main>{children}</main>
            {/* <footer>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </footer> */}
          </div>
        </div>
      </CssBaseline>
    </ThemeProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
