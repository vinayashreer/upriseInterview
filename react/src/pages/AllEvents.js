//this is the component to fetch the events stored
import React from "react";
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { Button } from '@uprise/button'
import CircularProgress from '@mui/material/CircularProgress';
import {
    makeStyles
} from "@material-ui/core";
//custom
import EventsComp from './Events';
//style
import '../App.css';
//func
import { createReq } from "../lib/httpReq";


const useStyles = makeStyles({
    marginCont: {
        margin: 1
    },
    marginCont1: {
        margin: 10
    },
    marginCont2: {
        margin: 5
    },
    errColor: {
        color: 'red'
    },
    textDec: {
        textDecoration: 'underline'
    }
});

const AllEventsPage = (props) => {
    const theme = useStyles();
    //to set error msg, if no data founct
    const [errMsg, setErrMsg] = React.useState('');
    //to set the slot list
    const [slotList, setSlotList] = React.useState('');
    //to show activity indicator while data is loading
    const [activityLoader, setActivityLoader] = React.useState(false);

    //call the api to get the data
    const getEvents = async () => {
        let response = await callUrl({
            reqObj: {
                "op": "getSlots",
                "dateTime": props.selectedDate,
                "timeZone": props.selectedTimezone || undefined
            }, url: 'slot'
        });
        if (response && response.status
            && response.result && response.result.length) {
            setSlotList(response.result);
        } else {
            //on failure alert user
            const errMsg = 'No Events Found, Pleaset try later';
            setErrMsg(errMsg);
        }
    };

    //on start of the screen call the api
    React.useEffect(() => {
        getEvents();
    }, []);

    //call http req
    const callUrl = async (reqObj) => {
        //start the loader
        setActivityLoader(true);
        let response = await createReq(reqObj);
        //stop the loader
        setActivityLoader(false);
        return response;
    };

    return (
        <div className='App'>
            <Grid container spacing={2} justify="center" alignItems="center" className={theme.marginCont}>
                <Grid item xs={5} sm={4} md={2} lg={2} >
                    <Button title={'Go Home'} variant='text'
                        size={'small'} className={theme.textDec}
                        onClick={props.closeSlots} />
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
                {props.selectedTimezone ?
                    <Grid container spacing={2} justify="center" className={theme.marginCont1}>
                        <Typography>{'Selected Timezone : ' + props.selectedTimezone}</Typography>
                    </Grid> : <></>}
                <Grid container spacing={2} justify="center" className={theme.marginCont1}>
                    <Typography>{'Selected Date : ' + props.selectedDate}</Typography>
                </Grid>
                <Grid container spacing={2} justify="center" className={theme.marginCont1}>
                    {activityLoader ?
                        <Grid container spacing={2} justify="center" className={theme.marginCont}>
                            <CircularProgress />
                        </Grid> : <></>}
                    {errMsg ?
                        <Grid container spacing={2} justify="center" className={theme.marginCont}>
                            <Typography className={theme.errColor}>{errMsg}</Typography>
                        </Grid> : <></>}
                </Grid>
                <Grid container spacing={2} justify="center">
                    {slotList && slotList.length ?
                        <EventsComp data={slotList} /> : <></>}
                </Grid>
            </Grid>
        </div >
    )
};

export default AllEventsPage;