import React from "react"

const CheckboxField = ({ id, label, error, required, choices, handleChange }) => {
  const setRequired = required ? 'required' : ''
  const setError = error ? 'error' : ''
  console.log(choices)
  return (
    <div className={`formRow formRow--text ${setRequired} ${setError}`}>
      <h6 className="test">{label}{required && <span>*</span>}</h6>
      { choices && choices.map( ({text, value}, index) => {
        return (
          <div key={index} className="checkBox">
            <label>
              <input type="checkbox" value={value} onChange={(e) => handleChange(e)}/>
              {text}
            </label>
          </div>
        )
      })}
    </div>
  )
}

export default CheckboxField