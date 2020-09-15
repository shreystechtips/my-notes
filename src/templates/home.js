import React from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import moment from "moment"
import {
  Typography,
  Grid,
  Link as MaterialLink,
  makeStyles,
  Card,
  CardContent,
  Paper,
} from "@material-ui/core"
import SEO from "../components/seo"
import Layout from "../components/layout"

const style = {
  card: {
    maxWidth: 350,
    minWidth: 300,
    maxHeight: 375,
    borderRadius: 8,
    backgroundColor: "#F3F3F7",
  },
  gridRoot: {
    justifyContent: "center",
    alignItems: "center",
    // textAlign: "center",
  },
}

const useStyles = makeStyles(theme => style)

export default function Index(props) {
  const classes = useStyles()
  const [assortedPosts, setPosts] = React.useState({})
  const { pageContext } = props
  const { data } = pageContext
  const { edges: posts } = data.allMarkdownRemark
  React.useEffect(() => {
    var vals = {}
    // const temp = posts.filter(
    //   post =>
    //     post.node.frontmatter.path != null &&
    //     post.node.frontmatter.date != null &&
    //     post.node.frontmatter.title != null &&
    //     post.node.frontmatter.path.length > 0
    // )
    posts.map(post => {
      var cut = post.frontmatter.path.split("/")
      cut = cut.slice(1)
      if (cut.length >= 2) {
        if (!vals.hasOwnProperty(cut[0])) {
          vals[cut[0]] = {}
        }
        if (!vals[cut[0]].hasOwnProperty(cut[1])) {
          vals[cut[0]][cut[1]] = []
        }
        vals[cut[0]][cut[1]].push(post)
      }
    })
    setPosts(vals)
  }, [])

  const generatePostsBox = (outerKey, postList) => {
    const data = postList[outerKey]
    return (
      <>
        <Typography
          variant="h5"
          style={{ fontWeight: "bold", textAlign: "center" }}
        >
          {outerKey.toUpperCase()}
        </Typography>
        {Object.keys(data).map(key => (
          <Grid
            container
            direction="column"
            key={key}
            style={{
              // overflow: "hidden",
              marginBottom: 20,
              padding: 0,
            }}
          >
            <Typography
              variant="h6"
              style={
                {
                  // textAlign: "center",
                }
              }
            >
              {key.charAt(0).toUpperCase() + key.substring(1)}
            </Typography>
            <Grid
              container
              direction="row"
              spacing={4}
              wrap="nowrap"
              style={{
                overflowX: "auto",
                // maxWidth: data[key].length * style.card.maxWidth - 15,
                // margin: "auto",
              }}
            >
              {data[key].map(post => (
                <Grid item className="blog-post-preview" key={post.id}>
                  <Grid container direction="column">
                    <Card className={classes.card}>
                      <CardContent>
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
                            {moment(post.frontmatter.date).format(
                              "MMMM DD, YYYY"
                            )}
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
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        ))}
      </>
    )
  }

  return (
    <Layout>
      <div className="blog-posts" style={{ margin: "auto" }}>
        <SEO title="Home" />
        <div style={{ margin: 10 }}>
          <Grid
            container
            direction="column"
            spacing={2}
            className={classes.gridRoot}
          >
            {Object.keys(assortedPosts).map(key => {
              return generatePostsBox(key, assortedPosts)
            })}
          </Grid>
        </div>
      </div>
    </Layout>
  )
}

// export const pageQuery = graphql`
//   query postsQuery {
//     allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
//       edges {
//         node {
//           excerpt(pruneLength: 100)
//           html
//           id
//           frontmatter {
//             date(formatString: "MMMM DD, YYYY")
//             path
//             title
//           }
//         }
//       }
//     }
//   }
// `
