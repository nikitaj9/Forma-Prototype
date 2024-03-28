import { useState, useEffect } from "react";
import { Forma } from "forma-embedded-view-sdk/auto";

export interface Analysis {
  analysisId: string;
  analysisType: "sun" | "noise" | string;
  createdAt: number;
  proposalId: string;
  proposalRevision: string;
  status: string;
  updatedAt: number;
}

function SunAnalysis() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const projectId = Forma.getProjectId();

  useEffect(() => {
    async function fetchAnalyses() {
      try {
        const response = await Forma.analysis.list({ authcontext: projectId });
        console.log(response);

        setAnalyses(response as Analysis[]);
      } catch (error) {
        console.error("Error fetching analyses:", error);
      }
    }

    fetchAnalyses();
  }, [projectId]);

  return (
    <div>
      Welcome to {projectId}
      {analyses.map((analysis) => (
        <div key={analysis.analysisId}>
          <p>Type: {analysis.analysisType}</p>
          <p>Status: {analysis.status}</p>
        </div>
      ))}
    </div>
  );
}

export default SunAnalysis;
