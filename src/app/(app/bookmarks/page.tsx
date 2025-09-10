
'use client';

import React, { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDocs,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';

export default function BookmarksPage() {
  const [submissions, setSubmissions] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userProfile } = useAuth();

  useEffect(() => {
    if (!userProfile || !userProfile.bookmarks || userProfile.bookmarks.length === 0) {
      setSubmissions([]);
      setLoading(false);
      return;
    }

    const fetchBookmarkedSubmissions = async () => {
      setLoading(true);
      const submissionIds = userProfile.bookmarks ?? [];
      if (submissionIds.length === 0) {
        setSubmissions([]);
        setLoading(false);
        return;
      }
      
      const submissionsQuery = query(collection(db, 'submissions'), where('__name__', 'in', submissionIds));
      const querySnapshot = await getDocs(submissionsQuery);
      
      const docs: DocumentData[] = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });

      setSubmissions(docs);
      setLoading(false);
    };

    fetchBookmarkedSubmissions();

  }, [userProfile]);


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Bookmarks</CardTitle>
          <CardDescription>Your collection of saved items.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-[3/4] w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : submissions.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {submissions.map((item) => (
                <Dialog key={item.id}>
                  <DialogTrigger asChild>
                    <Card className="cursor-pointer transition-all hover:shadow-md">
                      {item.photoUrl ? (
                        <div className="relative aspect-[3/4] w-full">
                          <Image
                            src={item.photoUrl}
                            alt={item.title}
                            fill
                            objectFit="cover"
                            className="rounded-t-lg"
                          />
                        </div>
                      ) : (
                            <div className="flex h-full aspect-[3/4] items-center justify-center bg-secondary rounded-t-lg">
                                <p className="text-sm text-muted-foreground">No Image</p>
                            </div>
                      )}
                      <CardHeader className="p-4">
                        <CardTitle className="truncate text-lg">{item.title}</CardTitle>
                      </CardHeader>
                    </Card>
                  </DialogTrigger>
                   <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                      <DialogTitle>{item.title}</DialogTitle>
                      <DialogDescription>
                        {item.description}
                      </DialogDescription>
                    </DialogHeader>
                    {item.photoUrl && (
                      <div className="relative h-64 w-full">
                        <Image
                          src={item.photoUrl}
                          alt={item.title}
                          fill
                          objectFit="contain"
                          className="rounded-md"
                        />
                      </div>
                    )}
                    <DialogFooter className="gap-2 sm:justify-start">
                      <Button asChild>
                        <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">
                          Preview File
                        </a>
                      </Button>
                      <Button asChild variant="secondary">
                         <a href={`${item.fileUrl}/convert?force=true`} target="_blank" rel="noopener noreferrer">
                          Download File
                        </a>
                      </Button>
                      <DialogClose asChild>
                        <Button type="button" variant="ghost">Close</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
              <p className="text-muted-foreground">
                You haven't bookmarked any items yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
