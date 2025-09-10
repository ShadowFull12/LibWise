
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud, FileUp, ImageUp } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { PickerOverlay } from 'filestack-react';
import { NEXT_PUBLIC_FILESTACK_API_KEY } from '@/lib/firebase-client-config';
import Image from 'next/image';

const uploadSchema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
  description: z.string().optional(),
  category: z.enum(['book', 'report', 'other'], {
    required_error: 'You need to select a category.',
  }),
  photoUrl: z.string().optional(),
  fileUrl: z.string().min(1, { message: 'A file must be uploaded.' }),
});

export default function UploadPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  const [isPhotoPickerVisible, setIsPhotoPickerVisible] = useState(false);
  const [isFilePickerVisible, setIsFilePickerVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof uploadSchema>>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: '',
      description: '',
      photoUrl: '',
      fileUrl: '',
    },
  });

  const photoUrlValue = form.watch('photoUrl');
  const fileUrlValue = form.watch('fileUrl');

  async function onSubmit(values: z.infer<typeof uploadSchema>) {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to upload files.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'submissions'), {
        title: values.title,
        description: values.description,
        category: values.category,
        photoUrl: values.photoUrl,
        fileUrl: values.fileUrl,
        userId: user.uid,
        userEmail: user.email,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      toast({
        title: 'Submission Received',
        description: 'Your file has been submitted for review.',
      });
      form.reset();
      router.push('/my-submissions');
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {isPhotoPickerVisible && (
        <PickerOverlay
          apikey={NEXT_PUBLIC_FILESTACK_API_KEY}
          pickerOptions={{
            accept: 'image/*',
            maxFiles: 1,
            onClose: () => setIsPhotoPickerVisible(false),
            onUploadDone: (res) => {
              const url = res.filesUploaded[0]?.url;
              if (url) {
                form.setValue('photoUrl', url);
              }
              setIsPhotoPickerVisible(false);
            },
          }}
        />
      )}

      {isFilePickerVisible && (
        <PickerOverlay
          apikey={NEXT_PUBLIC_FILESTACK_API_KEY}
          pickerOptions={{
            accept: ['.pdf', '.doc', '.docx', '.epub'],
            maxFiles: 1,
            onClose: () => setIsFilePickerVisible(false),
            onUploadDone: (res) => {
              const url = res.filesUploaded[0]?.url;
              if (url) {
                form.setValue('fileUrl', url, { shouldValidate: true });
              }
              setIsFilePickerVisible(false);
            },
          }}
        />
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Upload New Material</CardTitle>
          <CardDescription>
            Submit your book or report for review. Approved materials will be
            made public.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'The History of Time'" {...field} />
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
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A brief summary of the content."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="book">Book</SelectItem>
                        <SelectItem value="report">Report</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Front Page Photo (Optional)</FormLabel>
                <div className="flex items-center gap-4">
                  <Button type="button" variant="outline" onClick={() => setIsPhotoPickerVisible(true)}>
                    <ImageUp className="mr-2 h-4 w-4" />
                    {photoUrlValue ? 'Change Photo' : 'Upload Photo'}
                  </Button>
                  {photoUrlValue && (
                    <div className="relative h-20 w-20">
                      <Image src={photoUrlValue} alt="Front page preview" layout="fill" objectFit="contain" className="rounded-md" />
                    </div>
                  )}
                </div>
                 <FormMessage>{form.formState.errors.photoUrl?.message}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Book/Report File</FormLabel>
                 <div className="flex items-center gap-4">
                    <Button type="button" variant="outline" onClick={() => setIsFilePickerVisible(true)}>
                      <FileUp className="mr-2 h-4 w-4" />
                      {fileUrlValue ? 'Change File' : 'Upload File'}
                    </Button>
                    {fileUrlValue && <p className="text-sm text-muted-foreground truncate max-w-xs">File ready for upload.</p>}
                 </div>
                <FormMessage>{form.formState.errors.fileUrl?.message}</FormMessage>
              </FormItem>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UploadCloud className="mr-2 h-4 w-4" />
                )}
                Submit for Review
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
