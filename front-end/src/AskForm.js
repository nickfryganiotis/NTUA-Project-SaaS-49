import React, { useState } from 'react'

export default function AskForm(){

    const [question, setQuestion] = useState({})

    const handleQuestionChange = (e) =>{
        const {value, name} = e.target
        setQuestion({...question, [name]:value})
    }

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    return(
        <div>
            <h2>Ask a Question</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Question Title:</label>
                    <input type="text" name="title" id="title" onChange={handleQuestionChange} required></input>
                </div>
                <div>
                    <label htmlFor="text">Question Text:</label>
                    <input type="textbox" name="text" id="text" onChange={handleQuestionChange} required></input>
                </div>
                <div>
                    <label htmlFor="keywords">Keywords:</label>
                    <input type="text" name="keywords" id="keywords" onChange={handleQuestionChange} required></input>
                </div>
                <div>
                    <button type="submit">Submit</button>
                    <button type="reset">Cancel</button>
                </div>
            </form>
        </div>
    )
}