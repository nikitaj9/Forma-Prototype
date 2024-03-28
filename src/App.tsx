import { useState, useEffect } from "react";
import "./App.css";
import { Forma } from "forma-embedded-view-sdk/auto";
import colorsData from "./resouces/colors.json";

type Color = {
  r: number;
  g: number;
  b: number;
  a: number;
};

function App() {
  const [buildingPaths, setBuildingPaths] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<Color | undefined>();
  let [selectedBuildings, setSelectedBuildings] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      Forma.geometry
        .getPathsByCategory({ category: "building" })
        .then(setBuildingPaths);

      const defaultColor = colorsData.Categories[0].Color_RGB;
      const rgba = defaultColor.match(/\d+/g);
      if (rgba) {
        setSelectedColor({ r: +rgba[0], g: +rgba[1], b: +rgba[2], a: 1.0 });
      } else {
        console.error("Invalid color format in JSON");
      }
    };
    fetchData();
  }, []);

  const colorBuildings = async () => {
    const selectedPaths = await Forma.selection.getSelection();
    const response = await Forma.project.getGeoLocation();
    console.log(response);

    console.log(selectedPaths.length);
    setSelectedBuildings(selectedPaths.length);

    if (!selectedColor) {
      console.error("Selected color is undefined.");
      return;
    }

    for (let path of selectedPaths) {
      if (buildingPaths.includes(path)) {
        const position = await Forma.geometry.getTriangles({
          path,
        });
        const numTriangles = position.length / 3;
        const color = new Uint8Array(numTriangles * 4);
        for (let i = 0; i < numTriangles; i += 1) {
          color[i * 4 + 0] = selectedColor.r;
          color[i * 4 + 1] = selectedColor.g;
          color[i * 4 + 2] = selectedColor.b;
          color[i * 4 + 3] = Math.round(selectedColor.a * 255);
        }
        const geometryData = { position, color };
        Forma.render.updateMesh({ id: path, geometryData });
      }
    }
  };

  const reset = () => {
    Forma.render.cleanup();
    setSelectedBuildings(0);
    const defaultColor = colorsData.Categories[0].Color_RGB;
    const rgba = defaultColor.match(/\d+/g);
    if (rgba) {
      setSelectedColor({ r: +rgba[0], g: +rgba[1], b: +rgba[2], a: 1.0 });
    } else {
      console.error("Invalid color format in JSON");
      setSelectedColor({ r: 0, g: 0, b: 0, a: 1.0 });
    }
  };

  return (
    <>
      <div className="section">
        <p>Total number of buildings selected: {selectedBuildings}</p>
      </div>
      <div className="section">
        <button onClick={colorBuildings} disabled={!buildingPaths.length}>
          Color buildings
        </button>
        <button onClick={reset}>Reset</button>
      </div>
    </>
  );
}

export default App;
