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

const pledges = [
    {
        id: "PL-001",
        skill: "Solidity Developer",
        hours: 160,
        valuation: "$24,000",
        status: "Minted",
        date: "2026-01-01",
    },
    {
        id: "PL-002",
        skill: "Frontend Architecture",
        hours: 80,
        valuation: "$12,000",
        status: "Verifying",
        date: "2026-01-02",
    },
];

export function PledgeTable() {
    return (
        <Card className="shadow-lg border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-medium text-foreground">Active Pledges</CardTitle>
                <Button variant="outline" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-border/50">
                            <TableHead>Pledge ID</TableHead>
                            <TableHead>Skill</TableHead>
                            <TableHead>Hours</TableHead>
                            <TableHead>Valuation</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pledges.map((pledge) => (
                            <TableRow key={pledge.id} className="hover:bg-muted/50 border-border/50">
                                <TableCell className="font-medium text-primary">{pledge.id}</TableCell>
                                <TableCell>{pledge.skill}</TableCell>
                                <TableCell>{pledge.hours}h</TableCell>
                                <TableCell>{pledge.valuation}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="secondary"
                                        className={
                                            pledge.status === "Minted"
                                                ? "bg-green-500/10 text-green-500 border-green-500/20"
                                                : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                        }
                                    >
                                        {pledge.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="h-8">Details</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
