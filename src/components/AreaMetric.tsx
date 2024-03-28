import { useState, useEffect } from "react";
import { Forma } from "forma-embedded-view-sdk/auto";

type MetricWithValue = {};

type MetricWithFunctionBreakdown = {};

type AreaMetrics = {
  builtInMetrics: {
    buildingCoverage: MetricWithValue;
    grossFloorArea: MetricWithFunctionBreakdown;
    siteArea: MetricWithValue;
  };
  customMetrics: MetricWithFunctionBreakdown[];
  parkingStatistics: {
    area: number;
    spots: number;
  };
  unitStatistics: {
    count: MetricWithValue;
  };
};

function AreaMetric() {
  const [areaMetrics, setAreaMetrics] = useState<AreaMetrics | null>(null);

  useEffect(() => {
    async function fetchAreaMetrics() {
      try {
        const currentlySelected = await Forma.selection.getSelection();
        console.log("currentlySelected", currentlySelected);

        const metrics = await Forma.areaMetrics.calculate({
          paths: currentlySelected,
        });
        setAreaMetrics(metrics);
      } catch (error) {
        console.error("Error fetching area metrics:", error);
      }
    }

    fetchAreaMetrics();
  }, []);

  return (
    <div>
      {areaMetrics ? (
        <div>Area Metrics: {JSON.stringify(areaMetrics)}</div>
      ) : (
        <div>Loading area metrics...</div>
      )}
    </div>
  );
}

export default AreaMetric;
