"use client"

import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis,
} from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

import { format, parseISO } from "date-fns"

interface Props {
    createdAtList: string[]
}

function getMonthlyAccountData(createdAtList: string[]) {
    const counts: Record<string, number> = {}

    for (const dateStr of createdAtList) {
        if (!dateStr) continue
        const date = parseISO(dateStr)
        const key = format(date, 'yyyy-MM') // e.g. 2024-07
        counts[key] = (counts[key] || 0) + 1
    }

    return Object.entries(counts)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, count]) => ({
            month: format(parseISO(month + '-01'), 'MMMM'),
            total: count,
        }))
}

export function AppAreaChart({ createdAtList }: Props) {
    const chartData = getMonthlyAccountData(createdAtList)

    return (
        <Card className='w-[60%]'>
            <CardHeader>
                <CardTitle>Biểu đồ tài khoản</CardTitle>
                <CardDescription>Số tài khoản tạo theo tháng</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={{ total: { label: 'Accounts', color: 'hsl(var(--green1))' } }}
                >
                    <AreaChart data={chartData} margin={{ right: 12 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey='month'
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis tickLine axisLine tickMargin={8} tickCount={5} />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator='dot' />}
                        />
                        <Area
                            dataKey='total'
                            type='natural'
                            fill='var(--green3)'
                            fillOpacity={0.4}
                            stroke='var(--green3)'
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}