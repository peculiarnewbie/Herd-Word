import './playArea.css'

export default function PromptArea({prompt} : {prompt: string | string[]}){
    console.log(prompt)

    return(
        <div className='PromptRoot'>

            <div className='PromptArea'>
                <div className='PromptElement'>
                    <p>prompt:</p>
                    <div className='PromptText'>
                        <p>{prompt}</p>

                    </div>
                </div>
            </div>
        </div>
    )
}