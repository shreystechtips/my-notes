import React from "react"
import Helmet from "react-helmet"
import Layout from "../components/layout"
import { makeStyles, Typography } from "@material-ui/core"
import CssBaseline from "@material-ui/core/CssBaseline"
// import MDXRenderer from "gatsby-mdx"
const useStyles = makeStyles(theme => ({
  text: {
    color: theme.palette.text.primary,
  },
}))

export default function Template({ data }) {
  const post = data.markdownRemark
  const classes = useStyles()
  return (
    <Layout>
      <div>
        <div
          className="blog-post-container"
          style={{ maxWidth: 1000, margin: "auto" }}
        >
          <Helmet title={`Shrey Aeron - ${post.frontmatter.title}`} />
          <div
            className="blog-post"
            style={{ margin: 10 }}
            className={classes.text}
          >
            <Typography variant="body1" color="textPrimary">
              Current section: {post.frontmatter.path}
            </Typography>
            <Typography variant="h3" color="textPrimary">
              {post.frontmatter.title}
            </Typography>
            <CssBaseline>
              <Typography
                className="blog-post-content"
                dangerouslySetInnerHTML={{ __html: post.html }}
                color="primaryText"
              />
            </CssBaseline>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export const pageQuery = graphql`
  query BlogPostByPath($truePath: String!) {
    markdownRemark(frontmatter: { path: { eq: $truePath } }) {
      html
      frontmatter {
        path
        title
      }
    }
  }
`
