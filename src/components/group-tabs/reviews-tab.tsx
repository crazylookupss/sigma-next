"use client";

import { memo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import type { GroupTabProps } from "./types";

export const ReviewsTab = memo(function ReviewsTab({ accessReviews, isReviewsLoading }: GroupTabProps) {
  return (
    <Card>
      <CardHeader><h3 className="text-sm font-semibold text-foreground">Identity Access Reviews</h3></CardHeader>
      <CardContent>
        {isReviewsLoading ? (
          <div className="space-y-2"><Skeleton className="h-8 w-full" /></div>
        ) : accessReviews.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-8 font-medium">No governance access reviews configured.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground font-semibold">
                  <th className="py-2 pr-4">Review Definition</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Start Date</th>
                  <th className="py-2 pr-4">End Date</th>
                  <th className="py-2 pr-4">Reviewers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {accessReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-accent/20">
                    <td className="py-2.5 pr-4 font-semibold text-foreground">{review.displayName}</td>
                    <td className="py-2.5 pr-4">
                      <Badge variant={review.status === "InProgress" ? "secondary" : "outline"}>
                        {review.status}
                      </Badge>
                    </td>
                    <td className="py-2.5 pr-4 text-muted-foreground">{formatDate(review.startDate)}</td>
                    <td className="py-2.5 pr-4 text-muted-foreground">{formatDate(review.endDate)}</td>
                    <td className="py-2.5 pr-4">{review.reviewersCount} reviewer(s)</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
