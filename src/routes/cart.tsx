import { ClientOnly, createFileRoute } from '@tanstack/react-router'
import { Scanner } from '@yudiel/react-qr-scanner';
import z from 'zod';
import { useForm } from '@tanstack/react-form';
import { match } from 'ts-pattern';
import { useCallback } from 'react';
import { Minus, Plus, Trash } from 'lucide-react';
import type { IDetectedBarcode} from '@yudiel/react-qr-scanner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { Item, ItemActions, ItemContent, ItemDescription, ItemHeader } from '@/components/ui/item';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';

const SearchSchema = z.object({
  mode: z.enum(['checkout', 'return']).default('checkout'),
});

const checkoutFormSchema = z.object({
  items: z.array(z.object({
    id: z.string().nonempty(),
    quantity: z.number().int().min(1),
    dueDate: z.iso.date()
  })).nonempty(),
  userId: z.uuid(),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

const defaultCheckoutFormValues: CheckoutFormValues = {
  items: [],
  userId: '',
};

export const Route = createFileRoute('/cart')({
  component: RouteComponent,
  validateSearch: SearchSchema
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { mode } = Route.useSearch();

  const checkoutForm = useForm({
    validators: {
      onChange: checkoutFormSchema
    },
    defaultValues: defaultCheckoutFormValues
  });

  const handleBarcodeScanned = useCallback((barcodes: Array<IDetectedBarcode>) => {
    if (barcodes.length === 0) return;
    if (mode === 'checkout') {
      const newItems = barcodes.map(barcode => ({
        id: barcode.rawValue,
        quantity: 1,
        dueDate: '',
      }));

      checkoutForm.setFieldValue('items', (old) => [...old, ...newItems]);
    }
  }, []);

  return (
    <div className="grid grid-cols-2 grid-rows-1">
        <div className='my-4 ml-4 mr-2'>
          <ClientOnly>
            <Scanner 
              onScan={handleBarcodeScanned}
              classNames={{
                video: 'rounded-2xl'
              }}
              components={{
                onOff: true,
              }}
              sound={false}
              formats={['code_93']}
            />
          </ClientOnly>
        </div>
        <Tabs value={mode} onValueChange={v => navigate({
          search: (o) => ({ ...o, mode: v as 'checkout' | 'return' })
        })}>
          <div className='flex flex-row items-center justify-between border-b'>
            <h2 className='text-2xl font-bold my-4 ml-4'>
              {match(mode)
                .with('checkout', () => 'Checkout Items')
                .with('return', () => 'Return Items')
                .exhaustive()
              }
            </h2>
            
            <TabsList className="inline my-2 mr-4">
              <TabsTrigger value='checkout'>Checkout</TabsTrigger>
              <TabsTrigger value='return'>Return</TabsTrigger>
            </TabsList>
          </div>
          <ClientOnly>
            <TabsContent value='checkout' asChild>
              <form
                onSubmit={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  checkoutForm.handleSubmit(e);
                }}
              >
                <checkoutForm.Field name='items' mode='array'>
                  {(field) => {
                    return <ol className='flex flex-col gap-2 p-4'>
                      {field.state.value.length === 0 && (
                        <Empty>
                          <EmptyHeader>
                            <EmptyTitle>No items scanned</EmptyTitle>
                            <EmptyDescription>
                              Scan or enter an item to see it.
                            </EmptyDescription>
                          </EmptyHeader>
                          <EmptyContent>
                            <Field>
                              <Input placeholder='Enter Item ID...' />
                            </Field>
                          </EmptyContent>
                        </Empty>
                      )}
                      {field.state.value.length > 0 && <>
                        {field.state.value.map(item => (
                          <Item variant='outline' key={`item-${item.id}`} asChild>
                            <li>
                              <ItemContent>
                                <ItemHeader>Item Name</ItemHeader>
                                <ItemDescription>{item.id}</ItemDescription>
                              </ItemContent>
                              <ItemActions>

                                {/* Quantity Stepper */}
                                <Field>
                                  <FieldLabel>Quantity</FieldLabel>
                                  <InputGroup>
                                    <InputGroupAddon align='inline-start'>
                                      <InputGroupButton>
                                        <Minus />
                                      </InputGroupButton>
                                    </InputGroupAddon>
                                    <InputGroupInput type='number' min={1} />
                                    <InputGroupAddon align='inline-end'>
                                      <InputGroupButton>
                                        <Plus />
                                      </InputGroupButton>
                                    </InputGroupAddon>
                                  </InputGroup>
                                </Field>

                                {/* Date Picker */}
                                <Field>
                                  <FieldLabel>Due Date</FieldLabel>
                                  <DatePicker />
                                </Field>

                                <Button variant='destructive' size='icon'>
                                  <Trash />
                                </Button>
                              </ItemActions>
                            </li>
                          </Item>
                        ))}
                        <InputGroup>
                          <InputGroupInput placeholder='Enter Item Id...' />
                          <InputGroupAddon align='inline-end'>
                            <InputGroupButton>
                              <Plus />
                            </InputGroupButton>
                          </InputGroupAddon>
                        </InputGroup>
                      </>}
                    </ol>
                  }}
                </checkoutForm.Field>
              </form>
            </TabsContent>
          </ClientOnly>
          
          <ClientOnly>
            <TabsContent value='return'>
              Return
            </TabsContent>
          </ClientOnly>
        </Tabs>
    </div>
  )
}
