import fs from "fs";

const file = "static/wards.topo.json";

const data = JSON.parse(fs.readFileSync(file, "utf8"));

for (const geometry of data.objects.bnginjunctionsbywardmay29.geometries) {
  const area = geometry.properties?.covered_area_ha;

  if (typeof area === "number") {
    let value = area;

    // convert true zeros to -1 first
    if (value === 0) {
      value = -1;
    }

    // round to 2 decimals
    value = Math.round(value * 100) / 100;

    geometry.properties.covered_area_ha = value;
  }
}

fs.writeFileSync(file, JSON.stringify(data));

console.log("Done");