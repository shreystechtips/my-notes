import React from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import {
  Typography,
  Grid,
  Link as MaterialLink,
  Paper,
  makeStyles,
} from "@material-ui/core"
import SEO from "../components/seo"
import Layout from "../components/layout"

const useStyles = makeStyles(() => ({
  card: {
    maxWidth: 350,
    padding: 10,
  },
  gridRoot: {
    justifyContent: "center",
    alignItems: "center",
  },
}))

export default function Index({ data }) {
  console.log(data)
  const classes = useStyles()
  const { edges: posts } = data.allMarkdownRemark
  return (
    <Layout>
      <div className="blog-posts" style={{ maxWidth: 1000, margin: "auto" }}>
        {/* <Helmet title={}/> */}
        <SEO title="Home" />
        <div style={{ margin: 10 }}>
          <Grid
            container
            direction="row"
            spacing={2}
            className={classes.gridRoot}
            sm={12}
          >
            {posts
              .filter(
                post =>
                  post.node.frontmatter.path != null &&
                  post.node.frontmatter.date != null &&
                  post.node.frontmatter.title != null &&
                  post.node.frontmatter.path.length > 0
              )
              .map(({ node: post }) => {
                return (
                  <Grid
                    item
                    className="blog-post-preview"
                    key={post.id}
                    direction="column"
                  >
                    <Grid container>
                      <Paper className={classes.card} elevation={2}>
                        <Grid item>
                          <Typography variant="h4">
                            <MaterialLink
                              to={post.frontmatter.path}
                              component={Link}
                            >
                              {post.frontmatter.title}
                            </MaterialLink>
                          </Typography>
                          <Typography variant="h6">
                            {post.frontmatter.date}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Paper
                            style={{
                              backgroundColor: "yellow",
                              width: "auto",
                              padding: 2,
                            }}
                          >
                            <Typography noWrap variant="body2">
                              Section {post.frontmatter.path}
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item>
                          <Typography variant="body1">
                            {post.excerpt}
                          </Typography>
                        </Grid>
                      </Paper>
                    </Grid>
                  </Grid>
                )
              })}
          </Grid>
        </div>
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query postsQuery {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          excerpt(pruneLength: 100)
          html
          id
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            path
            title
          }
        }
      }
    }
  }
`
