import { Link } from "gatsby";
import PropTypes from "prop-types";
import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import {
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	makeStyles,
	useScrollTrigger,
	Slide,
	List,
	ListItem,
	SwipeableDrawer,
	ListItemText,
	Collapse,
	Switch,
} from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles((theme) => ({
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
	nested1: {
		paddingLeft: theme.spacing(4),
	},
	nested2: {
		paddingLeft: theme.spacing(6),
	},
	bg: {
		backgroundColor: theme.palette.background.paper,
		overflowX: "hidden",
	},
}));

function SlideHeader(props) {
	const { children } = props;
	const trigger = useScrollTrigger();
	return (
		<Slide appear={false} direction="down" in={!trigger}>
			{children}
		</Slide>
	);
}
const NotesList = () => {
	const classes = useStyles();
	const data = useStaticQuery(pageQuery);
	const [assortedPosts, setPosts] = React.useState({});
	const { edges: posts } = data.allMarkdownRemark;
	React.useEffect(() => {
		var data = {};
		const temp = posts.filter(
			(post) =>
				post.node.frontmatter.path != null &&
				post.node.frontmatter.date != null &&
				post.node.frontmatter.title != null &&
				post.node.frontmatter.path.length > 0
		);
		temp.map(({ node: post }) => {
			var cut = post.frontmatter.path.split("/");
			cut = cut.slice(1);
			if (cut.length >= 2) {
				if (!data.hasOwnProperty(cut[0])) {
					data[cut[0]] = {};
				}
				if (!data[cut[0]].hasOwnProperty(cut[1])) {
					data[cut[0]][cut[1]] = [];
				}
				data[cut[0]][cut[1]].push(post);
			}
		});
		setPosts(data);
		var expand = {};
		for (var x in data) {
			expand[x] = false;
			for (var y in data[x]) {
				expand[`${x}_${y}`] = false;
			}
		}
		setExpand(expand);
	}, []);
	const handleClick = (input) => {
		if (!expand.hasOwnProperty(input)) {
			setExpand({ ...expand, [input]: true });
		} else {
			setExpand({ ...expand, [input]: !expand[input] });
		}
	};
	const [expand, setExpand] = React.useState({});
	return (
		<div
			style={{
				width: 250,
				minHeight: "100vh",
				height: "100%",
				// backgroundColor: "#F3F3F7",0
			}}
			className={classes.bg}
		>
			<List className={classes.bg}>
				{Object.keys(assortedPosts).map((key) => (
					<>
						<ListItem button key={key} onClick={(e) => handleClick(key)}>
							<ListItemText>{key.toUpperCase()}</ListItemText>
							{expand[key] ? <ExpandLess /> : <ExpandMore />}
						</ListItem>
						<Collapse in={expand[key]} timeout="auto" unMountOnExit>
							<List disablePadding>
								{Object.keys(assortedPosts[key]).map((typeKey) => (
									<>
										<ListItem
											button
											className={classes.nested1}
											onClick={(e) => handleClick(`${key}_${typeKey}`)}
										>
											<ListItemText>
												{typeKey.charAt(0).toUpperCase() + typeKey.substring(1)}
											</ListItemText>
											{expand[`${key}_${typeKey}`] ? (
												<ExpandLess />
											) : (
												<ExpandMore />
											)}
										</ListItem>
										<Collapse
											in={expand[`${key}_${typeKey}`]}
											timeout="auto"
											unMountOnExit
										>
											<List disablePadding>
												{assortedPosts[key][typeKey].map((post) => (
													<ListItem
														button
														component={Link}
														to={post.frontmatter.path}
														className={classes.nested2}
													>
														<ListItemText variant="h5" style={{ fontSize: 2 }}>
															{post.frontmatter.title}
														</ListItemText>
													</ListItem>
												))}
											</List>
										</Collapse>
									</>
								))}
							</List>
						</Collapse>
					</>
				))}
			</List>
		</div>
	);
};
function Header(props) {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);
	const toggleDrawer = (open) => (event) => {
		if (
			event &&
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}
		setOpen(open);
	};

	return (
		<SlideHeader {...props}>
			<AppBar
				style={{
					background: `#FDB515`,
					marginBottom: `1.45rem`,
					marginTop: -2,
				}}
				// position="fixed"
			>
				<Toolbar>
					<IconButton
						edge="start"
						className={classes.menuButton}
						color="inherit"
						aria-label="menu"
						onClick={toggleDrawer(true)}
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
					<Switch
						checked={props.themeDirection}
						onChange={() => props.themeChange()}
					/>
				</Toolbar>
				<SwipeableDrawer
					anchor="left"
					open={open}
					onClose={toggleDrawer(false)}
					onOpen={toggleDrawer(true)}
				>
					<NotesList />
				</SwipeableDrawer>
			</AppBar>
		</SlideHeader>
	);
}

Header.propTypes = {
	siteTitle: PropTypes.string,
};

Header.defaultProps = {
	siteTitle: ``,
};

export default Header;

export const pageQuery = graphql`
	query drawerQuery {
		allMarkdownRemark(
			filter: { frontmatter: { path: { ne: null }, title: { ne: null } } }
			sort: { order: DESC, fields: [frontmatter___date] }
		) {
			edges {
				node {
					frontmatter {
						date
						path
						title
					}
				}
			}
		}
	}
`;
