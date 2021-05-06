import React from "react"

const TextField = ({ id, label, error, required, handleChange }) => {
  const setRequired = required ? 'required' : ''
  const setError = error ? 'error' : ''
  return (
    <div className={`formRow formRow--text ${setRequired} ${setError}`}>
      <label htmlFor={id}>{label}{required && <span>*</span>}</label>
      <div className="inputWrapper">
        <input 
          className={`formInput`}
          name={id} 
          type="text"
          required={setRequired}
          onBlur={(e) => handleChange(e)}
        />
      </div>
    </div>
  )
}

export default TextField