import * as Form from '@radix-ui/react-form';
import FormButton from './FormButton';
import './styles.css';

export default function NameField({withButton, label, message} : {withButton:boolean, label:string, message:string}){
    
    return(
        <Form.Field className="FormField" name="name">
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Form.Label className="FormLabel">{label}</Form.Label>
            <Form.Message className="FormMessage" match="valueMissing">
                {message}
            </Form.Message>
            </div>
            <Form.Control asChild>
            <input className="Input" required />
            </Form.Control>
            <FormButton withButton={withButton} label="Continue"></FormButton>
        </Form.Field>
    )
}