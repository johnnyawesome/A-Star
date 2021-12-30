/// <reference path="../TSDef/p5.global-mode.d.ts" />

"use strict";

//Size of a Node / Cell

const nodeSize = 20;

//Holds all Nodes
let grid;

//Queues
let openList = []; //Search-Queue
let closedList = []; //Finished Queue

//Define End
let endNode;

//Finished Flag
let finished = false;

//Currently checked Node
let currentNode;

//Nr. of Frames - Needed to gracefully reset Animation
let frameNumber = null;

function setup() {
  angleMode(DEGREES);
  createCanvas(650, 650, P2D);
  background(0);
  stroke(0, 255, 0);
  noFill();

  //Initialize the Animation
  initAnimation();
}

async function draw() {

  //frameRate(10);

  if (!finished) {

    background(0);

    //Perform the A-Star Search Algorithm
    aStar();

    //Display the Grid
    displayGrid();

    //Draw the current Path
    drawPath(currentNode);
  } else {
    //Reset the Animation
    if (frameNumber === null) {
      frameNumber = frameCount;
    } else if (frameCount >= frameNumber + 150) {
      initAnimation();
      frameNumber = null;
    }
  }
}

//The A-Star Search Algorithm
function aStar() {

  //As long as there are items in the openList[], the Search isn't done
  if (!!openList.length) {

    //Find the index of openList with the lowest F-Value
    let lowestFIndex = 0;
    for (let i = 0; i < openList.length - 1; i++) {
      if (openList[i].f < openList[lowestFIndex].f) {
        lowestFIndex = i;
      }
    }

    currentNode = openList[lowestFIndex]; //Current Node

    openList.splice(lowestFIndex, 1); //Remove Current Node from openList

    closedList.push(currentNode); //Add Current Node to closedList

    //If we're at the End-Node, finish
    if (currentNode === endNode) {
      console.log("FOUND END!!!");
      finished = true;
      return;
    }

    //Find the next Step towards the End
    for (const neighbor of currentNode.neighbors) {
      //If Neighbor is a Wall or in closedList, continue (skip it)
      if (neighbor.wall || closedList.includes(neighbor)) continue;

      if (currentNode.f + 1 < neighbor.f || !openList.includes(neighbor)) {
        //Set G-Cost (Distance from Start-Node) of Neighbor
        //neighbor.g = currentNode.g + 1;
        neighbor.g = currentNode.g + Math.floor(dist(currentNode.x, currentNode.y, neighbor.x, neighbor.y))
        //Set H-Cost (Distance to End-Node) of Neighbor
        neighbor.h = Math.floor(dist(neighbor.x, neighbor.y, endNode.x, endNode.y))
        //Set F-Cost (sum of G-Cost + F-Cost) of neighbor
        neighbor.f = neighbor.g + neighbor.h;

        //Set Parent-Node
        neighbor.parent = currentNode;
        //Push Neighbor to the openList
        if (!openList.includes(neighbor)) openList.push(neighbor);

      }
    }
  } else {
    //If there are nomore items in openList[] and the end hasn't been found, the Search failed
    console.log("No Solution!");
    finished = true;
    return;
  }
}

function drawPath(currentNode) {

  //Start Node
  grid[0][0].display(color(255, 0, 0));

  //Keep going through all nodes and color them
  while (currentNode.parent) {
    currentNode.display(color(0, 0, 255));
    currentNode = currentNode.parent;
  }
  //End Node
  endNode.display(color(255, 0, 0));
}