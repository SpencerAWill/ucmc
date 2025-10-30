import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupInput } from '@/components/ui/input-group'

const SearchSchema = z.object({
  returnUrl: z.url().nonempty().nullish()
})

export const Route = createFileRoute('/login')({
  component: RouteComponent,
  validateSearch: SearchSchema
})

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { returnUrl } = Route.useSearch();

  const loginForm = useForm({
    validators: {
      onChange: z.object({
        email: z.email().nonempty()
      })
    },
    defaultValues: {
      email: ''
    },
    onSubmit: async ({ value }) => {
      
    }
  })
  
  return <form
    onSubmit={e => {
      e.preventDefault()
      e.stopPropagation()
      loginForm.handleSubmit(e)
    }}
    onReset={e => {
      e.preventDefault()
      e.stopPropagation()
      loginForm.reset()
    }}
    className='flex flex-col items-center justify-center gap-2 my-auto mx-4'
  >
    <h1>
      Log In Or Sign Up
    </h1>
    <loginForm.Field name='email'>
      {(field) => (
        <InputGroup className='max-w-md'>
          <InputGroupInput
            name={field.name}
            value={field.state.value}
            onChange={e => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            placeholder='Enter your email'
            type='email'
          />
        </InputGroup>
      )}
    </loginForm.Field>
    <Button
      type='submit'
    >
      Continue
    </Button>
  </form>
}
