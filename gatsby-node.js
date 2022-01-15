/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const path = require("path");
const { fmImagesToRelative } = require("gatsby-remark-relative-images");

exports.onCreateNode = ({ node }) => {
	fmImagesToRelative(node);
};

exports.createPages = ({ boundActionCreators, graphql }) => {
	const { createPage } = boundActionCreators;
	const blogPostTemplate = path.resolve(`src/templates/blog-post.js`);
	const indexTemplate = path.resolve(`src/templates/home.js`);
	// const req = "/\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\+\\d{2}:\\d{2}/g";
	// date:{regex:"/\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\+\\d{2}:\\d{2}/g"}
	return graphql(`
		{
			allMarkdownRemark(
				filter: { frontmatter: { path: { ne: null }, title: { ne: null } } }
				sort: { order: DESC, fields: [frontmatter___date] }
				limit: 1000
			) {
				edges {
					node {
						fileAbsolutePath
						excerpt(pruneLength: 100)
						html
						id
						frontmatter {
							date
							path
							title
						}
					}
				}
			}
		}
	`).then((result) => {
		if (result.errors) {
			return Promise.reject(result.errors);
		}
		var ret = { data: { allMarkdownRemark: { edges: [] } } };
		result.data.allMarkdownRemark.edges.forEach(({ node }) => {
			if (
				node.frontmatter.path != null &&
				node.frontmatter.date != null &&
				node.frontmatter.title != null &&
				node.frontmatter.path.indexOf("..") < 0
			) {
				// var { dir, base } = path.parse(
				//   path.relative(path.join(__dirname, "classes"), node.fileAbsolutePath)
				// )
				// dir = dir.split("/")
				// const start = dir.indexOf("classes")
				createPage({
					// ${dir[start + 1]}/${dir[start + 2]}
					path: node.frontmatter.path,
					component: blogPostTemplate,
					context: {
						truePath: node.frontmatter.path,
					}, // additional data can be passed via context
				});
				ret.data.allMarkdownRemark.edges.push({
					node: {
						excerpt: node["excerpt"],
						frontmatter: node["frontmatter"],
					},
				});
			}
		});

		// filter posts to offload computation
		const { edges: posts } = ret.data.allMarkdownRemark;
		var vals = {};
		const temp = posts.filter(
			(post) =>
				post.node.frontmatter.path != null &&
				post.node.frontmatter.date != null &&
				post.node.frontmatter.title != null &&
				post.node.frontmatter.path.indexOf("..") < 0 &&
				post.node.frontmatter.path.length > 0
		);
		temp.map(({ node: post }) => {
			// Parse the URL by class
			var cut = post.frontmatter.path.split("/");
			cut = cut.slice(1);
			// If a class and subsection is defined (lecture, disc, etc)
			if (cut.length >= 2) {
				// Add class to cut if not exists
				if (!vals.hasOwnProperty(cut[0])) {
					vals[cut[0]] = {};
				}
				// Add subsection if not exists
				if (!vals[cut[0]].hasOwnProperty(cut[1])) {
					vals[cut[0]][cut[1]] = [];
				}
				// Add the post to the data
				vals[cut[0]][cut[1]].push(post);
			}
		});

		createPage({
			path: "/",
			component: indexTemplate,
			context: {
				data: vals,
			},
		});
	});
};
