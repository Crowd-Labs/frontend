'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import Upload from '@/components/Upload';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

const accountFormSchema = z.object({
  name: z
    .string({ required_error: 'Collection name is required' })
    .min(2, {
      message: 'Collection name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Collection name must not be longer than 30 characters.',
    }),
  description: z.string().optional(),
  file: z.any().refine((file) => file?.size > 0, "please uplaod your collection logo")
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export default function AccountForm(props: { next: (info: AccountFormValues) => void, defaultValue: Partial<AccountFormValues> }) {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: props.defaultValue,
  });

  function onSubmit(data: AccountFormValues) {
    //console.log('onSubmit', data);
    // toast({
    //   title: 'You submitted the following values:',
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
    props.next(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name<span className='text-red-500'>*</span></FormLabel>
              <FormControl>
                <Input placeholder="Collection name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="description..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo Image<span className='text-red-500'>*</span></FormLabel>
              <FormControl>
                <Upload {...field} showTip/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-end'>
          <Button type="submit" variant="green">Continue</Button>
        </div>
      </form>
    </Form>
  );
}
