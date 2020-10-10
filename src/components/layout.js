/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";
import CssBaseline from "@material-ui/core/CssBaseline";
import Header from "./header";
import "./layout.css";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";

console.warn = console.error = () => {};

const Layout = ({ children }) => {
	const data = useStaticQuery(graphql`
		query SiteTitleQuery {
			site {
				siteMetadata {
					title
				}
			}
		}
	`);

	const systemDark = useMediaQuery("(prefers-color-scheme: dark)");
	React.useEffect(() => {
		var theme = window.localStorage.getItem("theme");
		if (theme === null) {
			setDarkState(systemDark);
		} else {
			theme = theme === "true";
			setDarkState(theme);
		}
	}, []);

	const [darkState, setDarkState] = React.useState(false);
	// const palletType = darkState ? "dark" : "light";
	// const mainPrimaryColor = darkState ? orange[500] : lightBlue[500]
	// const mainSecondaryColor = darkState ? deepOrange[900] : deepPurple[500]
	const getTheme = (state) => {
		return createMuiTheme({
			palette: {
				type: state ? "dark" : "light",
				// background: { paper: "#F3F3F7" },
			},
		});
	};
	const darkTheme = getTheme(darkState);
	// createMuiTheme({
	// 	palette: {

	// 		type: darkState ? "dark" : "light",

	// 	},
	// });

	const handleThemeChange = async () => {
		window.localStorage.setItem("theme", !darkState);
		setDarkState(!darkState);
	};
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
	);
};

Layout.propTypes = {
	children: PropTypes.node.isRequired,
};

export default Layout;
