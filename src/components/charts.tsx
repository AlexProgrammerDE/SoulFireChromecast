import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type CustomTooltipProps,
} from "@/components/ui/chart";
import type { CastMetricsSnapshot } from "@/lib/cast-protocol";

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes.toFixed(0)} B/s`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB/s`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB/s`;
}

const PIE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const botsOnlineConfig = {
  online: { label: "Online", color: "var(--chart-1)" },
  total: { label: "Total", color: "var(--chart-3)" },
} satisfies ChartConfig;

export function TvBotsOnlineChart({
  snapshots,
}: {
  snapshots: CastMetricsSnapshot[];
}) {
  const chartData = snapshots.map((s) => ({
    time: formatTime(s.timestamp),
    online: s.botsOnline,
    total: s.botsTotal,
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Bots Online</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={botsOnlineConfig} className="h-full w-full">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={{ fontSize: 14 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 14 }} />
            <ChartTooltip
              content={(props: CustomTooltipProps) => (
                <ChartTooltipContent {...props} />
              )}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="var(--color-total)"
              fill="var(--color-total)"
              fillOpacity={0.1}
              strokeWidth={1}
              strokeDasharray="4 2"
            />
            <Area
              type="monotone"
              dataKey="online"
              stroke="var(--color-online)"
              fill="var(--color-online)"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const networkConfig = {
  sent: { label: "Sent/s", color: "var(--chart-1)" },
  received: { label: "Recv/s", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function TvNetworkTrafficChart({
  snapshots,
}: {
  snapshots: CastMetricsSnapshot[];
}) {
  const chartData = snapshots.map((s) => ({
    time: formatTime(s.timestamp),
    sent: Math.round(s.packetsSentPerSecond),
    received: Math.round(s.packetsReceivedPerSecond),
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Packets / Second</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={networkConfig} className="h-full w-full">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={{ fontSize: 14 }} />
            <YAxis tick={{ fontSize: 14 }} />
            <ChartTooltip
              content={(props: CustomTooltipProps) => (
                <ChartTooltipContent {...props} />
              )}
            />
            <Line
              type="monotone"
              dataKey="sent"
              stroke="var(--color-sent)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="received"
              stroke="var(--color-received)"
              strokeWidth={2}
              dot={false}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const bandwidthConfig = {
  upload: { label: "Upload", color: "var(--chart-1)" },
  download: { label: "Download", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function TvBandwidthChart({
  snapshots,
}: {
  snapshots: CastMetricsSnapshot[];
}) {
  const chartData = snapshots.map((s) => ({
    time: formatTime(s.timestamp),
    upload: s.bytesSentPerSecond,
    download: s.bytesReceivedPerSecond,
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Bandwidth</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={bandwidthConfig} className="h-full w-full">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={{ fontSize: 14 }} />
            <YAxis
              tick={{ fontSize: 14 }}
              tickFormatter={(v: number) => formatBytes(v).replace("/s", "")}
            />
            <ChartTooltip
              content={(props: CustomTooltipProps) => (
                <ChartTooltipContent
                  {...props}
                  formatter={(value, name, item) => (
                    <>
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="flex flex-1 items-center justify-between leading-none">
                        <span className="text-muted-foreground">
                          {bandwidthConfig[name as keyof typeof bandwidthConfig]
                            ?.label ?? name}
                        </span>
                        <span className="text-foreground font-mono font-medium tabular-nums">
                          {formatBytes(typeof value === "number" ? value : 0)}
                        </span>
                      </div>
                    </>
                  )}
                />
              )}
            />
            <Area
              type="monotone"
              dataKey="upload"
              stroke="var(--color-upload)"
              fill="var(--color-upload)"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="download"
              stroke="var(--color-download)"
              fill="var(--color-download)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const healthFoodConfig = {
  health: { label: "Avg Health", color: "var(--chart-1)" },
  food: { label: "Avg Food", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function TvHealthFoodChart({
  snapshots,
}: {
  snapshots: CastMetricsSnapshot[];
}) {
  const chartData = snapshots.map((s) => ({
    time: formatTime(s.timestamp),
    health: Number(s.avgHealth.toFixed(1)),
    food: Number(s.avgFoodLevel.toFixed(1)),
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Health / Food</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={healthFoodConfig} className="h-full w-full">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={{ fontSize: 14 }} />
            <YAxis domain={[0, 20]} tick={{ fontSize: 14 }} />
            <ChartTooltip
              content={(props: CustomTooltipProps) => (
                <ChartTooltipContent {...props} />
              )}
            />
            <Line
              type="monotone"
              dataKey="health"
              stroke="var(--color-health)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="food"
              stroke="var(--color-food)"
              strokeWidth={2}
              dot={false}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const dimensionPieConfig = {
  bots: { label: "Bots" },
} satisfies ChartConfig;

export function TvDimensionPieChart({
  dimensionCounts,
}: {
  dimensionCounts: Record<string, number>;
}) {
  const entries = Object.entries(dimensionCounts);
  const chartData =
    entries.length === 0
      ? []
      : entries.map(([dim, count], i) => ({
          dimension: dim.replace("minecraft:", ""),
          bots: count,
          fill: PIE_COLORS[i % PIE_COLORS.length],
        }));

  if (chartData.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Dimensions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center text-base">No data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Dimensions</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer
          config={dimensionPieConfig}
          className="mx-auto aspect-square h-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={(props: CustomTooltipProps) => (
                <ChartTooltipContent {...props} nameKey="dimension" />
              )}
            />
            <Pie
              data={chartData}
              dataKey="bots"
              nameKey="dimension"
              innerRadius={40}
              strokeWidth={3}
            >
              {chartData.map((entry) => (
                <Cell key={entry.dimension} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const positionConfig = {
  position: { label: "Bot", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function TvPositionScatterChart({
  positions,
}: {
  positions: { x: number; z: number; dimension: string }[];
}) {
  const chartData = positions.map((p) => ({
    x: Math.round(p.x),
    z: Math.round(p.z),
    dimension: p.dimension.replace("minecraft:", ""),
  }));

  if (chartData.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Bot Positions (XZ)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center text-base">No data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Bot Positions (XZ)</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={positionConfig} className="h-full w-full">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" name="X" type="number" tick={{ fontSize: 14 }} />
            <YAxis dataKey="z" name="Z" type="number" tick={{ fontSize: 14 }} />
            <ChartTooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={(props: CustomTooltipProps) => (
                <ChartTooltipContent {...props} />
              )}
            />
            <Scatter
              data={chartData}
              fill="var(--color-position)"
              shape="circle"
            />
          </ScatterChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
