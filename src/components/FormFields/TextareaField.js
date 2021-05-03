import React from "react"

const TextareaField = ({ id, label, error, required, handleKeyUp, handleChange }) => {
  const setRequired = required ? 'required' : ''
  const setError = error ? 'error' : ''
  return (
    <div className={`formRow formRow--textarea ${setRequired} ${setError}`}>
      <label htmlFor={id}>{label}{required && <span>*</span>}</label>
      <textarea
        className={`formInput`}
        name={id}
        required={setRequired}
        // onKeyUpCapture={(e) => handleKeyUp(e)}
        onBlur={(e) => handleChange(e)}
      ></textarea>
    </div>
  )
}

export default TextareaField