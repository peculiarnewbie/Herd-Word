import * as Form from '@radix-ui/react-form';

export default function FormButton({withButton, label} : {withButton:boolean, label:string}){
    if(withButton){
        return(
            <Form.Submit asChild>
                <button className="Button" style={{ marginTop: 10 }}>
                {label}
                </button>
            </Form.Submit>
        )
    }
    else{
        return null
    }
}