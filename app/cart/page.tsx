import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import ItemScanner from "./item-scanner";
import { z } from "zod";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { Input } from "@/components/ui/input";

const CheckOutFormSubmitSchema = z.object({
    items: z.array(z.object({
        id: z.string(),
        quantity: z.number().int().min(1),
        dueDate: z.iso.date(),
    })).nonempty(),
    userId: z.uuid(),
});

const CheckOutFormChangeSchema = CheckOutFormSubmitSchema.extend({
    dueDate: z.iso.date(),
    search: z.string(),
});

const ReturnFormSubmitSchema = z.object({
    items: z.array(z.object({
        id: z.string(),
        quantity: z.number().int().min(1),
        notes: z.string()
    })).nonempty(),
});

const ReturnFormChangeSchema = ReturnFormSubmitSchema.extend({
    search: z.string(),
});

export default function CartPage() {
    const mode: string = 'return';

    return (
        <>
            <div className="grid grid-cols-2 grid-rows-1">
                <div>
                    <ItemScanner 
                        classNames={{
                            container: "p-4",
                            video: "rounded-2xl"
                        }}
                    />
                </div>
                <Tabs className="py-4 px-2">
                    <div className="grid grid-cols-[1fr_auto] grid-rows-1 gap-x-4">
                        <Input type="text" placeholder="Search items..." className="inline-block p-2 border rounded" />
                        <TabsList>
                            <TabsTrigger value="checkout">Check Out</TabsTrigger>
                            <TabsTrigger value="return">Return</TabsTrigger>
                        </TabsList>
                    </div>
                    
                    <TabsContent value="checkout">
                        <form>
                            Checkout
                        </form>
                    </TabsContent>
                    <TabsContent value="return">
                        <form>
                            Return
                        </form>
                    </TabsContent>
                    <TabsContent value="">
                        Empty
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}