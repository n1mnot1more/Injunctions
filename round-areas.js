import fs from "fs";

const file = "static/wards.topo.json";

const data = JSON.parse(fs.readFileSync(file, "utf8"));

for (const geometry of data.objects.bnginjunctionsbywardmay29.geometries) {
	const area = geometry.properties?.covered_area_ha;

	if (typeof area === "number") {
		geometry.properties.covered_area_ha =
			Math.round(area * 10) / 10;
	}
}

fs.writeFileSync(file, JSON.stringify(data));

console.log("Done");