import React from "react"
import Helmet from "react-helmet"
import Layout from "../components/layout"
export default function Template({ data }) {
  const post = data.markdownRemark
  console.log(data)
  return (
    <Layout>
      <div>
        <div
          className="blog-post-container"
          style={{ maxWidth: 1000, margin: "auto" }}
        >
          <Helmet title={`Shrey Aeron - ${post.frontmatter.title}`} />
          <div className="blog-post" style={{ margin: 10 }}>
            <h5>Current section: {post.frontmatter.path}</h5>
            <h1>{post.frontmatter.title}</h1>
            <div
              className="blog-post-content"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
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
