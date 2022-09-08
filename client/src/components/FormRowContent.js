const FormRowContent = ({ name, value, handleChange, labelText }) => {
  return (
    <div className='form-row'>
      <label htmlFor={name} className='form-label'>
        {labelText || name}
      </label>
      <textarea
        value={value}
        name={name}
        onChange={handleChange}
        className='form-input'
      />
    </div>
  )
}

export default FormRowContent
