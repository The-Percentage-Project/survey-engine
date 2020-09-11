import React, {useState, useEffect} from 'react'


import CSVReader from 'react-csv-reader'
import { Button } from 'theme-ui'
import {triggerToast, validEmails} from '../utils'



export const CSVUpload = () => {
    const [emails, setEmails] = useState([])
    const [uploaded, setUploaded] = useState(false)
    const [message, setMessage] = useState("")
    // TODO: NEEDS TO GET SCHOOL FROM THE CONTEXT AND AUTHED USER
    const school = "BROWN"

    useEffect(() => {
        if (message) triggerToast(message)
    }, [message])

    const sendEmails = () => {
        if (!uploaded) {
            setMessage("Please upload a CSV containing emails first.");
            return;
        } else if (!validEmails(emails)) {
            setMessage("Please make sure your emails are valid emails.")
            return;
        }
        // Ready to dispatch emails to API
        // POST request using fetch with error handling
        console.log(emails)
        fetch(`${process.env.REACT_APP_API_URL}/emails/${school}`, 
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emails: emails })
            })
            .then(res => {
                if (!res.ok) throw Error(res.statusText)
                else return res.json()
            })
            .then(res => setMessage(res.message))
            .catch(error => {
                console.error(error)
                setMessage(`Error: ${error.msg}`);
            });
    }

    return(
        <div className="csv-upload">
            <CSVReader onFileLoaded={(data, fileInfo) => {
                setUploaded(true)
                setEmails(data.flat())
            }
            } />
            <Button onClick={sendEmails}>Upload</Button>
        </div>
    )

}