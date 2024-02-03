/*
 *
 *  function Template
 *
 *  function Shape_name(data){
 *	//data -> parameters Required for the Shape
 *	let points = [];
 *
 *	// Calculate points
 *
 *	return points;
 * }
 *
 * example:
 * 	function line(x0, y0, x1, y1){
 * 	  //x0, y0 -> Initial Points of Line
 *	  //x1, y1 ->  End Points of the line
 *        let points = []
 *
 *	  //Calculate points
 *
 *	  return points
 *
 */

import { Point } from "./tool";



export function line(p1: Point, p2: Point) {
  /* this function calculates the points of the line with endpoints p1 &p2
   */
  let points: Array<Point> = [];
  let dx = Math.abs(p2.x - p1.x);
  let sx = p1.x < p2.x ? 1 : -1;
  let dy = -Math.abs(p2.y - p1.y);
  let sy = p1.y < p2.y ? 1 : -1;
  let err = dx + dy;

  let x1 = p1.x;
  let y1 = p1.y;
  while (true) {
    points.push(new Point(x1, y1));
    if (x1 == p2.x && y1 == p2.y) {
      break;
    }
    let e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x1 += sx;
    }

    if (e2 <= dx) {
      err += dx;
      y1 += sy;
    }
  }
  return points;
}

export function rect(p1: Point, p2: Point) {
  /* this function calculates the rect points of the line with endpoints p1 &p2
   */
  let points: Array<Point> = [];
  for(let i = 0; i <= Math.abs(p2.x - p1.x); i ++){
    for(let j = 0; j <= Math.abs(p2.y - p1.y); j ++){
      let x = p1.x + i * (p2.x - p1.x)/Math.abs(p2.x - p1.x);
      let y = p1.y + j * (p2.y - p1.y)/Math.abs(p2.y - p1.y);
      if (x !== p1.x && x !== p2.x && y !== p1.y && y !== p2.y){
        continue;
      }
      points.push(new Point( x, y))
    }
  }
 
  return points;
}

export function circle(r: number, pc: Point) {
  /* This function returns points of Circle with radius r and center as pc*/

  let points: Array<Point> = [];
  let x = 0;
  let y = r;
  points.push(new Point(x, y));
  let p = 1 - r;

  while (x <= y) {
    //conditions
    x++;

    if (p < 0) {
      points.push(new Point(x, y));
      p = p + 2 * x + 1;
    } else if (p >= 0) {
      y--;
      points.push(new Point(x, y));
      p = p + 2 * x + 1 - 2 * y;
    }
  }

  points = _sym8(points);
  for (let pt of points) {
    pt.x += pc.x;
    pt.y += pc.y;
  }

  return points;
}

function _sym8(points: Array<Point>) {
  /* This is a helper function for circle which calculates points on all the 8 symmetries */
  let nPoints: Array<Point> = [];

  Array.prototype.push.apply(nPoints, points);

  for (let p of points) {
    nPoints.push(new Point(p.y, p.x));
  }
  for (let p of points) {
    nPoints.push(new Point(-p.y, p.x));
  }
  for (let p of points) {
    nPoints.push(new Point(-p.x, p.y));
  }
  for (let p of points) {
    nPoints.push(new Point(-p.x, -p.y));
  }
  for (let p of points) {
    nPoints.push(new Point(-p.y, -p.x));
  }
  for (let p of points) {
    nPoints.push(new Point(p.y, -p.x));
  }
  for (let p of points) {
    nPoints.push(new Point(p.x, -p.y));
  }
  return nPoints;
}

export function ellipse(start: Point, end: Point) {
  /* This function return the points of the ellipse with major axis rx and minor axis ry with center pc */
  let rx: number = Math.abs(start.x - end.x) / 2;
  let ry: number = Math.abs(start.x - end.x) / 2;
  
  let cx = start.x + rx * (end.x - start.x > 0 ? 1: -1 );
  let cy = start.y + ry * (end.y - start.y > 0 ? 1: -1 )
  let pc: Point = new Point(cx, cy);
  let points: Array<Point> = [];
  let x = 0;
  let y = ry;
  points.push(new Point(x, y));

  //Region 1
  let p1 = Math.pow(ry, 2) + (1 / 4) * Math.pow(rx, 2) - Math.pow(rx, 2) * ry;

  while (2 * Math.pow(ry, 2) * x < 2 * Math.pow(rx, 2) * y) {
    x++;
    if (p1 < 0) {
      points.push(new Point(x, y));
      p1 = p1 + 2 * Math.pow(ry, 2) * x + Math.pow(ry, 2);
    } else if (p1 > 0){
      y--;
      points.push(new Point(x, y));
      p1 =
        p1 +
        2 * Math.pow(ry, 2) * x -
        2 * Math.pow(rx, 2) * y +
        Math.pow(ry, 2);
    }
  }

  //Region 2
  let x0 = points[points.length - 1].x;
  let y0 = points[points.length - 1].y;

  let p2 =
    Math.pow(ry, 2) * Math.pow(x0 + 1 / 2, 2) +
    Math.pow(rx, 2) * Math.pow(y0 - 1, 2) -
    Math.pow(rx, 2) * Math.pow(ry, 2);

  while (y0 > 0) {
    y0--;

    if (p2 < 0) {
      points.push(new Point(x0, y0));
      p2 = p2 - 2 * Math.pow(rx, 2) * y0 + Math.pow(rx, 2);
    } else if (p2 > 0){
      x0++;
      points.push(new Point(x0, y0));
      p2 =
        p2 +
        2 * Math.pow(ry, 2) * x0 -
        2 * Math.pow(rx, 2) * y0 +
        Math.pow(rx, 2);
    }
  }
  points = _sym4(points);
  for (let pt of points) {
    pt.x += pc.x;
    pt.y += pc.y;
  }
  return points;
}

function _sym4(points: Array<Point>) {
  /* This is a helper function for ellipse which calculates points on all the 4 symmetries */
  let nPoints: Array<Point> = [];

  Array.prototype.push.apply(nPoints, points);

  for (let p of points) {
    nPoints.push(new Point(-p.x, p.y));
  }
  for (let p of points) {
    nPoints.push(new Point(-p.x, -p.y));
  }
  for (let p of points) {
    nPoints.push(new Point(p.x, -p.y));
  }
  return nPoints;
}

