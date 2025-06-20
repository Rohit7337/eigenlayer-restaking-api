# EigenLayer Restaking Info API

## Overview
This API aggregates restaking data from EigenLayer and provides:
- Restaker info
- Validator metadata
- Reward insights (stubbed)

## Endpoints
- `GET /restakers` → List of restakers (from SQLite DB)
- `GET /validators` → Validator stats (placeholder)
- `GET /rewards/:address` → Reward info (placeholder)

## Setup

```bash
npm install
node src/app.js
