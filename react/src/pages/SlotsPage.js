//this is to create the events by selecting slots
import React from "react";
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { Button } from '@uprise/button'
import CircularProgress from '@mui/material/CircularProgress';
import { CheckCircle } from '@mui/icons-material';
import { primary } from "@uprise/colors";
//custom
import SlotsComp from './Slots';
//style
import '../App.css';
//func
import { createReq } from "../lib/httpReq";

//component to show onsuccess of create event
//to show check mark etc
const BookedComp = (props) => {
    return (
        <>
            <Grid item xs={12} sm={12} md={12} lg={12} justify="center" alignItems="center">
                <Grid container spacing={2} justify="center" style={{ margin: 10 }}>
                    < CheckCircle sx={{ color: primary.purple, fontSize: 55 }
                    } />
                </Grid>
                <Grid container spacing={2} justify="center" style={{ margin: 10 }}>
                    <Typography>{'Booking Successful!'}</Typography>
                </Grid>
                <Grid container spacing={2} justify="center" style={{ margin: 10 }}>
                    <Typography>{'Selected Timezone : ' + props.selectedTimezone}</Typography>
                </Grid>
                <Grid container spacing={2} justify="center" style={{ margin: 10 }}>
                    <Typography>{'Selected Date : ' + props.selectedDate + '-' + props.slot}</Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2} justify="center" alignItems="center" style={{ margin: 1 }}>
                <Grid item xs={5} sm={4} md={2} lg={2} >
                    <Button title={'Home'} variant='text'
                        size={'small'} style={{ textDecoration: 'underline' }}
                        onClick={props.closeSlots} />
                </Grid>
            </Grid>
        </>
    )
}

//to show the slots selection and create event handling
const SlotsPage = (props) => {
    //to handle err in case of validation or creation failure
    const [errMsg, setErrMsg] = React.useState('');
    //to select the slot(time)
    const [selectedSlot, setSlot] = React.useState('');
    //to show activity when the api is called
    const [activityLoader, setActivityLoader] = React.useState(false);
    //on success of create event
    const [suc, setSuc] = React.useState(false);

    //api call to handle the create event
    const createEvent = async () => {
        setErrMsg('');
        setActivityLoader(false);
        if (!selectedSlot) {//if slot is not selected
            setErrMsg('Select a Slot');
        }
        else {
            //call the create event method 
            let response = await callUrl({
                reqObj: {
                    "op": "addSlots",
                    "dateTime": props.selectedDate + ':' + selectedSlot,
                    "timeZone": props.selectedTimezone
                }, url: 'slot'
            });
            if (response && response.status) {
                setSuc(true);
            } else {
                //on failure alert user
                let errMsg = 'Unable To Save Data, Pleaset try later';
                if (response && response.errCode) {//when slot already exists
                    if (response.errCode === 'slot.process:create_new_slots_fail;given-slot-is-booked') {
                        errMsg = 'Slot is already booked!!';
                    } else {
                        errMsg = response.errCode;
                    }
                }
                else if (response && response.err && response.msgType === 2) {
                    errMsg = response.err;
                }
                setErrMsg(errMsg);
            }
        }
    };

    //call http req
    const callUrl = async (reqObj) => {
        setActivityLoader(true);
        let response = await createReq(reqObj);
        setActivityLoader(false);
        return response;
    };

    //set the slot selection
    const setSlotValue = (value) => {
        setErrMsg('');
        setSlot(value);
    };

    return (
        <div className='App'>
            {suc === false ?
                <>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Grid container spacing={2} justify="center" style={{ margin: 10 }}>
                            <Typography>{'Selected Timezone : ' + props.selectedTimezone}</Typography>
                        </Grid>
                        <Grid container spacing={2} justify="center" style={{ margin: 10 }}>
                            <Typography>{'Selected Date : ' + props.selectedDate}</Typography>
                        </Grid>
                        <Grid container spacing={2} justify="center" style={{ margin: 10 }}>
                            <Typography style={{ textDecoration: 'underline' }}>{'Select Slots'}</Typography>
                        </Grid>
                        <Grid container spacing={2} justify="center">
                            <SlotsComp setSlotValue={setSlotValue} />
                        </Grid>
                        <Grid container spacing={2} justify="center" style={{ margin: 5 }}>
                            {activityLoader ?
                                <Grid container spacing={2} justify="center" style={{ margin: 1 }}>
                                    <CircularProgress />
                                </Grid> : <></>}
                            {errMsg ?
                                <Grid container spacing={2} justify="center" style={{ margin: 1 }}>
                                    <Typography style={{ color: 'red' }}>{errMsg}</Typography>
                                </Grid> : <></>}
                            <Grid item xs={5} sm={4} md={2} lg={2} >
                                <Button title={'Create Event'} onClick={() => !activityLoader
                                    ? createEvent() : {}} />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} justify="center" alignItems="center" style={{ margin: 1 }}>
                            {/* to go back to home */}
                            <Grid item xs={5} sm={4} md={2} lg={2} >
                                <Button title={'Cancel'} variant='text'
                                    size={'small'} style={{ textDecoration: 'underline' }}
                                    onClick={props.closeSlots} />
                            </Grid>
                        </Grid>
                    </Grid>
                </> : <BookedComp {...props} slot={selectedSlot} />}
        </div >
    )
};

export default SlotsPage;