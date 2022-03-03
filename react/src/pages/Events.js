//this is a child comp to show the events list
import React from "react";
import Grid from '@material-ui/core/Grid';
import { Button } from '@uprise/button';
import { Toolbar } from "@mui/material";
//func
import { fromUTCToFormat } from "../lib/dateHandler";



const EventsComp = (props) => {
    //set the data to map
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        //on load check the parent is sending valid length of data and set state
        if (props && props.data && props.data.length) {
            setData(props.data)
        }
    }, [props]);

    return (
        <>
            <Grid container justify="center" alignItems="center">
                <Grid item xs={2} sm={2} md={2} lg={2}></Grid>
                <Grid item xs={6} sm={6} md={6} lg={6} justify="center" alignItems="center">
                    <Grid direction='row' container spacing={1}>
                        {data.map((d, i) =>
                            <Grid container item sm={8} lg={8} md={8} xs={8} key={d && d.slots}>
                                <Button
                                    title={fromUTCToFormat(d.slots, 'hh:mm:ss A') + '(' + d.timeZone + ')'} size={'medium'}
                                    style={{
                                        backgroundColor: '#fff2e6',
                                        color: '#000',
                                        borderWidth: 0
                                    }}
                                />
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </Grid>
            <Toolbar />
            <Toolbar />
        </>
    );
}

export default EventsComp;

