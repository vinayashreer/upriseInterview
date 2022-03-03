//this is the calendar component used to select date
import React from "react";
import "react-dates/initialize";
import { DayPickerSingleDateController } from "react-dates";
import styled from "styled-components";
import "react-dates/lib/css/_datepicker.css";

const StyledDatePickerWrapper = styled.div`
  & .DayPickerSingleDateController,
  .DayPickerSingleDateControllerInput {
    .DateInput {
      width: 100%;
      height: 40px;
      display: flex;

      .DateInput_input {
        font-size: 1rem;
        border-bottom: 0;
        padding: 12px 16px 14px;
      }
    }

    .DayPickerSingleDateControllerInput__withBorder {
      border-radius: 4px;
      overflow: hidden;

      :hover,
      .DateInput_input__focused {
        border: 1px solid red;
      }

      .CalendarDay__selected {
        background: blue;
        border: blueviolet;
      }
    }

    .DayPickerSingleDateController_picker.DayPickerSingleDateController_picker {
      top: 43px;
      left: 2px;
      /* top: 43px !important;
      left: 2px !important; */
    }
  }
`;

export const DatePicker = (props) => {
  //state to set the selected date
  const [selDate, setDate] = React.useState('');
  //state to set focused date
  const [focused, setFocus] = React.useState(true);

  return (
    <StyledDatePickerWrapper>
      <DayPickerSingleDateController
        hideKeyboardShortcutsPanel
        numberOfMonths={1}
        required={false}
        disabled
        readOnly
        onDateChange={date => { setDate(date); props.setDate(date) }}
        onFocusChange={({ focused }) => { setFocus(focused); }}
        focused={focused}
        date={selDate}
      />
    </StyledDatePickerWrapper>
  );
}
