//component to handle selection box, here this is used to select timezone
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export const Combobox = (props) => {
    //to set the selected value of combo box
    const [inputValue, setInputValue] = React.useState('');

    //on change of selection call the parent function to set the value in parent comp
    React.useEffect(() => {
        if (inputValue)
            props.setValue(inputValue);
    }, [inputValue]);

    return (
        <Autocomplete
            disablePortal
            onChange={(event, newValue) => {
                if (!newValue) {
                    props.setValue('');
                }
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            id="combo-box-demo"
            options={props.data}
            renderInput={(params) => <TextField {...params} label={props.label} />}
        />
    );
}