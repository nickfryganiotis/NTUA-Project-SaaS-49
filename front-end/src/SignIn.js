import React from 'react';
import {Divider, TextField, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import PersonIcon from '@material-ui/icons/Person';

import { Link } from "react-router-dom";

const SignIn = () => {
    return (
        <div>
            <div className="icon">
                <div className="icon_class">
                    <PersonIcon fontSize="large"/>
                </div>
                <div className="text">Login</div>
            </div>



            <div className="row m-2">
                <TextField id="username" className="p-2" type="text" variant="outlined" label="User name" fullWidth/>
                <TextField id="password" className="p-2" type="text" variant="outlined" label="Password" fullWidth/>
                <FormControlLabel
                    control={
                        <Checkbox
                            icon={<CheckBoxOutlineBlankIcon fontSize="small"/>}
                            checkedIcon={<CheckBoxIcon fontsize="small"/>}
                            name="checkedI"
                        />
                    }
                    label="Remember me"
                />
                <Button variant="contained" color="primary">Login</Button>
            </div>

            <Divider variant="middle"/>
            <p className="text-center">
                <Link to="/sign_up" className="text-black-50">
                    <h5>Create Account</h5>
                </Link>
            </p>

        </div>
    )
}
export default SignIn;