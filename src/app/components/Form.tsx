import React from 'react';
import * as Form from '@radix-ui/react-form';
import './styles.css';

const FormDemo = () => (
  <Form.Root className="FormRoot">
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
    </Form.Field>
    <Form.Submit asChild>
      <button className="Button" style={{ marginTop: 10 }}>
        Continue
      </button>
    </Form.Submit>
  </Form.Root>
);

export default FormDemo;