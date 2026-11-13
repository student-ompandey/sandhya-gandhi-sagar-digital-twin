# SANDHYA 2.1 · Gandhi Sagar 3D Digital Twin

### *“Sun by day · Wind by night · Water at dusk”*

---

## 📌 Executive Overview

**SANDHYA 2.1 (Gandhi Sagar 3D Digital Twin)** is an interactive, browser-based 3D digital twin and real-time dispatch simulation model of an integrated renewable hybrid energy system located around the historic **Gandhi Sagar Dam and Reservoir** on the Chambal River in Mandsaur / Neemuch districts of Madhya Pradesh, India.

The project demonstrates a **firm, round-the-clock and peak-matching clean energy strategy**:
- **Solar Energy (Day)**: Powers daytime industrial load directly.
- **Wind Energy (Night)**: Generates power during high nocturnal wind regimes.
- **Hydro + BESS (Dusk/Evening Peak 18:00–24:00)**: Hydro generation (drawing from Madhya Pradesh's 57.5 MW share of the 115 MW Gandhi Sagar Hydel Power Station) combined with an 80 MWh Battery Energy Storage System (BESS) delivers a guaranteed **80 MW evening peak power block** while **conserving reservoir water** during the day when solar power is abundant.

The entire digital twin runs inside a single self-contained, client-rendered web application utilizing **Three.js** (WebGL), realistic satellite orthophoto draped on an elevation-derived heightmap terrain, dynamic lighting, fluid flow shaders, animated turbines, solar tracker rotations, and 15-minute dispatch simulation (96 timesteps per day).

---

## 🏗️ System Architecture & Renewable Asset Inventory

The model replicates the real-world geography and infrastructure surrounding Gandhi Sagar Dam and its proximity to the **Gandhi Sagar Wildlife Sanctuary (368.62 km²)**, strictly observing environmental boundaries.

### 1. Solar Generation Assets (Up to 200 MWp Total)
| Asset | Capacity | Description & Engineering Specification |
|---|---|---|
| **Tracker Solar Farm** | 140 MWp | Ground-mounted single-axis tracking photovoltaic arrays located on the southeastern plateau outside sanctuary bounds. Cobalt panel modules, gold safety perimeter fence, dynamic astronomical sun-tracking ($\pm 60^\circ$ tilt). |
| **Stilt Agrivoltaics** | 20 MWp | Elevated solar farm on 4.6 m steel stilts allowing concurrent agricultural crop cultivation beneath the panels. Teal-hued modules with optimized light transmission for farm hamlets. |
| **Water-Surface Solar (Conditional)** | 40 MWp | Floating/surface array sited in the dam tailrace canal strictly outside sanctuary boundaries (toggleable layer, conditional deployment). |

### 2. Wind Generation Facility (100.8 MW Total)
- **Turbines**: 24 $\times$ 4.2 MW modern hybrid wind turbines.
- **Tower Engineering**: 150 m total hub height (60 m precast concrete base + 90 m upper tubular steel mast).
- **Layout**: Two parallel staggered rows (Row A: T01–T12, Row B: T13–T24) positioned along the high wind-velocity ridgeline.
- **Aviation & Safety**: Synchronized red flashing obstruction lights and warning beacons.
- **Dynamics**: Real-time rotor RPM scaling with instantaneous wind velocity curves.

### 3. Hydroelectric Assets (Gandhi Sagar Dam & Powerhouse)
- **Total Station Capacity**: 115 MW (5 $\times$ 23 MW Francis turbine units).
- **Madhya Pradesh Entitlement**: 50% share = **57.5 MW maximum dispatch capacity**.
- **Average Base Run**: 17.1 MW continuous equivalent.
- **Dam Structure**: 64 m high, 514 m long masonry gravity dam with 26 crest spillway gates, penstocks, surge tank, tailrace channel, and live reservoir level indicators.
- **Water Conservation Mechanism**: Dam gates stay closed or throttle down during peak sunshine hours (allowing solar to serve load), conserving water to discharge during the critical 18:00–24:00 evening peak block.

### 4. Grid Substation & Battery Storage (BESS Hub)
- **Central Pooling Substation**: High-voltage step-up transformer yard, control center with satellite dish telemetry, and transmission line dead-ends.
- **BESS Capacity**: 80 MWh / 40 MW Lithium-ion battery facility with dynamic State of Charge (SOC: 0%–100%) and thermal management indicator glow.
- **Transmission**: 220 kV lattice steel suspension and anchor transmission towers routing evacuation corridors away from protected sanctuary corridors.

### 5. Environmental & Regional Context
- **Gandhi Sagar Wildlife Sanctuary Boundary**: 368.62 km² protected boundary marked with red dashed geo-fencing. Zero new development is placed inside the protected sanctuary.
- **Real Geographic Landmarks & Settlements**: Dam staff colony, agricultural hamlets, Kanwala plateau, Chambal river gorge, and tailrace discharge zones.

---

## ⚡ Energy Dispatch & Simulation Engine

The built-in physics and dispatch simulation evaluates daily energy balancing across **96 quarter-hour intervals (15-minute resolution)**:

$$\text{Time Steps: } ST = 96 \quad (h = i / 4, \quad i \in [0, 95])$$

### Mathematical Principles of Operation

1. **Solar Profile**:
   $$P_{\text{solar}}(h) = \begin{cases} 
   0, & h < 6.5 \text{ or } h > 17.5 \\ 
   P_{\text{MWp}} \cdot 0.85 \cdot K_{\text{season}} \cdot (1 - 0.75 \cdot C) \cdot \sin^{1.2}\left(\frac{\pi (h - 6.5)}{11}\right) \cdot (1 - 0.12 \cdot C \cdot \sin(7h)), & 6.5 \le h \le 17.5 
   \end{cases}$$
   *(where $C$ is cloud cover $0.0–1.0$, $K_{\text{season}}$ is seasonal factor: Summer=1.0, Winter=0.78, Monsoon=0.50).*

2. **Wind Profile**:
   $$v(h) = 8.2 \cdot W_{\text{season}} \cdot W_{\text{mult}} \cdot \left[1 + 0.22 \cos\left(\frac{2\pi (h - 22)}{24}\right)\right] + 0.9 \sin(2.1h)$$
   $$P_{\text{wind}}(h) = 100 \cdot \min\left(1, \max\left(0, \frac{v - 3}{8}\right)^3\right)$$
   *(Diurnal peak at night, minimum during late morning).*

3. **Evening Peak Delivery Block (18:00 – 24:00)**:
   - Target demand: **80.0 MW continuous**.
   - Dispatch Priority:
     1. Available Wind $P_{\text{wind}}$ offsets demand directly.
     2. Hydro $P_{\text{hydro}} = \min(57.5, \max(0, 80 - P_{\text{wind}}))$.
     3. Battery Discharge $P_{\text{batt}} = \min(\text{Deficit}, 40, (SOC - 12) \times 4)$.
     4. Total Delivered $P_{\text{del}} = \min(80, P_{\text{wind}} + P_{\text{hydro}} + P_{\text{batt}})$.
   - Target Reliability: **96.0%** annualized across 365 days.

4. **Water Conservation (`Dam water saved`)**:
   Accumulated difference between conventional continuous baseload release (17.1 MW) and actual daytime restricted discharge:
   $$Q_{\text{saved}} = \sum (17.1 - P_{\text{hydro}}(h)) \times 0.25 \text{ MWh}$$

---

## 🎮 Interactive Controls & UI Features

The interface provides an operations console:

### 1. Live Telemetry Panel (Top Right)
- **Time & Season**: Real-time 24h clock with seasonal indicator.
- **Solar $\to$ Industry**: Instantaneous solar output in MW.
- **Wind Generation**: Total wind park output in MW.
- **MP Hydro Share**: Dispatched hydro capacity ($0–57.5$ MW).
- **Battery Status**: Active charge/discharge rate and SOC bar indicator ($0–100\%$).
- **Evening Block Delivery**: Live delivered power against the 80 MW requirement.
- **Dam Water Saved**: Cumulative MWh of equivalent water preserved in reservoir.
- **Dam Gates & Reservoir Level**: Gate opening percentage and water level deviation.
- **Block Status Flag**: `WIND NIGHT`, `SOLAR · WATER HELD`, `PRE-POSITION`, `BLOCK MET` or `DEGRADED`.
- **Reliability Metric**: Simulated target compliance percentage (design target: 96.0%).

### 2. Simulation Timeline & Environmental Sliders (Bottom Center)
- **Play / Pause**: Real-time continuous scrub or paused manual inspection.
- **Time Slider**: $0.00$ to $24.00$ hours with 0.05 hr step increments.
- **Speed Multiplier**: $0.5\times$, $1\times$, $3\times$, and $8\times$.
- **Season Selector**: Summer, Monsoon, Winter (automatically sets atmospheric sky/cloud/wind defaults).
- **Cloud Cover Slider**: Dynamic cloud opacity and solar attenuation ($0.0–1.0$).
- **Wind Multiplier Slider**: Global wind speed scaling factor ($0.4\times–1.6\times$).

### 3. Layer Visibility Manager (Left Panel)
Toggle individual assets and 3D overlays on/off in real-time:
- [x] Tracker solar 140 MWp
- [x] Stilt agrivoltaics 20 MWp
- [x] Water-surface 40 MWp (conditional tailrace array)
- [x] 24 wind turbines
- [x] Substation + Battery energy storage (BESS)
- [x] Dam + Powerhouse
- [x] Power / Water energy flow lines (animated particle tubes)
- [x] Sanctuary boundary (368.62 km² geofence)
- [x] Transmission line towers (220 kV corridor)
- [x] Asset tags (interactive 3D pins)
- [x] Place names (historic and local geographic points)

### 4. Preset Camera Waypoints (Right Floating Menu)
- **Overview**: High-altitude vantage point capturing the dam, gorge, plateau, and wind ridge.
- **Dam**: Close-up inspection of crest spillways, penstocks, powerhouse, and water flows.
- **Plateau**: Focus on 140 MWp tracker arrays and agrivoltaic stilt installations.
- **Ridge**: Elevated perspective across the 24 wind turbine nacelles and towers.
- **Hub**: Inspection of the step-up substation, switchyard, and 80 MWh BESS containers.
- **Satellite Refs**: Overlay gallery showing real-world satellite orthophotos and reference site maps.

---

## 🛠️ Technology Stack & Implementation Details

- **Language / Runtime**: Native HTML5, CSS3, JavaScript (ES6+).
- **3D Graphics Engine**: [Three.js (r128)](https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js).
- **Camera Controller**: `OrbitControls.js` with smooth pan, zoom, and pitch constraints.
- **Terrain Generation**:
  - Embedded Base64 satellite texture image (`IMGS.main`).
  - Embedded Base64 terrain mask / elevation map (`IMGS.mask`).
  - Procedural vertex height sampling and custom surface normal reconstruction.
- **Custom Shaders & Materials**:
  - Dynamic sun illumination, twilight horizon scattering, and seasonal atmospheric fog.
  - GLSL animated water wave displacement and foam generation on tailrace and reservoir surfaces.
  - Instanced mesh rendering (`THREE.InstancedMesh`) for thousands of solar PV modules with single-axis rotation matrices.
- **Data Encapsulation**: Single-file architecture (~1.8 MB) containing code, shaders, styles, and encoded imagery for completely offline operation without backend dependencies.

---

## 🚀 How to Run

1. **Direct Launch**:
   Open the file in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari):
   ```bash
   # Windows PowerShell
   Start-Process "c:\Users\hp\Desktop\sandhya_2_1_gandhi_sagar_3d_digital_twin (1).html"
   ```
2. **Local Static Server (Optional)**:
   ```bash
   npx serve .
   # or
   python -m http.server 8080
   ```
3. **Hardware Requirements**:
   - WebGL 1.0 or 2.0 compatible graphics card / integrated GPU.
   - Hardware acceleration enabled in browser settings for optimal 60 FPS performance.

---

## 📄 Key Project Findings & Simulation Takeaways

1. **Water Arbitrage**: Restricting hydro release during intense solar periods (08:00–16:00) stores hydraulic head behind Gandhi Sagar Dam, shifting up to ~250–350 MWh of hydro energy into the 18:00–24:00 evening block.
2. **Nocturnal Wind Complementarity**: Ridge wind speeds in this region of Western MP / Chambal Valley peak after sunset and sustain high output through the night, minimizing battery discharge depth.
3. **Reliability & Ecology**: Through the combination of 140–200 MWp solar, 100.8 MW wind, 80 MWh BESS, and 57.5 MW MP hydro allocation, the system reliably hits the 80 MW evening block at **$\ge 96.0\%$ annual reliability** while respecting the sanctuary geofence.

