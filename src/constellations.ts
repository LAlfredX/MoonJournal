export interface StarPoint {
  x: number;
  y: number;
}

export interface Constellation {
  name: string;
  points: StarPoint[];
  connections: [number, number][]; // indices of connected points
}

export const CONSTELLATIONS: Constellation[] = [
  {
    name: "Ursa Minor",
    points: [
      { x: 15, y: 20 },
      { x: 22, y: 15 },
      { x: 30, y: 18 },
      { x: 32, y: 25 },
      { x: 25, y: 28 },
      { x: 22, y: 23 },
      { x: 18, y: 28 },
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 2], [5, 6]]
  },
  {
    name: "Cassiopeia",
    points: [
      { x: 75, y: 15 },
      { x: 82, y: 20 },
      { x: 78, y: 28 },
      { x: 85, y: 32 },
      { x: 92, y: 25 },
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4]]
  },
  {
    name: "Lyra",
    points: [
      { x: 45, y: 15 },
      { x: 48, y: 25 },
      { x: 55, y: 22 },
      { x: 52, y: 12 },
      { x: 60, y: 18 }
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 0], [2, 4]]
  },
  {
    name: "Cygnus",
    points: [
      { x: 10, y: 50 },
      { x: 20, y: 55 },
      { x: 30, y: 60 },
      { x: 40, y: 65 },
      { x: 25, y: 45 },
      { x: 15, y: 70 },
    ],
    connections: [[0, 1], [1, 2], [2, 3], [1, 4], [1, 5]]
  },
  {
    name: "Orion",
    points: [
      { x: 70, y: 60 },
      { x: 80, y: 55 },
      { x: 75, y: 65 },
      { x: 72, y: 66 },
      { x: 78, y: 64 },
      { x: 65, y: 75 },
      { x: 85, y: 70 },
    ],
    connections: [[0, 2], [1, 4], [2, 3], [3, 4], [3, 5], [4, 6]]
  },
  {
    name: "Pegasus",
    points: [
      { x: 40, y: 80 },
      { x: 55, y: 75 },
      { x: 60, y: 90 },
      { x: 45, y: 95 },
      { x: 30, y: 85 }
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 4]]
  },
  {
    name: "Leo",
    points: [
      { x: 85, y: 85 },
      { x: 92, y: 80 },
      { x: 88, y: 92 },
      { x: 78, y: 95 },
      { x: 72, y: 88 },
      { x: 76, y: 82 }
    ],
    connections: [[0, 1], [0, 2], [2, 3], [3, 4], [4, 5], [5, 0]]
  }
];

export const ALL_STARS = CONSTELLATIONS.flatMap((c, cIdx) => 
  c.points.map((p, pIdx) => ({ ...p, cIdx, pIdx }))
);
