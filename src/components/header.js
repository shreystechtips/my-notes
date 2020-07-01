import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  makeStyles,
  useScrollTrigger,
  Slide,
} from "@material-ui/core"
import MenuIcon from "@material-ui/icons/Menu"

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}))

function SlideHeader(props) {
  const { window, children } = props
  const trigger = useScrollTrigger()
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

function Header(props) {
  const classes = useStyles()
  return (
    <SlideHeader {...props}>
      <AppBar
        style={{
          background: `#FDB515`,
          marginBottom: `1.45rem`,
          // position: "absolute",
          marginTop: -2,
        }}
        position="fixed"
      >
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            <Link
              to="/"
              style={{
                color: `white`,
                textDecoration: `none`,
              }}
            >
              {props.siteTitle}
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
    </SlideHeader>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
