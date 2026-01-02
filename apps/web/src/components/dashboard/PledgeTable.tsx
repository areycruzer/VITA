"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVitaData } from "@/hooks/useVitaData";

export function PledgeTable() {
    const { balance, profile } = useVitaData();

    // If no tokens minted, show empty state
    const hasPledges = balance > 0;

    return (
        <Card className="shadow-lg border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-medium text-foreground">Active Pledges</CardTitle>
                <Button variant="outline" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
                {!hasPledges ? (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <p>No pledges yet.</p>
                        <p className="text-sm">Pledge your productivity to mint $VITA tokens.</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-border/50">
                                <TableHead>Profile</TableHead>
                                <TableHead>Total Minted</TableHead>
                                <TableHead>Vitality Score</TableHead>
                                <TableHead>Verified</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className="hover:bg-muted/50 border-border/50">
                                <TableCell className="font-medium text-primary">
                                    @{profile?.githubUsername || "worker"}
                                </TableCell>
                                <TableCell>
                                    ${balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                </TableCell>
                                <TableCell>
                                    {profile?.vitalityScore ? Number(profile.vitalityScore) : 0}
                                </TableCell>
                                <TableCell>
                                    {profile?.isVerified ? "✓" : "-"}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="secondary"
                                        className="bg-green-500/10 text-green-500 border-green-500/20"
                                    >
                                        Minted
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="h-8">Details</Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}


