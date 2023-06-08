"use client"
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";

export default function CustomCheckbox({checkState, setCheckState} : {checkState:boolean, setCheckState?:any}){

    function HandleChangeState(){
        if(setCheckState) setCheckState(!checkState)
        else checkState = !checkState
    }

    return(
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox.Root className="CheckboxRoot" defaultChecked id="hotJoinable" checked={checkState} onCheckedChange={HandleChangeState}>
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