import * as Form from '@radix-ui/react-form';

export default function FormButton({withButton} : {withButton:boolean}){
    if(withButton){
        return(
            <Form.Submit asChild>
                <button className="Button" style={{ marginTop: 10 }}>
                Continue
                </button>
            </Form.Submit>
        )
    }
    else{
        return null
    }
}