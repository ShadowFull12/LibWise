
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import {
  collection,
  query,
  where,
  onSnapshot,
  DocumentData,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from 'next/image';
import { Eye, Check, Trash2 } from 'lucide-react';

async function deleteSubmission(submissionId: string) {
    try {
        await deleteDoc(doc(db, 'submissions', submissionId));
    } catch (error: any) {
        console.error('Error deleting submission:', error.message);
        throw new Error('Failed to delete submission record.');
    }
}

export default function AdminPage() {
  const { userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && userProfile?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [userProfile, authLoading, router]);

  useEffect(() => {
    if (userProfile?.role === 'admin') {
      const q = query(collection(db, 'submissions'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const docs: DocumentData[] = [];
        querySnapshot.forEach((doc) => {
          docs.push({ id: doc.id, ...doc.data() });
        });
        setSubmissions(docs);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [userProfile]);
  
  const handleApprove = async (id: string) => {
    try {
        const submissionRef = doc(db, 'submissions', id);
        await updateDoc(submissionRef, {
            status: 'approved',
        });
        toast({
            title: 'Submission Approved',
            description: 'The submission is now public.',
        });
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Approval Failed',
            description: error.message || 'An unexpected error occurred.',
        });
    }
  }

  const handleDelete = async (id: string) => {
    try {
        await deleteSubmission(id);
        toast({
            title: 'Submission Deleted',
            description: 'The submission has been permanently removed.',
        });
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Deletion Failed',
            description: error.message || 'An unexpected error occurred.',
        });
    }
  }

  if (authLoading || loading || userProfile?.role !== 'admin') {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
          <CardDescription>Review and manage all submissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Submitted By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {submissions.length > 0 ? (
                    submissions.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>{item.userEmail}</TableCell>
                        <TableCell>
                        <Badge 
                            variant={item.status === 'pending' ? 'default' : item.status === 'approved' ? 'secondary' : 'destructive'}
                            className={
                                item.status === 'pending' ? 'bg-yellow-500 text-white' : 
                                item.status === 'approved' ? 'bg-green-600 text-white' : ''
                            }
                        >
                            {item.status}
                        </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                            <Dialog>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DialogTrigger asChild>
                                            <Button size="icon" variant="ghost"><Eye className="h-4 w-4" /></Button>
                                        </DialogTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>View Details</p>
                                    </TooltipContent>
                                </Tooltip>
                                <DialogContent className="sm:max-w-[480px]">
                                    <DialogHeader>
                                        <DialogTitle>{item.title}</DialogTitle>
                                        <DialogDescription>
                                            Submitted by {item.userEmail}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        {item.photoUrl ? (
                                            <div className="relative h-48 w-full">
                                                <Image 
                                                    src={item.photoUrl} 
                                                    alt={item.title}
                                                    fill
                                                    objectFit="contain"
                                                    className="rounded-md"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex h-48 w-full items-center justify-center bg-secondary rounded-md">
                                                <p className="text-sm text-muted-foreground">No Image Provided</p>
                                            </div>
                                        )}
                                        <p className="text-sm text-muted-foreground">
                                            {item.description}
                                        </p>
                                    </div>
                                    <DialogFooter className="gap-2 sm:justify-start">
                                        <Button asChild>
                                            <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">Preview File</a>
                                        </Button>
                                        <Button asChild variant="secondary">
                                            <a href={`${item.fileUrl}/convert?force=true`} target="_blank" rel="noopener noreferrer">Download File</a>
                                        </Button>
                                        <DialogClose asChild>
                                            <Button type="button" variant="outline">Close</Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            {item.status === 'pending' && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button size="icon" variant="ghost" onClick={() => handleApprove(item.id)}><Check className="h-4 w-4" /></Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Approve</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                            
                            <AlertDialog>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <AlertDialogTrigger asChild>
                                             <Button size="icon" variant="ghost"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                        </AlertDialogTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Delete</p>
                                    </TooltipContent>
                                </Tooltip>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the submission and remove the file from storage.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(item.id)}>
                                        Continue
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        No submissions found.
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  );
}
