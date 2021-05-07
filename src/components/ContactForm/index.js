import React, { useState } from "react"
import { useStaticQuery, graphql } from "gatsby"

import gql from "graphql-tag"
import { Mutation } from "react-apollo"

import TextField from "../FormFields/TextField"
import EmailField from "../FormFields/EmailField"
import PhoneField from "../FormFields/PhoneField"
import CheckboxField from "../FormFields/CheckboxField"
import TextareaField from "../FormFields/TextareaField"

import "./ContactForm.scss"

const CONTACT_MUTATION = gql`
  mutation CreateSubmissionMutation($clientMutationId: String!, $name: String!, $email: String!, $phone: String!, $interest: [CheckboxInput], $message: String!) {
    submitGravityFormsForm(input: {formId: 1, clientMutationId: $clientMutationId, createdBy: 1, fieldValues: [{id: 8, value: $name}, {id: 4, emailValues: {value: $email}}, {id: 5, value: $phone}, {id: 6, checkboxValues: $interest}, {id: 7, value: $message}]}) {
      errors {
        id
        message
      }
      entryId
      resumeToken
      entry {
        id
      }
    }
  }
`

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const ContactForm = () => {

  const components = {
    text: TextField,
    email: EmailField,
    phone: PhoneField,
    checkbox: CheckboxField,
    textarea: TextareaField
  }

  const data = useStaticQuery(graphql`
  query ContactFormQuery {
    wpGravityFormsForm(formId: {eq: 1}) {
      id
      formId
      formFields {
        fields: nodes {
          ... on WpTextField {
            id
            label
            adminLabel
            description
            isRequired
            type
          }
          ... on WpEmailField {
            id
            label
            adminLabel
            description
            isRequired
            type
          }
          ... on WpTextAreaField {
            id
            label
            adminLabel
            description
            isRequired
            type
          }
          ... on WpCheckboxField {
            id
            label
            adminLabel
            description
            isRequired
            choices {
              text
              value
            }
            type
          }
          ... on WpPhoneField {
            id
            label
            adminLabel
            description
            isRequired
            type
          }
        }
      }
    }
  }
  `)

  const { fields } = data?.wpGravityFormsForm?.formFields

  console.log(fields)

  const [state, setState] = useState({
    name: {value: '', error: false},
    email: {value: '', error: false},
    phone: {value: '', error: false},
    interest: {value: [], error: false},
    message: {value: '', error: false},
    isSpam: false
  })

  const handleChange = (event) => {
    
    const { name, value, required, type, checked } = event?.target

    // Set error if empty and required.
    const error = ( !String(value).trim().length > 0 && required ) ? true : false

    // Get current interest values.
    let interests = state.interest.value

    // Handle differently if change is coming from checkbox input.
    if (type === 'checkbox') {
      if (checked) { // Adding value.
        interests.push(value)
      } else { // Removing value.
        var currentIndex = interests.indexOf(value)
        interests.splice(currentIndex, 1)
      }
    }
    
    // Update state.
    setState({ ...state,
      [`${name}`]: {
        value: (type === 'checkbox') ? interests : value,
        error
      }
    })
  }

  const handleSubmit = async (e, submitGravityFormsForm) => {
    e.preventDefault()

    // Check for errors before submitting.
    const errors = Object.values(state).filter( field => field.error === true)

    const { name, email, phone, interest, message, isSpam } = state

    // Bail if set.
    if (isSpam) return

    if (errors.length > 0) {
      console.log(errors)
    } else {

      // Build array of objects expected by Gravity Forms.
      const interestArray = interest.value.map( (interest, index) => ({
        inputId: 6+((index+1)/10), // Hard-coded Gravity Field ID (6).
        value: interest
      }))

      submitGravityFormsForm({
        variables: {
          clientMutationId: 'test2',
          name: name.value,
          email: email.value,
          phone: phone.value,
          interest: interestArray,
          message: message.value
        }
      })
    }
  }

  return (
    <Mutation mutation={CONTACT_MUTATION}>
      {(submitGravityFormsForm, { loading, error, data }) => {

        // For loading message while submitting.
        if (loading) {
          return (<div className="formResponse formResponse--loading">Submiting form...</div>)
        }

        // If server response has no errors, we're assuming success.
        if (data && !data?.submitGravityFormsForm?.errors) {
          return (
            <div className="formResponse formResponse--thankYou">Thank you!</div>
          )
        }

        return (
          <form onSubmit={(e) => handleSubmit(e, submitGravityFormsForm)}>
            {fields && fields.map(field => {
      
              const TagName = components[field.type]
              const fieldKey = String(field.adminLabel).toLowerCase().replace(/\s/g, '')
              const hasError = (field.isRequired && state[fieldKey].error)
              
              return (
                <TagName
                  key={field.id}
                  id={fieldKey}
                  label={field.label}
                  error={hasError}
                  choices={field.type === 'checkbox' ? field.choices : false}
                  handleChange={handleChange}
                  required={field.isRequired}
                />
              )
              
            })}
            <input 
              type="checkbox" 
              name="email_me_right_now" 
              value="1" 
              style={{display:'none'}} 
              tabIndex="-1" 
              autoComplete="off"
              onChange={() => setState({...state, isSpam: true})}
            />
            <button>Get in touch</button>
          </form>
        )
      }}
    </Mutation>
    
  )

}

export default ContactForm