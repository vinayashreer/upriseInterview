//this is home page of the app, which navigates to create event to select slots
// and show slots
import React from "react";
import moment from "moment";
import Grid from '@material-ui/core/Grid';
import { Toolbar, Typography } from '@material-ui/core';
import { Button } from '@uprise/button';
import {
    makeStyles
} from "@material-ui/core";
//custom
import { DatePicker } from '../components/Calendar';
import { Combobox } from '../components/ComboBox';
import NavigBar from '../components/NavigBar';
import SlotsPage from "./SlotsPage";
import AllEventsPage from "./AllEvents";
//style
import '../App.css';
//func
import { fromUTCToFormat } from "../lib/dateHandler";


const useStyles = makeStyles({
    marginCont: {
        margin: 10
    },
    errColor: {
        color: 'red'
    },
    textDec: {
        textDecoration: 'underline'
    }
});

const HomePage = () => {
    const styles = useStyles();
    //to set the selected date
    const [selectedDate, setDate] = React.useState(moment());
    //to set the time zone
    const [selectedTimezone, setTimezone] = React.useState('');
    //to set error on selecting date or time zone
    const [errMsg, setErrMsg] = React.useState('');
    //to handle pages, 1 for create event 2 for get list of created events
    //0 for home
    const [showSlotsEvents, setShowSlotsEvents] = React.useState(0);

    //set the selected date, called from child datePicker comp
    const selectDate = (date) => {
        setErrMsg('');
        setDate(date);
    };

    //set the selected timezone, called from child combobox comp
    const seletTimezone = (value) => {
        setErrMsg('');
        setTimezone(value);
    };

    //on click of get slots, check date and time is selected
    const goToSlots = () => {
        setErrMsg('');
        if (!selectedTimezone) {
            setErrMsg('Please Select a Timezone');
        }
        else if (!selectedDate) {
            setErrMsg('Please Select a Date');
        }
        else {
            //if validation is success go to select slot and create event page
            setShowSlotsEvents(1);
        }
    };

    //on click of show events go to the events listing(using api call) page
    const getEvents = () => {
        setErrMsg('');
        if (!selectedDate || fromUTCToFormat(selectedDate) === 'Invalid date') {
            setErrMsg('Please Select a Date');
        }
        else {
            setShowSlotsEvents(2);
        }
    };

    //clear the selections
    React.useEffect(() => {
        if (showSlotsEvents === 0) {
            setDate('');
            setTimezone('');
        }
    }, [showSlotsEvents]);

    //to set back to home
    const closeSlot = () => {
        setShowSlotsEvents(0);
    };

    return (
        <div className='App'>
            <NavigBar />
            <Toolbar />
            <Toolbar />
            {showSlotsEvents === 0 ? <>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Grid container spacing={2} justify="center" className={styles.marginCont}>
                        <Typography className={styles.textDec}>{'Select Timezone'}</Typography>
                    </Grid>
                    <Grid container spacing={2} justify="center" className={styles.marginCont}>
                        <Grid item xs={6} sm={4} md={4} lg={4}>
                            <Combobox data={timezones} setValue={seletTimezone} label={'Timezone'} />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} justify="center" className={styles.marginCont}>
                        <Typography className={styles.textDec}>{'Select Date'}</Typography>
                    </Grid>
                    <Grid container spacing={2} justify="center">
                        <DatePicker setDate={selectDate} />
                    </Grid>
                    <Grid container spacing={2} justify="center" className={styles.marginCont}>
                        {errMsg ?
                            <Grid container spacing={2} justify="center" className={styles.marginCont}>
                                <Typography className={styles.errColor}>{errMsg}</Typography>
                            </Grid> : <></>}
                        <Grid item xs={5} sm={4} md={2} lg={2} >
                            <Button title={'Get Slots'} onClick={() => goToSlots()} />
                        </Grid>
                        <Grid item xs={5} sm={4} md={2} lg={2} >
                            <Button title={'Show All Events'} onClick={() => getEvents()} />
                        </Grid>
                    </Grid>
                </Grid>
            </> : showSlotsEvents === 1 ? <SlotsPage selectedDate={fromUTCToFormat(selectedDate, 'DD-MMM-YYYY')}
                selectedTimezone={selectedTimezone}
                closeSlots={() => closeSlot()} /> : <AllEventsPage
                selectedDate={fromUTCToFormat(selectedDate, 'DD-MMM-YYYY')}
                selectedTimezone={selectedTimezone}
                closeSlots={() => closeSlot()} />}
        </div >
    );
}


//time  zones used in this app
const timezones = [
    { label: 'Sydney NSW, Australia(GMT+11)' },
    { label: 'India(GMT+5:30)' },
    { label: 'TCentral Standard Time Chicago(GMT-6)' },
    { label: 'Mountain Standard Time Denver(GMT- 7)' },
    { label: 'Pacific Standard Time Los Angeles(GMT-8)' },
    { label: "Alaska Standard Time Anchorage(GMT-9)" },
    { label: 'Hawaii-Aleutian Standard Time Honolulu(GMT-10)' }
];

export default HomePage;
