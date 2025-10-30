import { ClientOnly, createFileRoute } from '@tanstack/react-router'
import { Scanner } from '@yudiel/react-qr-scanner';
import z from 'zod';
import { useForm } from '@tanstack/react-form';
import { match } from 'ts-pattern';
import { useCallback } from 'react';
import { Minus, Plus, Trash } from 'lucide-react';
import type { IDetectedBarcode } from '@yudiel/react-qr-scanner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';

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
    console.log('scanned');
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
            sound={false}
            formats={['any']}
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
              <checkoutForm.Field name='items'>
                {(itemsField) => (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item Id</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {itemsField.state.value.map((item, index) => (
                        <TableRow key={`item-${item.id}`}>
                          <TableCell>
                            {item.id}
                          </TableCell>
                          <TableCell>
                            <checkoutForm.Field name={`items[${index}].quantity`}>
                              {(qtyField) => (
                                <InputGroup>
                                  <InputGroupAddon align='inline-start'>
                                    <InputGroupButton onClick={() => qtyField.setValue(x => x - 1)}>
                                      <Minus />
                                    </InputGroupButton>
                                  </InputGroupAddon>
                                  <InputGroupInput type='number' min={1} value={qtyField.state.value} onChange={e => qtyField.handleChange(e.target.valueAsNumber)} />
                                  <InputGroupAddon align='inline-end'>
                                    <InputGroupButton onClick={() => qtyField.setValue(x => x + 1)}>
                                      <Plus />
                                    </InputGroupButton>
                                  </InputGroupAddon>
                                </InputGroup>
                              )}
                            </checkoutForm.Field>
                          </TableCell>
                          <TableCell>
                            <DatePicker />
                          </TableCell>
                          <TableCell>
                            <Button variant='destructive' size='icon' onClick={() => itemsField.removeValue(index)}>
                              <Trash />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>

                        <TableCell>
                          <Input placeholder='New Item Id...' />
                        </TableCell>

                        <TableCell>
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
                        </TableCell>

                        <TableCell>
                          <DatePicker />
                        </TableCell>

                        <TableCell>
                          <Button>
                            <Plus />
                          </Button>
                        </TableCell>

                      </TableRow>
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={4}>{itemsField.state.value.length} Item{itemsField.state.value.length !== 1 ? 's' : ''}</TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                )}
              </checkoutForm.Field>

              <footer className='flex flex-row flex-nowrap items-center justify-between'>
                {/* User Selector */}

                {/* Check Out Button */}
                <Button className='flex-1'>
                  Check Out
                </Button>
              </footer>
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
