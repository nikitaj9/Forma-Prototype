import { useState, useEffect } from "react";
import { Forma } from "forma-embedded-view-sdk/auto";

export interface Analysis {
  analysisId: string;
  analysisType: "sun" | "noise" | string;
  createdAt: number;
  proposalId: string;
  proposalRevision: string;
  status: "SUCCEEDED" | "FAILED" | string;
  updatedAt: number;
}

export interface AnalysisGroundGrid {
  grid: Float32Array | Uint8Array;
  mask?: Uint8Array;
  resolution: number;
  width: number;
  height: number;
  x0: number;
  y0: number;
}

function SunAnalysis() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [sunGroundGrid, setSunGroundGrid] = useState<AnalysisGroundGrid | null>(
    null
  );
  const projectId = Forma.getProjectId();
  console.log(sunGroundGrid);

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

  useEffect(() => {
    async function fetchSunAnalysisGroundGrid() {
      const sunAnalysis = await findLatestSuccessfulSunAnalysis(analyses);
      if (!sunAnalysis) return;
      const groundGrid = await Forma.analysis.getGroundGrid({
        analysis: sunAnalysis,
      });
      setSunGroundGrid(groundGrid as AnalysisGroundGrid);
    }

    fetchSunAnalysisGroundGrid();
  }, [analyses]);

  const findLatestSuccessfulSunAnalysis = async (analyses: any[]) => {
    const currentProposalId = await Forma.proposal.getId();
    return analyses
      .filter(
        ({ proposalId, status }) =>
          proposalId === currentProposalId && status === "SUCCEEDED"
      )
      .find(({ analysisType }) => analysisType === "sun");
  };

  return (
    <div>
      Welcome to {projectId}
      {analyses.map((analysis) => (
        <div key={analysis.analysisId}>
          <p>Type: {analysis.analysisType}</p>
          <p>Status: {analysis.status}</p>
        </div>
      ))}
      {sunGroundGrid && (
        <div>
          <h3>Sample Point Coordinates:{sunGroundGrid.height}</h3>
        </div>
      )}
    </div>
  );
}

export default SunAnalysis;
