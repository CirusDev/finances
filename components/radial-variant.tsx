import { RadialBar, Legend, RadialBarChart, ResponsiveContainer, Tooltip } from "recharts"

import { formatCurrency } from "@/lib/utils"
import { CategoryTooltip } from "./category-tooltip"

const COLORS = ['blue', 'lightblue', 'pink', 'orange']

type Props = {
  data: {
    name:  string
    value: number
  }[]
}

export const RadialVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width={"100%"} height={350}>
      <RadialBarChart
        cx={"50%"}
        cy={"30%"}
        barSize={10}
        innerRadius={'90%'}
        outerRadius={'40%'}
        data={data.map((item, idx) => ({
          ...item,
          value: item.value / 1000,
          fill: COLORS[idx % COLORS.length]
        }))}
      >
        <RadialBar 
          dataKey={"value"}
          background
          label={{
            position: 'insideStart',
            fill: 'white',
            fontSize: 12,
            offset: 6
          }}
        />

        <Legend 
          layout="horizontal"
          verticalAlign="bottom"
          align="right"
          iconType="circle"
          content={({ payload }: any) => {
            return (
              <ul className="flex flex-col space-y-2">
                {payload.map((entry: any, idx: number) => (
                  <li 
                    key={`item-${idx}`}
                    className="flex items-center space-x-2"
                  >
                    <span 
                      className="size-2 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />

                    <div className="space-x-1">
                      <span className="text-sm text-muted-foreground">
                        {entry.value}
                      </span>

                      <span className="text-sm">
                        {formatCurrency(entry.payload.value)}
                      </span>
                    </div>                                        
                  </li>
                ))}
              </ul>
            )
          }}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  )
}