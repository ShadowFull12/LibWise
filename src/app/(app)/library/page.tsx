
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bookmark, Upload, Search } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useDebounce } from 'use-debounce';
import { Badge } from '@/components/ui/badge';

export default function LibraryPage() {
  const [submissions, setSubmissions] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    const q = query(
      collection(db, 'submissions'),
      where('status', '==', 'approved')
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs: DocumentData[] = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setSubmissions(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleBookmark = async (submissionId: string, isBookmarked: boolean) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    try {
      if (isBookmarked) {
        await updateDoc(userRef, {
          bookmarks: arrayRemove(submissionId),
        });
        toast({ title: 'Bookmark removed' });
      } else {
        await updateDoc(userRef, {
          bookmarks: arrayUnion(submissionId),
        });
        toast({ title: 'Bookmarked!' });
      }
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const filteredAndSortedSubmissions = useMemo(() => {
    return submissions
      .filter((item) => {
        const matchesSearch = item.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        switch (sortOrder) {
          case 'oldest':
            return a.createdAt?.toDate() - b.createdAt?.toDate();
          case 'title-asc':
            return a.title.localeCompare(b.title);
          case 'newest':
          default:
            return b.createdAt?.toDate() - a.createdAt?.toDate();
        }
      });
  }, [submissions, debouncedSearchTerm, filterCategory, sortOrder]);
  
  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
        case 'book':
            return 'default';
        case 'report':
            return 'secondary';
        case 'other':
            return 'outline';
        default:
            return 'destructive';
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <CardTitle>Library</CardTitle>
                <CardDescription>Browse the collection of available items.</CardDescription>
            </div>
            <Button asChild>
                <Link href="/upload">
                    <Upload className="mr-2 h-4 w-4" />
                    Contribute
                </Link>
            </Button>
        </CardHeader>
        <CardContent>
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="relative md:col-span-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search by title..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                 <div className="md:col-span-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="book">Books</SelectItem>
                            <SelectItem value="report">Reports</SelectItem>
                            <SelectItem value="other">Others</SelectItem>
                        </SelectContent>
                    </Select>
                     <Select value={sortOrder} onValueChange={setSortOrder}>
                        <SelectTrigger>
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                            <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
            </div>

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
          ) : filteredAndSortedSubmissions.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredAndSortedSubmissions.map((item) => {
                 const isBookmarked = userProfile?.bookmarks?.includes(item.id);
                 return(
                <Dialog key={item.id}>
                  <DialogTrigger asChild>
                    <Card className="cursor-pointer transition-all hover:shadow-md">
                      <div className="relative aspect-[3/4] w-full">
                         {item.photoUrl ? (
                            <Image
                                src={item.photoUrl}
                                alt={item.title}
                                fill
                                objectFit="cover"
                                className="rounded-t-lg"
                            />
                         ) : (
                            <div className="flex h-full items-center justify-center bg-secondary rounded-t-lg">
                                <p className="text-sm text-muted-foreground">No Image</p>
                            </div>
                         )}
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="truncate text-lg">{item.title}</CardTitle>
                         {item.category && (
                            <Badge 
                                variant={getCategoryBadgeVariant(item.category)} 
                                className="w-fit mt-1 capitalize"
                            >
                                {item.category}
                            </Badge>
                         )}
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
                        <a href={`${item.fileUrl}?dl=true`} target="_blank" rel="noopener noreferrer">
                          Download File
                        </a>
                      </Button>
                       <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleBookmark(item.id, !!isBookmarked)}
                        className="ml-auto"
                      >
                        <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-primary' : ''}`} />
                      </Button>
                      <DialogClose asChild>
                        <Button type="button" variant="ghost">Close</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )})}
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed">
                <p className="text-muted-foreground">
                    No library items found.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                    Try adjusting your search or filters.
                </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
