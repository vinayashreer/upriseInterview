//This component provides navigation bar with image
import * as React from 'react';
//material ui
import Box from '@mui/material/Box';
import {
    AppBar, Toolbar, makeStyles
} from "@material-ui/core";

//custom imports
import pm from '../images/pm.png';
import { backgrounds } from "@uprise/colors";

const useStyles = makeStyles({
    header: {
        backgroundColor: backgrounds.white,
        color: backgrounds.white,
        padding: 5,
    },
    navItems: {
        justifyContent: 'space-between',
    }
});

export default function NavigBar() {
    const styles = useStyles();

    return (
        <React.Fragment>
            <AppBar className={styles.header}>
                <Toolbar className={styles.navItems}>
                    <Box
                        component="img"
                        sx={{ height: 54 }}
                        src={pm}
                    />
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
}
