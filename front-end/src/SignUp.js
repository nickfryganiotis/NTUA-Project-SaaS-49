import React from 'react';
import {Divider, TextField, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import { Link } from "react-router-dom";

const SignUp = () => {
    return (
        <div>
            <div className="icon">
                <div className="icon_class">
                    <PersonAddIcon fontSize="large"/>
                </div>
                <div className="text">Sign up</div>
            </div>

            <div className="row m-2">
                <div className="col-6 p-2">
                    <TextField id="firstname" type="text" variant="outlined" label="Enter First Name" fullWidth/>
                </div>
                <div className="col-6 p-2">
                    <TextField id="lastname" type="text" variant="outlined" label="Enter Last Name" fullWidth/>
                </div>
            </div>

            <div className="row m-2">
                <TextField id="username" className="p-2" type="text" variant="outlined" label="Email (user name)" fullWidth/>
                <TextField id="password" className="p-2" type="text" variant="outlined" label="Password" fullWidth/>
                <TextField id="re-password" type="text" variant="outlined" label="Re-enter Password" fullWidth/>
                <FormControlLabel
                    control={
                        <Checkbox
                            icon={<CheckBoxOutlineBlankIcon fontSize="small"/>}
                            checkedIcon={<CheckBoxIcon fontsize="small"/>}
                            name="checkedI"
                        />
                    }
                    label="I agree to all terms & conditions"
                />
                <Button variant="contained" color="primary">Create account</Button>
            </div>

            <Divider variant="middle"/>
            <p className="text-center">
                <Link to="/" className="text-black-50">
                    <h5>Already have an Account?</h5>
                </Link>
            </p>

        </div>
    )
}
export default SignUp;