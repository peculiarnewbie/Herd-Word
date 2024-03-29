import { useState, useEffect, useRef, forwardRef, createRef, useImperativeHandle } from "react"
import Ably from 'ably'
import '../styles.css'

let answerChannel:Ably.Types.RealtimeChannelPromise;
let ably:Ably.Types.RealtimePromise;

export default function InputItems({round, roomId, isTesting, onCombine}:{round:number, roomId:string, isTesting:boolean, onCombine:any}){
    const [inputs, setInputs] = useState<any>([])
    const [combinedInputs, setCombinedInputs] = useState<any>([])

    const [combinedIds, setCombinedIds] = useState<any>([])

    const [inputRefs, setInputRefs] = useState<any>([])

    
    useEffect(() => {
        if(isTesting) return;
        const SubToAblyAnswers = async () => {
            ably = new Ably.Realtime.Promise('Hgkx7A.uh4-mw:xL8aBh7e8pmmR9RdXWJMsSaMuznBJDztdy6AWzJPyBw');
            await ably.connection.once('connected');
            console.log('Connected to Ably!');
            answerChannel = ably.channels.get(`herdword:${roomId}`)
            await answerChannel.subscribe(':answers', (message) => {
                console.log('Received an answer in realtime: ' + message.data)
                let messageObj = JSON.parse(message.data)
                messageObj['combined'] = false
                messageObj['highlighted'] = false
                messageObj['newId'] = messageObj.inputId
                //@ts-ignore
                setInputs(inputs => [...inputs, messageObj])
                // ReceiveRoomAction(message.data)
            });
    
            console.log('subbed to answers')
    
        }

        SubToAblyAnswers()

        return () => {
            answerChannel.detach();
            ably.close()
        }

    }, [])

    useEffect(() => {
        setInputs([])
    }, [round])

    useEffect(() => {
        let newRefs:any = []
        inputs.forEach(() => {
            newRefs = [...newRefs, createRef()]
        })
        setInputRefs(newRefs)
    }, [inputs])

    useEffect(() => {
        onCombine(combinedIds)
    }, [combinedIds])
    
    const triggerCombination = () => {
        // inputRef.current.Combine()
        // inputRefs.forEach((inputRef:any) => {
        //     inputRef.current?.Combine();
        // })
        let newId = 1000;
        let combinedInput:any = {inputs: [], highlighted: false, newId: 0};
        let combinedId:any = []
        inputs.forEach((input:any) => {
            if(input.highlighted){
                if(input.inputId < newId) newId = input.inputId
                handleInputChange(input.inputId, true, false)
                combinedInput.inputs.push(input)
                combinedId.push(input.inputId);
            } 
        });
        combinedInputs.forEach((combined:any) => {
            if(combined.highlighted){
                handleRemoveCombinedInput(combined.newId)
            }
        });
        if(combinedInput.inputs.length > 1){
            combinedInput.newId = newId;
            //@ts-ignore
            setCombinedInputs(combinedInputs => [...combinedInputs, combinedInput])
            //@ts-ignore
            setCombinedIds(combinedIds => [...combinedIds, combinedId])
        }
        else {
            if(combinedInput.inputs.length){
                handleInputChange(combinedInput.inputs[0].inputId, false, false)
            }
        }
        console.log('combined:', combinedInput, combinedInputs)
    }

    const [testId, setTestId] = useState(100);

    const addTestInput = () => {
        setTestId(testId + 1);
        let messageObj = {input: `test${testId}`, inputId: testId, combined: false, highlighted: false, newId: testId}
        //@ts-ignore
        setInputs(inputs => [...inputs, messageObj])
        console.log('inputs:', inputs)
    }

    const handleInputChange = (inputId:string, combined:boolean, highlighted:boolean) => {
        setInputs((prevState:any) =>
          prevState.map((childComponent:any) =>
              childComponent.inputId === inputId ? { ...childComponent, combined, highlighted } : childComponent
          )
        );
      };

    const handleCombinedInputChange = (newId:string, highlighted:boolean) => {
        //@ts-ignore
        combinedInputs.find(s => s.newId == newId).inputs.forEach((input:any) => {
            if(highlighted){
                handleInputChange(input.inputId, true, true);
            }
            else{
                handleInputChange(input.inputId, true, false);
            }
        })
        setCombinedInputs((prevState:any) =>
            prevState.map((childComponent:any) =>
                childComponent.newId === newId ? { ...childComponent, highlighted } : childComponent
            )
        );
    };

    const handleRemoveCombinedInput = (newId:string) => {
        setCombinedInputs((combinedInputs:any) => 
            combinedInputs.filter((combinedInput:any) => combinedInput.newId !== newId)
        )
        if(combinedInputs.length == 0) setCombinedInputs([])
        console.log(combinedInputs)
    }

    const InputItem = ({input, inputId, combined, highlighted, OnChange}: {input:string, inputId:string, combined:boolean, highlighted:boolean, OnChange:any}) => {

        const handleButtonClick = () => {
            OnChange(inputId, false, !highlighted);
        }
    
        return(
            combined ? null :
            <div>
                <button onClick={handleButtonClick} className={`Button${highlighted ? '--highlighted' : ''}`}>{input} {inputId}</button>
            </div>
        )
    
    }

    const CombinedInputItem = ({inputs, newId, highlighted, OnChange}: {inputs:any, newId:number, highlighted:boolean, OnChange:any}) => {
        
        const handleButtonClick = () => {
            OnChange(newId, !highlighted);
        }
    
        return(
            <button className={`Button--combined${highlighted ? '--highlighted' : ''}`}
                    onClick={handleButtonClick}>
            {
                inputs.map((items:any, index:number) => {
                    return(
                            <button key={index}>{items.input} {items.inputId}</button>
                    )
                })
            }
            </button>
        )
    
    }
    
    return(
        <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
            <div style={{display:'flex',  gap:'1rem'}}>
                {combinedInputs.map((items:any, index:number) => {
                    return(
                        <CombinedInputItem key={index} inputs={items.inputs} newId={items.newId} highlighted={items.highlighted} OnChange={handleCombinedInputChange}></CombinedInputItem>
                    )
                })}
                {inputs.map((items:any, index:number) => {
                    return (
                        <InputItem key={index} input={items.input} inputId={items.inputId} combined={items.combined} highlighted={items.highlighted}
                        OnChange={handleInputChange}
                        //@ts-ignore
                        ref={inputRefs[index]}></InputItem>
                        )
                    })}
            </div>

            <button onClick={triggerCombination} className="Button" >Combine</button>
            {
                isTesting ? (
                    <button onClick={addTestInput} className="Button" >Add Test</button>

                ) : null
            }
        </div>
    )
}

