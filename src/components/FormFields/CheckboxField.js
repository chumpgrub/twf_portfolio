import React from "react"

const CheckboxField = ({ id, label, error, required, choices, handleChange }) => {
  const setRequired = required ? 'required' : ''
  const setError = error ? 'error' : ''
  console.log(choices)
  return (
    <div className={`formRow formRow--checkbox ${setRequired} ${setError}`}>
      <label className="test">{label}{required && <span>*</span>}</label>
      <div className="inputWrapper">
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
    </div>
  )
}

export default CheckboxField