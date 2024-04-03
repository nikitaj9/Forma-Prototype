import { Forma } from "forma-embedded-view-sdk/auto";
import { Vec3 } from "forma-embedded-view-sdk/design-tool";
import { useState } from "react";

function CreateBuilding() {
  const [floorCount, setFloorCount] = useState(5);
  const [floorHeight, setFloorHeight] = useState(3);

  function createBuildingPolygon(
    points: Vec3[],
    floorCount: number,
    floorHeight: number
  ): { polygon: [number, number][]; height: number }[] {
    const jitterPolygon = (
      polygon: [number, number][],
      iteration: number
    ): [number, number][] => {
      return polygon.map(
        ([x, y]) =>
          [
            x + Math.random() * iteration * 0.1,
            y + Math.random() * iteration * 0.1,
          ] as [number, number]
      );
    };

    const inputPoly: [number, number][] = points.map(
      (point) => [point.x, point.y] as [number, number]
    );

    let buildingPolygons: { polygon: [number, number][]; height: number }[] =
      [];
    for (let i = 0; i < floorCount; i++) {
      buildingPolygons.push({
        polygon: jitterPolygon(inputPoly, i + 1),
        height: floorHeight,
      });
    }

    return buildingPolygons;
  }

  const createBuildingsFloors = async () => {
    const pos: Vec3[] = await Forma.designTool.getPolygon();

    const floorsData = await createBuildingPolygon(
      pos,
      floorCount,
      floorHeight
    );

    const urn = await Forma.elements.floorStack.createFromFloors({
      floors: floorsData,
    });
    console.log("Created building element:", urn);

    const elevation = pos[0].z;
    const transform = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, elevation, 1];
    await Forma.proposal.addElement({ ...urn, transform });
  };

  const analyzeSunlight = async () => {
    const currentlySelected = await Forma.selection.getSelection();
    console.log(currentlySelected);

    try {
      const analysisId = await Forma.analysis.triggerSun({
        selectedElementPaths: currentlySelected,
        month: 6,
        date: 21,
      });
      console.log("Sunlight analysis initiated, ID:", analysisId);
    } catch (error) {
      console.error("Error triggering sun analysis:", error);
    }
  };

  return (
    <div>
      <label>
        Floor Count:
        <input
          type="number"
          value={floorCount}
          onChange={(e) => setFloorCount(parseInt(e.target.value))}
        />
      </label>
      <br />
      <label>
        Floor Height:
        <input
          type="number"
          value={floorHeight}
          onChange={(e) => setFloorHeight(parseInt(e.target.value))}
        />
      </label>
      <br />
      <button onClick={createBuildingsFloors}>Create Building</button>
      <button onClick={analyzeSunlight}>Analyze Sunlight</button>
    </div>
  );
}

export default CreateBuilding;
