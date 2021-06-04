import * as React from "react"
import { Link, StaticQuery, graphql } from "gatsby"

import Layout from "../components/Layout"
import Seo from "../components/seo"

const IndexPage = () => (
  <Layout>
    <Seo title="Home" />
    <h1 className="h1">Headline 1</h1>
    <h2 className="h2">Headline 2</h2>
    <h3>Headline 3</h3>
    <h4>Headline 4</h4>
    <h5>Headline 5</h5>
    <p>Welcome to your new Gatsby site.</p>

    <StaticQuery
      query={graphql`
        query ServiceMenuQuery {
          menu: allWpMenuItem(
            filter: { menu: { node: { name: { eq: "Photo Services" } } } }
            sort: { order: ASC, fields: order }
          ) {
            items: nodes {
              id
              label
              path
            }
          }
        }
      `}
      render={data => {
        console.log(data)
        const styles = {
          display: "flex",
          flexDirection: "column",
        }
        return (
          <nav className={`menu menuHomepage`} style={styles}>
            {data?.menu?.items.map(item => (
              <Link className={`h5`} key={item.id} to={item.path}>
                {item.label}
              </Link>
            ))}
          </nav>
        )
      }}
    />
  </Layout>
)

export default IndexPage
