import React from 'react';

const AddKeyForm = (props) => {
  let keyNameInput = null;
  let keyValueInput = null;
  
  const { onAddRequest, onCancelRequest } = props;

  return (
    <div>
      <input ref={ c => keyNameInput = c } type="text" placeholder="Key Name" />
      <input ref={ c => keyValueInput = c } type="text" placeholder="Key Value" />
      
      <button onClick={ evt => onAddRequest([keyNameInput.value, keyValueInput.value])}>
        Add
      </button>

      <button onClick={onCancelRequest}>
        Cancel
      </button>
    </div>
  );
};

export default AddKeyForm;