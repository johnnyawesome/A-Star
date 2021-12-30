class Node {
  constructor(xIndex, yIndex, nodeSize) {
    this.xIndex = xIndex; //X-Index in grid[]
    this.yIndex = yIndex; //Y-Index in grid[]
    this.x = xIndex * nodeSize; //X-Index in grid[] multiplied by nodeSize (e.g. 2 x 50) forms the grid
    this.y = yIndex * nodeSize; //Y-Index in grid[] multiplied by nodeSize (e.g. 2 x 50) forms the grid
    this.nodeSize = nodeSize; //Size of the Node in Pixels
    this.parent = null; //Node's Parent Node
    this.neighbors = []; //The Node's Neighbors
    this.g = 0; //Cost from Start-Node
    this.h = 0; //Heuristic cost to End-Node 
    this.f = 0; //F-Cost = Sum of G-Cost + H-Cost
    this.wall = random(0, 10) < 2 ? true : false; //Random Chance for the Node to become a Wall
  }
}

//Display the Nodes
Node.prototype.display = function (color) {
  fill(color)
  rect(this.x, this.y, this.nodeSize);
}

//Generates the Grid (all Nodes)
function generateGrid() {

  //Maximum number of Nodes (Squares) that can fit inside the (square) Canvas
  const numNodes = Math.floor(width / nodeSize)

  //Creates a 2D-Array
  grid = new Array(numNodes);
  for (let i = 0; i <= grid.length - 1; i++) grid[i] = new Array(numNodes);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j] = new Node(i, j, nodeSize);
    }
  }
}

//Finds the Neighbors of all Nodes
function findNeighbors() {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      //Left Neighbor
      if (i > 0) grid[i][j].neighbors.push(grid[i - 1][j]);
      //Right Neighbor
      if (i < grid[i].length - 1) grid[i][j].neighbors.push(grid[i + 1][j]);
      //Upper Neighbor
      if (j > 0) grid[i][j].neighbors.push(grid[i][j - 1]);
      //Lower Neighbor
      if (j < grid[i].length - 1) grid[i][j].neighbors.push(grid[i][j + 1]);
    }
  }
}

//Display the Grid
function displayGrid() {

  //Display the Grid
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      //grid[i][j].display(color(0));
      noStroke();
      if (grid[i][j].wall) grid[i][j].display(color(0, 255, 0));
    }
  }

  //Display Open-List
  for (let i in openList) openList[i].display(color(30, 15, 80));

  //Display Closed-List
  for (let i in closedList) closedList[i].display(color(30, 0, 0));
}

//Reset everything, restart the Animation
function initAnimation() {

  //Reset all variables
  finished = false;
  openList = [];
  closedList = [];

  //Generate the Grid
  generateGrid();

  //Define End-Node
  endNode = grid[grid.length - 1][Math.floor(random((grid.length - 1) / 2, grid.length - 1))];
  //End-Node shouldn't be a Wall
  endNode.wall = false;

  //Find all Neighbors of all Nodes and put them inside grid[i][j].neighbors[]
  findNeighbors();

  //Push Starting-Node to the Queue
  openList.push(grid[0][0]);
}
