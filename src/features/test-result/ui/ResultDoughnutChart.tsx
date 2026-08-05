import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const CHART_COLORS = ["#5571CF", "rgba(0, 29, 58, 0.18)", "rgba(2, 32, 71, 0.05)"];
const FALLBACK_COLOR = "rgba(0, 27, 55, 0.08)";

const TIE_BORDER_WIDTH = 1;

function hasTie(colorIndexes: number[]): boolean {
  return new Set(colorIndexes).size !== colorIndexes.length;
}

export function ResultDoughnutChart({
  items,
  colorIndexes,
}: {
  items: { label: string; percentage: number }[];
  colorIndexes?: number[];
}) {
  const resolvedColorIndexes = colorIndexes ?? items.map((_, i) => i);

  return (
    <div className="w-full flex justify-center">
      <div className="w-40 h-40">
        <Doughnut
          data={{
            datasets: [
              {
                data: items.map((o) => o.percentage),
                backgroundColor: items.map(
                  (_, i) => CHART_COLORS[resolvedColorIndexes[i]] ?? FALLBACK_COLOR,
                ),
                hoverOffset: 4,
                borderWidth: hasTie(resolvedColorIndexes) ? TIE_BORDER_WIDTH : 0,
                borderColor: "#fff",
                borderAlign: "inner",
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
