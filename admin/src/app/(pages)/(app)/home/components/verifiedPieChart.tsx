"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"

import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card"
import {
   ChartConfig,
   ChartContainer,
   ChartTooltip,
   ChartTooltipContent,
} from "@/components/ui/chart"

interface Props {
   accountsList: { verified: boolean }[]
}

export function VerifiedStatusPieChart({ accountsList }: Props) {
   const verifiedCount = accountsList.filter((acc) => acc.verified).length
   const unverifiedCount = accountsList.length - verifiedCount

   const chartData = [
      {
         label: "Đã xác minh",
         value: verifiedCount,
         fill: "var(--blue2)",
      },
      {
         label: "Chưa xác minh",
         value: unverifiedCount,
         fill: "var(--green4)",
      },
   ]

   const chartConfig: ChartConfig = {
      value: {
         label: "Accounts",
      },
      verified: {
         label: "Đã xác minh",
         color: "var(--blue2)",
      },
      unverified: {
         label: "Chưa xác minh",
         color: "var(--green4)",
      },
   }

   return (
      <Card className="flex flex-col">
         <CardHeader className="items-center pb-0">
            <CardTitle>Xác minh tài khoản</CardTitle>
            <CardDescription>Phân bố tài khoản đã xác minh</CardDescription>
         </CardHeader>
         <CardContent className="flex-1 pb-0">
            <ChartContainer
               config={chartConfig}
               className="mx-auto aspect-square max-h-[250px]"
            >
               <PieChart>
                  <ChartTooltip
                     cursor={false}
                     content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                     data={chartData}
                     dataKey="value"
                     nameKey="label"
                     cx="50%"
                     cy="50%"
                     outerRadius={80}
                     isAnimationActive
                     labelLine={false}
                     label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                        const RADIAN = Math.PI / 180
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5
                        const x = cx + radius * Math.cos(-midAngle * RADIAN)
                        const y = cy + radius * Math.sin(-midAngle * RADIAN)

                        return (
                           <text
                              x={x}
                              y={y}
                              fill="white"
                              textAnchor="middle"
                              dominantBaseline="central"
                              fontSize="12"
                              fontWeight={600}
                           >
                              {(percent * 100).toFixed(0)}%
                           </text>
                        )
                     }}
                  />
               </PieChart>
            </ChartContainer>
         </CardContent>
         <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium">
               Đã có {verifiedCount} xác minh trong tháng này{" "}
               <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground leading-none">
               Tổng số tài khoản: {accountsList.length}
            </div>
         </CardFooter>
      </Card>
   )
}
