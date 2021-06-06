import React, { useState } from "react"
import GravityFormForm from "gatsby-gravityforms-component"
import { useStaticQuery, graphql } from "gatsby"

const AllGravityData = () => {
  const { allGfForm } = useStaticQuery(
      graphql`
          query {
              allGfForm {
                  edges {
                      node {
                          ...GravityFormComponent
                      }
                  }
              }
          }
      `
  )
  return allGfForm
}

const handleError = ({values, error, reset}) => {
  //handle error
  console.log('errors', values, error, reset)
}

const handleSuccess = ({values, reset, confirmations}) => {
  //handle success
  console.log('success', values, reset, confirmations)
}

const ContactForm = () => (
  <GravityFormForm
    id={1}
    formData={AllGravityData()}
    lambda={`https://twf.markfurrow.com/wp-json/formsubmit/v1/submit`}
    successCallback={handleSuccess}
    errorCallback={handleError}
  />
)

export default ContactForm
