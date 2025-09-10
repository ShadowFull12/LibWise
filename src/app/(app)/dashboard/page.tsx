
'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  collection,
  query,
  where,
  onSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BookOpen, ArrowRight, Upload } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const [submissionCount, setSubmissionCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'submissions'),
      where('status', '==', 'approved')
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setSubmissionCount(querySnapshot.size);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>Welcome to your Libwise dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-1">
                 <Card className="md:col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium">
                        Total Books
                        </CardTitle>
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <Skeleton className="h-12 w-1/3" />
                        ) : (
                            <div className="text-5xl font-bold">{submissionCount}</div>
                        )}
                        <p className="text-sm text-muted-foreground mt-2">
                        Available in the library
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Explore the Collection</CardTitle>
                        <CardDescription>Dive into the books and reports available.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                           <Link href="/library">
                                Browse the library
                                <ArrowRight className="ml-2 h-4 w-4" />
                           </Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Share Your Knowledge</CardTitle>
                        <CardDescription>Contribute your own materials to the library.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Button asChild variant="secondary">
                           <Link href="/upload">
                                Want to contribute?
                                <Upload className="ml-2 h-4 w-4" />
                           </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
