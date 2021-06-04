import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/Layout"
import ContactForm from "../components/ContactForm"

export const query = graphql`
  query($id: String) {
    wpPage(id: { eq: $id }) {
      title
      content
      slug
    }
  }
`

const Photo = ({ data }) => {
  console.log(data)
  const { title, content, slug } = data?.wpPage
  return (
    <Layout>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      {slug && slug === "book" && <ContactForm />}
    </Layout>
  )
}

export default Photo
