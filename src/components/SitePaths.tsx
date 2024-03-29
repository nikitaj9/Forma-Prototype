import { useState, useEffect } from "react";
import { Forma } from "forma-embedded-view-sdk/auto";
// import colorsData from "../resouces/colors.json";

function BuildingSelection() {
  const [buildingPaths, setBuildingPaths] = useState<string[]>([]);
  console.log(buildingPaths);

  useEffect(() => {
    const fetchData = async () => {
      const siteLimitPaths = await Forma.geometry.getPathsByCategory({
        category: "site_limit",
      });
      const siteLimitFootprint = await Forma.geometry.getFootprint({
        path: siteLimitPaths[0],
      });
      console.log("siteLimitFootprint", siteLimitFootprint);

      setBuildingPaths(siteLimitPaths);
    };
    fetchData();
  }, []);

  return (
    <>
      {buildingPaths.map((p) => (
        <div>
          <p> {p}</p>
        </div>
      ))}
    </>
  );
}

export default BuildingSelection;
