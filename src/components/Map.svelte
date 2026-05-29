<script>
import { base } from "$app/paths";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { onMount } from "svelte";

let canvas;
let hoverCanvas;
let hitCanvas;
let wardHitCanvas;

let context;
let hoverContext;
let hitContext;
let wardHitContext;

let path;
let hitPath;
let wardHitPath;

let wards;
let lads;
let engwal;

let hovered = $state(null);
let hoveredWard = $state(null);
let tooltipX = $state(0);
let tooltipY = $state(0);

let width;
let height;
let dpi;

let pendingHovered = null;
let pendingHoveredWard = null;
let hoverTimeout;

const colorToLad = new Map();
const colorToWard = new Map();

/* -----------------------------
   MODE (injunctions toggle via scroll)
----------------------------- */

let mode = $state("area");

function updateModeFromScroll() {
  const el = document.getElementById("stories");
  if (!el) return;

  const top = el.getBoundingClientRect().top;

  mode = top < window.innerHeight * 0.65
    ? "injunctions"
    : "area";

  requestAnimationFrame(drawBaseMap);
}

/* -----------------------------
   SCALE
----------------------------- */

const areaScale = d3.scaleThreshold()
  .domain([0.0001, 5, 20, 100, 300, 500, 1300])
  .range([
    "#0a061b",
    "#61187a",
    "#b0349a",
    "#e04d79",
    "#fd842b",
    "#fec083",
    "#fcfd4f"
  ]);

const injScale = d3.scaleThreshold()
  .domain([1, 3, 6, 10, 15, 20, 25, 34])
  .range([
    "#0a061b",
    "#2a0a3a",
    "#61187a",
    "#96308d",
    "#d3477d",
    "#fd842b",
    "#fcfd4f",
    "#fff07a"
  ]);

function getWardValue(feature) {
  if (mode === "injunctions") {
    const v = +feature.properties.injunction_names;
    return Number.isFinite(v) && v > 0 ? v : 0;
  }

  const v = +feature.properties.covered_area_ha;
  return Number.isFinite(v) ? v : 0;
}

/* -----------------------------
   BASE MAP
----------------------------- */

function drawBaseMap() {

  context.clearRect(0, 0, width, height);

  wards.features.forEach((feature) => {

    context.beginPath();
    path(feature);

    context.fillStyle =
      mode === "injunctions"
        ? injScale(getWardValue(feature))
        : areaScale(getWardValue(feature));

    context.fill();
  });

  context.beginPath();
  path(engwal);
  context.strokeStyle = "#262235";
  context.lineWidth = 2;
  context.stroke();
}

/* -----------------------------
   HOVER
----------------------------- */

function drawHover() {

  hoverContext.clearRect(0, 0, width, height);

  if (hoveredWard) {
    hoverContext.beginPath();
    path.context(hoverContext)(hoveredWard);

    hoverContext.strokeStyle = "#fff";
    hoverContext.lineWidth = 0.45;
    hoverContext.globalAlpha = 0.9;
    hoverContext.stroke();
  }

  if (hovered) {
    hoverContext.beginPath();
    path.context(hoverContext)(hovered);

    hoverContext.strokeStyle = "#fff";
    hoverContext.lineWidth = 1.2;
    hoverContext.globalAlpha = 1;
    hoverContext.stroke();
  }

  hoverContext.globalAlpha = 1;
}

/* -----------------------------
   HIT MAPS
----------------------------- */

function buildLadHitMap() {

  hitContext.clearRect(0, 0, width, height);

  lads.features.forEach((feature, i) => {
    const r = (i + 1) & 255;
    const g = ((i + 1) >> 8) & 255;
    const b = ((i + 1) >> 16) & 255;

    const color = `rgb(${r},${g},${b})`;

    colorToLad.set(`${r},${g},${b}`, feature);

    hitContext.beginPath();
    hitPath(feature);
    hitContext.fillStyle = color;
    hitContext.fill();
  });
}

function buildWardHitMap() {

  wardHitContext.clearRect(0, 0, width, height);

  wards.features.forEach((feature, i) => {
    const r = (i + 1) & 255;
    const g = ((i + 1) >> 8) & 255;
    const b = ((i + 1) >> 16) & 255;

    const color = `rgb(${r},${g},${b})`;

    colorToWard.set(`${r},${g},${b}`, feature);

    wardHitContext.beginPath();
    wardHitPath(feature);
    wardHitContext.fillStyle = color;
    wardHitContext.fill();
  });
}

/* -----------------------------
   PICK FEATURE
----------------------------- */

function getFeatureAtPoint(x, y, ctx, map) {

  const radius = 3;
  const size = radius * 2 + 1;

  const px = Math.round(x * dpi);
  const py = Math.round(y * dpi);

  const data = ctx.getImageData(
    px - radius,
    py - radius,
    size,
    size
  ).data;

  const counts = new Map();

  for (let i = 0; i < data.length; i += 4) {

    const r = data[i], g = data[i + 1], b = data[i + 2];

    if (r === 0 && g === 0 && b === 0) continue;

    const key = `${r},${g},${b}`;

    const feature = map.get(key);

    if (!feature) continue;

    counts.set(feature, (counts.get(feature) || 0) + 1);
  }

  if (!counts.size) return null;

  let best = null;
  let bestCount = 0;

  for (const [f, c] of counts) {
    if (c > bestCount) {
      best = f;
      bestCount = c;
    }
  }

  return best;
}

/* -----------------------------
   INIT
----------------------------- */

onMount(async () => {

  const mobile = window.innerWidth < 900;

  width = mobile ? window.innerWidth : window.innerWidth * 0.6;
  height = mobile
    ? window.innerHeight
    : window.innerHeight - 72;

  dpi = window.devicePixelRatio || 1;

  const topo = await d3.json(`${base}/wards.topo.json`);
  wards = topojson.feature(topo, topo.objects[Object.keys(topo.objects)[0]]);

  const ladTopo = await d3.json(`${base}/lads.topo.json`);
  lads = topojson.feature(ladTopo, ladTopo.objects[Object.keys(ladTopo.objects)[0]]);

  const engwalTopo = await d3.json(`${base}/engwal.topo.json`);
  engwal = topojson.feature(engwalTopo, engwalTopo.objects[Object.keys(engwalTopo.objects)[0]]);

  /* ✅ FIX: use PURE CSS PIXELS for projection */
  const renderWidth = width;
  const renderHeight = height;

  const projection = d3.geoIdentity()
    .reflectY(true)
    .fitExtent(
      [[15, 15], [renderWidth - 15, renderHeight - 15]],
      wards
    );

  /* CANVAS */
  canvas.width = width * dpi;
  canvas.height = height * dpi;
  context = canvas.getContext("2d");
  context.setTransform(dpi, 0, 0, dpi, 0, 0);

  hoverCanvas.width = width * dpi;
  hoverCanvas.height = height * dpi;
  hoverContext = hoverCanvas.getContext("2d");
  hoverContext.setTransform(dpi, 0, 0, dpi, 0, 0);

  hitCanvas.width = width * dpi;
  hitContext = hitCanvas.getContext("2d");
  hitContext.setTransform(dpi, 0, 0, dpi, 0, 0);

  wardHitCanvas.width = width * dpi;
  wardHitContext = wardHitCanvas.getContext("2d");
  wardHitContext.setTransform(dpi, 0, 0, dpi, 0, 0);

  path = d3.geoPath(projection, context);
  hitPath = d3.geoPath(projection, hitContext);
  wardHitPath = d3.geoPath(projection, wardHitContext);

  buildLadHitMap();
  buildWardHitMap();
  drawBaseMap();

  window.addEventListener("scroll", updateModeFromScroll);

  canvas.addEventListener("mousemove", (e) => {

    const bounds = canvas.getBoundingClientRect();

    const x = ((e.clientX - bounds.left) / bounds.width) * width;
    const y = ((e.clientY - bounds.top) / bounds.height) * height;

    tooltipX = e.clientX - bounds.left;
    tooltipY = e.clientY - bounds.top;

    const nextLad = getFeatureAtPoint(x, y, hitContext, colorToLad);
    const nextWard = getFeatureAtPoint(x, y, wardHitContext, colorToWard);

    pendingHovered = nextLad;
    pendingHoveredWard = nextWard;

    clearTimeout(hoverTimeout);

    hoverTimeout = setTimeout(() => {
      hovered = pendingHovered;
      hoveredWard = pendingHoveredWard;
      requestAnimationFrame(drawHover);
    }, 10);
  });

  canvas.addEventListener("mouseleave", () => {
    hovered = null;
    hoveredWard = null;
    requestAnimationFrame(drawHover);
  });

  canvas.style.cursor = "crosshair";
});
</script>

<div class="map-wrap">
  <canvas bind:this={canvas} class="base" />
  <canvas bind:this={hoverCanvas} class="hover" />
  <canvas bind:this={hitCanvas} style="display:none;" />
  <canvas bind:this={wardHitCanvas} style="display:none;" />

  {#if hoveredWard}
    <div class="tooltip" style="left:{tooltipX + 20}px; top:{tooltipY - 10}px;">
      <div>{hoveredWard.properties.WARD_Name}</div>

      <div>
        in {hovered?.properties?.["LAD Name"] ?? "Unknown LAD"}
      </div>

      <div>
        {mode === "injunctions"
          ? `${+hoveredWard.properties.injunction_names || 0} injunctions`
          : `${hoveredWard.properties.covered_area_ha ?? "?"} hectares injuncted`
        }
      </div>
    </div>
  {/if}
</div>

<style>
.map-wrap {
  position: relative;
  width: 100%;
  height: 100%;
}

canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.base  { z-index: 1; }
.hover { z-index: 2; pointer-events: none; }

.tooltip {
  position: absolute;
  z-index: 10;
  pointer-events: none;
  color: #fff;
  font-size: 0.9rem;
  white-space: nowrap;
}
</style>