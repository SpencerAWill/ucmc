import { useForm } from '@tanstack/react-form'
import { ClientOnly, createFileRoute } from '@tanstack/react-router'
import z from 'zod'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group'

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

function RouteComponent() {
  const registerForm = useForm({
    validators: {
      onChange: z.object({
        firstName: z.string().nonempty().max(32),
        lastName: z.string().nonempty().max(32),
        nickname: z.string().nonempty().max(16),
        email: z.email().nonempty(),
        mNumber: z.string().regex(/^\d{8}$/, 'Must be 8 digits').or(z.literal(''))
      })
    },
    defaultValues: {
      firstName: '',
      lastName: '',
      nickname: '',
      email: '', // TODO: Get from external state
      mNumber: ''
    }
  })
  
  return <ClientOnly>
    <form
      onSubmit={e => {
        e.preventDefault()
        e.stopPropagation()
        registerForm.handleSubmit(e)
      }}
      className='flex-auto flex flex-col justify-center-safe items-stretch mx-4 gap-4'
    >
      <h1>
        Create Your Profile
      </h1>

      <registerForm.Field name='firstName'>
        {(field) => (
          <Field>
            <FieldLabel htmlFor={field.name}>
              First Name
            </FieldLabel>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onChange={e => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              type='text'
              autoComplete='given-name'
            />
          </Field>
        )}
      </registerForm.Field>

      <registerForm.Field name='lastName'>
        {(field) => (
          <Field>
            <FieldLabel htmlFor={field.name}>
              Last Name
            </FieldLabel>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onChange={e => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              type='text'
              autoComplete='family-name'
            />
          </Field>
        )}
      </registerForm.Field>

      <registerForm.Field name='nickname'>
        {(field) => (
          <Field>
            <FieldLabel htmlFor={field.name}>
              Nickname
            </FieldLabel>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onChange={e => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              type='text'
              autoComplete='nickname'
            />
          </Field>
        )}
      </registerForm.Field>

      <registerForm.Field name='email'>
        {(field) => (
          <Field>
            <FieldLabel htmlFor={field.name}>
              Email
            </FieldLabel>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              type='email'
              disabled
            />
          </Field>
        )}
      </registerForm.Field>

      <registerForm.Field name='mNumber'>
        {(field) => (
          <Field>
            <FieldLabel htmlFor={field.name}>
              M Number
            </FieldLabel>
            <InputGroup>
              <InputGroupAddon align='inline-start'>
                <InputGroupText>M</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput 
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                type='text'
              />
            </InputGroup>
          </Field>
        )}
      </registerForm.Field>
      
      <Button
        type='submit'
      >
        Continue
      </Button>
    </form>
  </ClientOnly> 
}
