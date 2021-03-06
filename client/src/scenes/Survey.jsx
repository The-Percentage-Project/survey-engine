import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import {
    Label,
    Input,
    // Select,
    Textarea,
    Radio,
    Checkbox,
    // Slider,
    // Box,
    Divider,
    Button,
    Container,
    Text,
    Heading,
    Link
} from 'theme-ui'

import { schoolToQuestions, schoolsArray } from '../../../common/schema.js'
import { redirectoToThanksAction } from '../actions/survey.js';
import { submitSurvey, triggerToast } from '../utils'

// keyword for user input question in checkbox/radio
const specify_question_keywords = ['Please specify', 'Prefer to self-describe']; 

// an array of keywords of the identifiers in custom input form for checkbox/radio (such that we can remove it later )
const specify_keyword_arrays = [];

const MappedOptions = ({question, register, watch}) => question.options.map(option => {
    // choose check boc based on if we need user to specify
    const specify_keyword = specify_question_keywords.find(keyword => option.includes(keyword));
    if (specify_keyword) { 
        let identifier = question.id + ' ' + specify_keyword
        specify_keyword_arrays.push(identifier)
        return (
            <Label mb={2} key={option} >
                <Checkbox ref={register({required: question.required})} value={watch(identifier)} name={question.id} key={`${option}-box`} />
                {/* TODO-text - separate this out to its own style. Search TODO-text to find all */}
                <Text key={`${option}-text`} sx={{maxWidth: '90%'}}>{option}</Text>
                <Input variant="noBorder" name={identifier} ref={register} key={`${question.id}-${option}-custom-input`} />
            </Label>
        )
    } else {
        return (
            <Label mb={2} key={option} >
                <Checkbox key={`${option}-box`} ref={register({required: question.required})} value={option} name={question.id}/>
                {/* TODO-text - separate this out to its own style. Search TODO-text to find all */}
                <Text key={`${option}-text`} sx={{maxWidth: '90%'}}>{option}</Text>
            </Label>
        )
    }
}) 


const CustomRadio = ({question, register, watch, errors}) => {
    // get radio contents based on if we need custom input
    const radioContents = question.options.map(option => {
        const uniqueKey = question.id
        const specify_keyword = specify_question_keywords.find(keyword => option.includes(keyword));
        if (specify_keyword) {
            let identifier = question.id + ' ' + specify_keyword
            specify_keyword_arrays.push(identifier)
            return (
                <Label key={`${uniqueKey}-${option}-label`} mb={2}>
                    <Radio 
                        value={option} ref={register({required: question.required})} value={watch(identifier)} name={question.id}
                        key={`${uniqueKey}-${option}-radio`}
                    />
                    {/* TODO-text - separate this out to its own style. Search TODO-text to find all */}
                    <Text key={`${uniqueKey}-${option}-text`} sx={{maxWidth: '90%'}}>{option}</Text>
                    <Input variant="noBorder" name={identifier} ref={register} key={`${uniqueKey}-${option}-custom-input`} />
                </Label>
            )
        } else {
            return (
                <Label key={`${uniqueKey}-${option}-label`}mb={2}>
                    <Radio 
                        value={option} ref={register({required: question.required})} name={question.id}
                        key={`${uniqueKey}-${option}-radio`}
                    />
                    {/* TODO-text - separate this out to its own style. Search TODO-text to find all */}
                    <Text key={`${uniqueKey}-${option}-text`} sx={{maxWidth: '90%'}}>{option}</Text>
                </Label>
            )
        }
    })

    return (<>
        <Text key={`${question.id}-text`}
            sx={{
                fontSize: 4,
                fontWeight: 'bold',
                marginTop: '3rem',
                marginBottom: '0.5rem',
                lineHeight: '1.2',
            }}>
            {question.question}
        </Text>
        {radioContents}
        {errors[question.id] && question.required && <p>This field is required</p>}
    </>)
}

const CustomMultiCheckbox = ({ question, register, watch, errors}) => {
    return (
        <>  
            <Text
                key={`${question.id}-text`}
                sx={{
                    fontSize: 4,
                    fontWeight: 'bold',
                    marginTop: '3rem',
                    marginBottom: '0.5rem',
                    lineHeight: '1.2',
                }}>
                {question.question}
            </Text>
            <MappedOptions key={`${question.id}-options-parent`} question={question} register={register} watch={watch}/>
            {errors[question.id] && question.required && <p>This field is required</p>}
        </>)
}

const ContentWarning = ({question, register, errors, setContentAccept}) => {
    // get radio contents based on if we need custom input
    const radioContents = question.options.map(option => {
        const uniqueKey = question.id
        
        return (
            <Label key={`${uniqueKey}-${option}-label`}mb={2}>
                <Radio 
                    value={option} ref={register({required: question.required})} name={question.id}
                    key={`${uniqueKey}-${option}-radio`}
                    onChange={(e) => {
                        setContentAccept(e.target.value === 'Continue')
                    }
                    }
                />{option} 
            </Label>
        )
    })

    return (<>
        <Text key={`${question.id}-text`}
            sx={{
                fontSize: 4,
                fontWeight: 'bold',
                marginTop: '3rem',
                marginBottom: '0.5rem',
                lineHeight: '1.2',
            }}>
            {question.question}
        </Text>
        {radioContents}
        {errors[question.id] && question.required && <p>This field is required</p>}
    </>)
}

const TextBlock = ({question}) => {
    return (
        <>
            <Divider mt="30px"/>
            <Heading sx={{marginBottom: '0.5rem'}}>{question.heading}</Heading>
            <Text style={{ whiteSpace: 'pre-wrap' }}>{question.text}</Text>
        </>
    )
}

// TODO: find a better way to do this
const TextWithLink = ({question}) => {
    return (
        <>
            <Divider mt="30px"/>
            <Heading sx={{marginBottom: '0.5rem'}}>{question.heading}</Heading>
            <Text>
                {question.text1}
                <Link href={question.url}>{question.url}</Link>
                {question.text2}
            </Text>
        </>
    )
}

const questionToComponent = (question, register, watch, errors, contentAccept, setContentAccept) => {
    if (question.id === 'contentWarning') {
        return <ContentWarning question={question} register={register} watch={watch} errors={errors} key={`${question.id}-component`} setContentAccept={setContentAccept} />
    } else {
        if (question.component === "MultiCheckbox") {
            if (question.contentWarning) {
                return contentAccept ? <CustomMultiCheckbox question={question} register={register} watch={watch} errors={errors} key={`${question.id}-component`} /> : null
            }
            return <CustomMultiCheckbox question={question} register={register} watch={watch} errors={errors} key={`${question.id}-component`} />
        } else if (question.component === "Radio") {
            if (question.contentWarning) {
                return contentAccept ? <CustomRadio question={question}  register={register} watch={watch} errors={errors} key={`${question.id}-component`} /> : null
            }
            return <CustomRadio question={question}  register={register} watch={watch} errors={errors} key={`${question.id}-component`} />
        }  else if (question.component === "Text") {
            return <TextBlock question={question} />
        } else if (question.component === "TextWithLink") {
            return <TextWithLink question={question} />
        }
    }
  
    return (<></>)
}

export function Survey({school, token}) {
    const dispatch = useDispatch()

    const { register, handleSubmit, errors, watch } = useForm();

    const [message, setMessage] = useState("")
 
    const [contentAccept, setContentAccept] = useState(false)

    const shouldRedirect = useSelector(state => state.surveyRedirect)

    useEffect(() => {
        if (message !== "") {
            triggerToast(message)
            setMessage("")
        }
    }, [message])

    const onSubmit = (data) => {
        // remove the keywords for custom input form
        specify_keyword_arrays.forEach(name => {
            delete data[name]
        });

        // Submit data and trigger toast
        submitSurvey(school, token, data)
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    setMessage(res.error)
                } else if (res.message) {
                    dispatch(redirectoToThanksAction(true))
                }
            })
            .catch(err => setMessage(err.error))
    };
    

    if (shouldRedirect) {
        return <Redirect to='/thankYou' />
    }

    return (
        <>
            <Container
                as='form'
                onSubmit={handleSubmit(onSubmit)}
                sx={{width: '80%', height: '80%', top: '50%'}}
                className="survey">

                {school && schoolsArray.includes(school) && schoolToQuestions[school] ? 
                    schoolToQuestions[school].map(question => { 
                        return(questionToComponent(question, register, watch, errors, contentAccept, setContentAccept))})
                    : 
                    <>
                        School is unset.
                    </>
                
                }
                
                <Button mb='3rem' sx={{mt: '3rem'}}>Submit</Button>
                
            </Container>

        </>
    );
    // TODO styling wise line height styling of checkboxes (white space in front)
}