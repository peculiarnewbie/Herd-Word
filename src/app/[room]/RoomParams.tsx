import { useState, forwardRef } from "react";
import * as Select from '@radix-ui/react-select';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import * as Slider from '@radix-ui/react-slider';
import './styles.css';

const gameTypes = {'0':'Default Herd',
                    '1': 'Custom Herd',
                    '2': 'Default SB Elimination',
                    '3': 'Default SB Treshold',
                    '4': 'Custom SB'}

const herdEndConditions = {'0':'Default',
                            '1': 'Target Score',
                            '2': 'Rounds Played'}
            

export default function RoomParams(){
    const [hotJoinable, setHotJoinable] = useState(true);
    const [gameType, setGameType] = useState('0');
    const [onlyHighest, setOnlyHighest] = useState(true);
    const [useOddOneOut, setUseOddOneOut] = useState(false);

    

    const [herdEnds, setHerdEnds] = useState('0');

    const HandleOnlyHighest = (event:any) => {
        setOnlyHighest(!onlyHighest)
    }

    const HandleUseOddOneOut = (event:any) => {
        setUseOddOneOut(!useOddOneOut)
    }

    const HandleHotJoinCheckBox = (event:any) => {
        setHotJoinable(!hotJoinable)
      }

    return(
        <>
            <GameTypeDropDown></GameTypeDropDown>
            
            <GameParams></GameParams>
            
            <HotJoinCheck></HotJoinCheck>
        </>
    )

    function HotJoinCheck(){
        return(
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox.Root className="CheckboxRoot" defaultChecked id="hotJoinable" checked={hotJoinable} onCheckedChange={HandleHotJoinCheckBox}>
                    <Checkbox.Indicator className="CheckboxIndicator">
                    <CheckIcon />
                    </Checkbox.Indicator>
                </Checkbox.Root>
                <label className="Label" htmlFor="c1">
                    Allow hot-joining
                </label>
            </div>
        )
    }

    function GameTypeDropDown(){
        return(
            <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                <label className="Label" htmlFor="gameType">
                    Game Type:
                </label>
            <Select.Root value={gameTypes['0']} onValueChange={setGameType}>
                <Select.Trigger aria-valuenow={parseInt(gameType)} id="gameType" className="SelectTrigger" aria-label="Type">
                <Select.Value placeholder="Select a game type">
                    {/* @ts-ignore */}
                    {gameTypes[gameType]}
                </Select.Value>
                <Select.Icon className="SelectIcon">
                    <ChevronDownIcon />
                </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                <Select.Content className="SelectContent">
                <Select.ScrollUpButton className="SelectScrollButton">
                    <ChevronUpIcon />
                </Select.ScrollUpButton>
                <Select.Viewport className="SelectViewport">
                <Select.Group>
                <Select.Label className="SelectLabel">Herd Mentality</Select.Label>
                <Select.Item className={'SelectItem'} value="0">
                    <Select.ItemText>Default</Select.ItemText>
                    <Select.ItemIndicator className="SelectItemIndicator">
                    <CheckIcon />
                    </Select.ItemIndicator>
                </Select.Item>
                <Select.Item className={'SelectItem'} value="1" >
                    <Select.ItemText>Custom</Select.ItemText>
                    <Select.ItemIndicator className="SelectItemIndicator">
                    <CheckIcon />
                    </Select.ItemIndicator>
                </Select.Item>
                </Select.Group>
                <Select.Separator className="SelectSeparator" />
                <Select.Group>
                <Select.Label className="SelectLabel">Same Brain</Select.Label>
                <Select.Item className={'SelectItem'} value="2" >
                    <Select.ItemText>Default Elimination</Select.ItemText>
                    <Select.ItemIndicator className="SelectItemIndicator">
                    <CheckIcon />
                    </Select.ItemIndicator>
                </Select.Item>
                <Select.Item className={'SelectItem'} value="3" >
                    <Select.ItemText>Default Treshold</Select.ItemText>
                    <Select.ItemIndicator className="SelectItemIndicator">
                    <CheckIcon />
                    </Select.ItemIndicator>
                </Select.Item>
                <Select.Item className={'SelectItem'} value="4" >
                    <Select.ItemText>Custom</Select.ItemText>
                    <Select.ItemIndicator className="SelectItemIndicator">
                    <CheckIcon />
                    </Select.ItemIndicator>
                </Select.Item>
                </Select.Group>
                </Select.Viewport>
                <Select.ScrollDownButton className="SelectScrollButton">
                    <ChevronDownIcon />
                </Select.ScrollDownButton>
                </Select.Content>
                </Select.Portal>
            </Select.Root>
            </div>
        )
    }

    function ValueSlider({id, defaultValue, min, max}: {id:string, defaultValue:number, min:number, max:number}){
        const [sliderValue, setSliderValue] = useState([defaultValue])
        return(
            <div style={{ display: 'flex', alignItems: 'center', justifyContent:'center', gap:"1rem", width: '100%'}}>
                <Slider.Root name={id} className="SliderRoot" defaultValue={sliderValue} min={min} max={max} step={1} onValueChange={setSliderValue}>
                <Slider.Track className="SliderTrack">
                    <Slider.Range className="SliderRange" />
                </Slider.Track>
                <Slider.Thumb  className="SliderThumb" aria-label="Volume" />
                </Slider.Root>
                <p>{sliderValue}</p>
            </div>
            )
    }
    
    
    function GameParams(){
        
        if(gameType == '0'){
            return(
                <div className="GameParams">
                    <p>Playing Herd Game with Default Parameters</p>
                    
                </div>
            )

        }
        else if(gameType == '1'){
            return(
                <>
                    <p>Choose Parameters</p>
                <div className="GameParams" id="GameParams">
                    <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <p>
                        End of game condition:
                    </p>
                    <Select.Root value={herdEndConditions['0']} onValueChange={setHerdEnds}>
                        <Select.Trigger aria-valuenow={parseInt(herdEnds)} id="herdEndCondition" className="SelectTrigger" aria-label="Type">
                        <Select.Value placeholder="Select a game type">
                            {/* @ts-ignore */}
                            {herdEndConditions[herdEnds]}
                        </Select.Value>
                        <Select.Icon className="SelectIcon">
                            <ChevronDownIcon />
                        </Select.Icon>
                        </Select.Trigger>
                        <Select.Portal>
                        <Select.Content className="SelectContent">
                        <Select.Viewport className="SelectViewport">
                        <Select.Item className={'SelectItem'} value="0">
                            <Select.ItemText>Default</Select.ItemText>
                            <Select.ItemIndicator className="SelectItemIndicator">
                            <CheckIcon />
                            </Select.ItemIndicator>
                        </Select.Item>
                        <Select.Item className={'SelectItem'} value="1">
                            <Select.ItemText>Target Score</Select.ItemText>
                            <Select.ItemIndicator className="SelectItemIndicator">
                            <CheckIcon />
                            </Select.ItemIndicator>
                        </Select.Item>
                        <Select.Item className={'SelectItem'} value="2" >
                            <Select.ItemText>Rounds Played</Select.ItemText>
                            <Select.ItemIndicator className="SelectItemIndicator">
                            <CheckIcon />
                            </Select.ItemIndicator>
                        </Select.Item>
                        </Select.Viewport>
                        </Select.Content>
                        </Select.Portal>
                    </Select.Root>
                    </div>

                    {
                        herdEnds == '1' && (
                            <ValueSlider id="herdScoreTarget" defaultValue={5} min={3} max={10}></ValueSlider>
                            )
                        }
                    {
                        herdEnds == '2' && (
                            <ValueSlider id="herdRoundTarget" defaultValue={15} min={5} max={30}></ValueSlider>
                        )
                    }
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox.Root className="CheckboxRoot" defaultChecked id="onlyHighest" checked={onlyHighest} onCheckedChange={HandleOnlyHighest}>
                    <Checkbox.Indicator className="CheckboxIndicator">
                        <CheckIcon />
                    </Checkbox.Indicator>
                    </Checkbox.Root>
                    <label className="Label" htmlFor="c1">
                        Count highest only
                    </label>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox.Root className="CheckboxRoot" id="useOddOneOut" checked={useOddOneOut} onCheckedChange={HandleUseOddOneOut}>
                    <Checkbox.Indicator className="CheckboxIndicator">
                        <CheckIcon />
                    </Checkbox.Indicator>
                    </Checkbox.Root>
                    <label className="Label" htmlFor="c1">
                        Use odd one out
                    </label>
                    </div>
                </div>
            </>
            )

        }
        else{
            return(
                <>

                </>
            )
        }
    }
}
