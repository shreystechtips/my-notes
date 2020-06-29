/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const path = require("path")
const { fmImagesToRelative } = require("gatsby-remark-relative-images")

exports.onCreateNode = ({ node }) => {
  fmImagesToRelative(node)
}

exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators

  const blogPostTemplate = path.resolve(`src/templates/blog-post.js`)

  return graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            fileAbsolutePath
            excerpt(pruneLength: 250)
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
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }

    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      if (
        node.frontmatter.path != null &&
        node.frontmatter.date != null &&
        node.frontmatter.title != null
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
        })
      }
    })
  })
}
