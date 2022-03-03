//this page is to show the slots while creating events
import React from "react";
import Grid from '@material-ui/core/Grid';
import { Button } from '@uprise/button';
import { primary, backgrounds } from "@uprise/colors";
import {
    makeStyles
} from "@material-ui/core";

const useStyles = makeStyles({
    marginCont: {
        margin: 1
    },
    errColor: {
        color: 'red'
    },
    textDec: {
        textDecoration: 'underline'
    }
});

const SlotsComp = (props) => {
    const styles = useStyles();
    //on selection of the slot change the color of the buttpn
    const [selectedBtn, onSelectBtn] = React.useState(-1);

    return (
        <div className='App'>
            <Grid direction='row' container xs={12} sm={12} md={12} lg={12} >
                <Grid item xs={4} sm={4} md={4} lg={4}></Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <Grid container spacing={2} justify="center" className={styles.marginCont}>
                        <Grid item xs={3} sm={3} md={4} lg={4}>
                        </Grid>
                        <Grid direction='row' container spacing={1}>
                            {slots.map((d, i) =>
                                <Grid container item sm={6} lg={4} md={4} xs={6}>
                                    <Button title={d.label} size={'medium'}
                                        style={{
                                            backgroundColor: selectedBtn === i ? primary.purple
                                                : backgrounds.fadedPurple,
                                            color: selectedBtn === i ? backgrounds.white : primary.purple,
                                            borderWidth: 0
                                        }}
                                        onClick={() => {
                                            onSelectBtn(i);
                                            props.setSlotValue(d.value)
                                        }}
                                        key={d + i}
                                    />
                                </Grid>
                            )}
                        </Grid>
                        <Grid item xs={3} sm={3} md={4} lg={4}>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}></Grid>
            </Grid>
        </div >
    );
}

//list of slots
//label is to display, value is used to save it collection
const slots = [
    { label: "10:00 AM - 10.30 AM", value: "10:00:00" }, { label: "10:30 AM - 11.00 AM", value: "10:30:00" },
    { label: "11:00 AM - 11.30 AM", value: "11:00:00" }, { label: "11:30 AM - 12.00 PM", value: "11:30:00" },
    { label: "12:00 PM - 12.30 PM", value: "12:00:00" }, { label: "12:30 PM - 01.00 PM", value: "12:30:00" },
    { label: "01:00 PM - 01.30 PM", value: "13:00:00" }, { label: "01:30 PM - 02.00 PM", value: "13:30:00" },
    { label: "02:00 PM - 02.30 PM", value: "14:00:00" }, { label: "02:30 PM - 03.00 PM", value: "14:30:00" },
    { label: "03:00 PM - 03.30 PM", value: "15:00:00" }, { label: "03:30 PM - 04.00 PM", value: "15:30:00" },
    { label: "04:00 PM - 04.30 PM", value: "16:00:00" }, { label: "04:30 PM - 05.00 PM", value: "16:30:00" },
    { label: "05:00 PM - 05.30 PM", value: "17:00:00" }, { label: "05:30 PM - 06.00 PM", value: "17:30:00" }
];


export default SlotsComp;

