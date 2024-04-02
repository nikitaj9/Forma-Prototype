import { useState, useEffect } from "react";
import { Forma } from "forma-embedded-view-sdk/auto";
// import colorsData from "../resouces/colors.json";

function BuildingSelection() {
  // const [buildingPaths, setBuildingPaths] = useState();
  // console.log(buildingPaths);

  useEffect(() => {
    const fetchData = async () => {
      // const siteLimitPaths = await Forma.geometry.getPathsByCategory({
      //   category: "site_limit",
      // });
      // const siteLimitFootprint = await Forma.geometry.getFootprint({
      //   path: siteLimitPaths[0],
      // });
      // console.log("siteLimitFootprint", siteLimitFootprint);
      // setBuildingPaths(pos);
    };
    fetchData();
  }, []);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     Forma.areaMetrics.calculate({}).then((metrics) => {
  //       const functionBreakdownMetrics =
  //         metrics.builtInMetrics.grossFloorArea.functionBreakdown.filter(
  //           (func) => func.functionId != "unspecified"
  //         );
  //       const sqmPerSpotPerFunction = Object.fromEntries(
  //         functionBreakdownMetrics.map((metric) => [metric.functionId, 50])
  //       );

  //       //@ts-ignore
  //       console.log(sqmPerSpotPerFunction);

  //       // console.log(metrics.parkingStatistics!.spots);
  //     });
  //   }, 500);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, []);

  async function colorBuildings() {
    const pos = await Forma.designTool.getPolygon();
    console.log(pos);
  }

  return (
    <>
      {/* {buildingPaths.map((p) => (
        <div>
          <p> {p}</p>
        </div>
      ))} */}
      <button onClick={colorBuildings}>Click Here</button>
    </>
  );
}

export default BuildingSelection;
