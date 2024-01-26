"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import Upload from "@/components/Upload";

const currencys = [
  { label: "ETH", value: "eth" },
  { label: "USDT", value: "usdt" },
  { label: "USDC", value: "usdc" },
  { label: "BNB", value: "bnb" },
] as const;

const accountFormSchema = z.object({
  limit: z.string(),
  royalty: z.string(),
  // limit: z.number().max(10000, {
  //   message: "Name must be at least 2 characters.",
  // }),
  // royalty: z.number().max(100, {
  //   message: "Name must be at least 2 characters.",
  // }),
  endTime: z.date({
    required_error: "A date of birth is required.",
  }),
  isCharge: z.boolean().optional(),
  currency: z.string({
    required_error: "Please select a currency.",
  }).optional(),
  price: z.number().max(10000, {
    message: "Name must be at least 2 characters.",
  }).optional(),
  receiptAddress: z.string().min(20).max(100, {
    message: "Name must be at least 2 characters.",
  }).optional(),
  isSupportWhiteList: z.boolean().optional(),
  whiteList: z.any().optional(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

type SettingProps = {
  next:(info:AccountFormValues)=>void, 
  defaultValue: Partial<AccountFormValues>|null,
  status: {
    buttonText: string,
    loading: boolean
  }
}

export default function AccountForm(props:SettingProps ) {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: props.defaultValue || {},
  });
  const [isCharge, isSupportWhiteList] = form.watch([
    "isCharge",
    "isSupportWhiteList",
  ]);

  function onSubmit(data: AccountFormValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    props.next(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="limit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mint Limit</FormLabel>
              <FormControl>
                <Input {...field} type="number"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="royalty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Royalty</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Time</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isCharge"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Charge for minting</FormLabel>
              <FormDescription>
                Charge for mintingCharge for mintingCharge for minting
              </FormDescription>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isCharge && (
          <>
            <div className="flex gap-8">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mint Price</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>currency</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-[200px] justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? currencys.find(
                                  (currency) => currency.value === field.value
                                )?.label
                              : "Select currency"}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search currency..." />
                          <CommandEmpty>No currency found.</CommandEmpty>
                          <CommandGroup>
                            {currencys.map((currency) => (
                              <CommandItem
                                value={currency.value}
                                key={currency.value}
                                onSelect={(value) => {
                                  form.setValue("currency", value);
                                }}
                              >
                                <CheckIcon
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    currency.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {currency.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="receiptAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Receipt Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isSupportWhiteList"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Support WhiteList</FormLabel>
                  <FormDescription>Only whitelist can mint</FormDescription>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isSupportWhiteList && (
              <FormField
                control={form.control}
                name="whiteList"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Upload
                        accept=".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload excel/csv whitelist file
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </>
        )}
        <Button type="submit">{props.status.buttonText}</Button>
      </form>
    </Form>
  );
}
