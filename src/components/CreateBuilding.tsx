import { Forma } from "forma-embedded-view-sdk/auto";
import { Vec3 } from "forma-embedded-view-sdk/design-tool";

function CreateBuilding() {
  function cereateBuildingPolygon(points: Vec3[]) {
    console.log("points", points);
    const demo = (polygon: [number, number][]) => {
      return polygon.map(
        ([x, y]) =>
          [x + Math.random() * 2, y + Math.random() * 2] as [number, number]
      );
    };
    const inputpoly: [number, number][] = points.map(
      (point) => [point.x, point.y] as [number, number]
    );

    console.log("inputpoly", inputpoly);

    return Array(5).fill(inputpoly).map(demo);
  }

  const creatBuildingsFloors = async (): Promise<void> => {
    const pos: Vec3[] = await Forma.designTool.getPolygon();

    const buildingPloygons = cereateBuildingPolygon(pos);

    console.log(buildingPloygons);

    const urn: { urn: string } =
      await Forma.elements.floorStack.createFromFloors({
        floors: buildingPloygons.map(
          (
            buildingPloygon
          ): {
            polygon: [number, number][];
            height: number;
          } => {
            console.log("buildingPloygons", buildingPloygons);

            return {
              polygon: buildingPloygon,
              height: 3,
            };
          }
        ),
      });
    console.log("element", urn);
    const elevation = pos[0].z;
    const transform = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, elevation, 1];
    await Forma.proposal.addElement({ ...urn, transform });
  };
  return (
    <div>
      <button onClick={creatBuildingsFloors}>Click Here</button>
    </div>
  );
}

export default CreateBuilding;
