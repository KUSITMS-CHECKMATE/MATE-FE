import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const CHART_COLORS = ["#5571CF", "rgba(0, 29, 58, 0.18)", "rgba(2, 32, 71, 0.05)"];

export function ResultDoughnutChart({ items }: { items: { label: string; percentage: number }[] }) {
  return (
    <div className="w-full flex justify-center">
      <div className="w-40 h-40">
        <Doughnut
          data={{
            labels: items.map((o) => o.label),
            datasets: [
              {
                data: items.map((o) => o.percentage),
                backgroundColor: items.map((_, i) => CHART_COLORS[i] ?? "rgba(0, 27, 55, 0.08)"),
                hoverOffset: 4,
                borderWidth: 0,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            cutout: "50%",
            events: [],
          }}
        />
      </div>
    </div>
  );
}
