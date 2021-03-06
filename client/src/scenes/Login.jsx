import React from "react";
import { useDispatch } from "react-redux";
import { loginAction } from "../actions/session";
import { Heading,  Label, Input, Box, Button } from 'theme-ui'


export const Login = () => {
    const dispatch = useDispatch()
    const handleSubmit = e => {
        e.preventDefault();
        const user = {
            email: e.target[0].value,
            password: e.target[1].value,
        };
        dispatch(loginAction(user));
    }
    return (
        <> 
            <div className="container">
                <div id="logo-container">
                    <img src="logo.png" id="logo" alt="% project logo"/>
                </div>
                <Box
                    as='form'
                    onSubmit={e => handleSubmit(e)}
                    className="login"
                >
                    <Heading className="section-header">Login</Heading>
                    <Label htmlFor='email'>Email</Label>
                    <Input
                        name='email'
                        type='email'
                        id='email'
                        mb={3}
                    />
                    <Label htmlFor='password'>Password</Label>
                    <Input
                        type='password'
                        name='password'
                        id='password'
                        mb={3}
                    />

                    <Button>Submit</Button>
                </Box>
                
            </div>
        </>
    );
};
