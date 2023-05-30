import * as Form from '@radix-ui/react-form';
import FormButton from './FormButton';
import './styles.css';

export default function NameField({withButton} : {withButton:boolean}){
    let button
    
    return(
        <Form.Field className="FormField" name="name">
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Form.Label className="FormLabel">Name</Form.Label>
            <Form.Message className="FormMessage" match="valueMissing">
                Please enter your name
            </Form.Message>
            </div>
            <Form.Control asChild>
            <input className="Input" required />
            </Form.Control>
            <FormButton withButton={withButton}></FormButton>
        </Form.Field>
    )
}