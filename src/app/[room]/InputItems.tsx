import { useState, useEffect, useRef, forwardRef, createRef, useImperativeHandle } from "react"
import Ably from 'ably'

let answerChannel:Ably.Types.RealtimeChannelPromise;
let ably:Ably.Types.RealtimePromise;

export default function InputItems({round, roomId}:{round:number, roomId:string}){
    const [inputs, setInputs] = useState<any>([])

    const [inputRefs, setInputRefs] = useState<any>([])

    
    useEffect(() => {
        const SubToAblyAnswers = async () => {
            ably = new Ably.Realtime.Promise('Hgkx7A.uh4-mw:xL8aBh7e8pmmR9RdXWJMsSaMuznBJDztdy6AWzJPyBw');
            await ably.connection.once('connected');
            console.log('Connected to Ably!');
            answerChannel = ably.channels.get(`herdword:${roomId}`)
            await answerChannel.subscribe(':answers', (message) => {
                console.log('Received an answer in realtime: ' + message.data)
                let messageObj = JSON.parse(message.data)
                messageObj['combined'] = false
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
        console.log(inputRefs)
    }, [inputs])
    
    const triggerCombination = () => {
        // inputRef.current.Combine()
        inputRefs.forEach((inputRef:any) => {
            inputRef.current?.Combine();
        })
    }

    const handleChildComponentChange = (inputId:string, combined:boolean) => {
        setInputs((prevState:any) =>
          prevState.map((childComponent:any) =>
            childComponent.inputId === inputId ? { ...childComponent, combined } : childComponent
          )
        );
      };

    const InputItem = forwardRef(function InputItem({input, inputId, combined, OnChange}: {input:string, inputId:string, combined:boolean, OnChange:any}, ref) {
        const inputRef = useRef<any>()
        
        const [highlighted, setHighlighted] = useState(false)
        
        useImperativeHandle(ref, () => {
            return{
                Combine(){
                    OnChange(inputId, true)
                },
            }
        });
    
        return(
            <div ref={inputRef}>
                {
                    combined ? (
                        <></>
                    ) : (
                        <button className="Button">{input} {inputId}</button>
                    )
                }
    
            </div>
        )
    
    })
    
    return(
        <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
            <div style={{display:'flex',  gap:'1rem'}}>
                {inputs.map((items:any) => {
                    return (
                        <InputItem input={items.input} inputId={items.inputId} combined={items.combined}
                        OnChange={handleChildComponentChange}
                        //@ts-ignore
                        ref={inputRefs[items.inputId]}></InputItem>
                        )
                    })}
            </div>

            <button onClick={triggerCombination} className="Button" >Combine</button>
        </div>
    )
}

