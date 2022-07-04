const rightPanel = document.getElementById("right-panel");

let data = {
    nodes: [
        { id: "node0", label: "A" },
        { id: "node1", label: "B" },
        { id: "node2", label: "C" },
        { id: "node3", label: "D" },
        { id: "node4", label: "E" },
        { id: "node5", label: "F" },
        { id: "node6", label: "G" }
    ],
    edges: [
        { source: "node0", target: "node1", "label": "3" },
        { source: "node0", target: "node2", "label": "6" },
        { source: "node0", target: "node3", "label": "16" },
        { source: "node1", target: "node5", "label": "18" },
        { source: "node1", target: "node6", "label": "25" },
        { source: "node2", target: "node4", "label": "40" },
        { source: "node3", target: "node2", "label": "10" },
        { source: "node3", target: "node4", "label": "12" },
        { source: "node4", target: "node1", "label": "42" },
        { source: "node6", target: "node4", "label": "23" },
    ]
};

let graphWidth = rightPanel.offsetWidth;
let graphHeight = rightPanel.offsetHeight;

let config = {
    container: "right-panel",
    width: graphWidth,
    height: graphHeight,
    layout: {
        type: 'forceAtlas2',
        center: [graphWidth / 2, graphHeight / 2],
        width: graphWidth,
        height: graphHeight,
        preventOverlap: true,
    },
    defaultNode: {
        shape: "circle",
        size: [50],
        color: "black",
        style: {
            fill: "#58D68D",
            lineWidth: 2
        },
        labelCfg: {
            style: {
                fill: "#FFFFFF",
                fontSize: 16,
                fontFamily: "Consolas"
            }
        }
    },
    defaultEdge: {
        type: 'line',
        style: {
            endArrow: true,
            stroke: "black",
            lineWidth: 2,
            fontFamily: "Consolas"
        },
        labelCfg: {
            autoRotate: true,
            refY: 10
        },
    },
    nodeStateStyles: {
        visiting: {
            fill: "orange"
        },
        visited: {
            fill: "#909497"
        },
        select: {
            fill: "red"
        }
    },
    edgeStateStyles: {
        visiting: {
            stroke: "orange"
        },
        visited: {
            stroke: "#909497"
        },
        select: {
            stroke: "red"
        }
    }
};

const dfsButton = document.getElementById("dfsButton");
const bfsButton = document.getElementById("bfsButton");
const mstpButton = document.getElementById("mstpButton");
const mstkButton = document.getElementById("mstkButton");
const bfButton = document.getElementById("bfButton");
const fwButton = document.getElementById("fwButton");

let graph = new G6.Graph(config);
graph.data(data);
graph.render();

dfsButton.onclick = () => {
    resetGraph();
    dfs(0, nodes, visited, g);
}

bfsButton.onclick = () => {
    resetGraph();
    bfs(0);
}

mstkButton.onclick = () => {
    resetGraph();
    kruskalsMST();
}

mstpButton.onclick = () => {
    resetGraph();
    primsMST();
}

bfButton.onclick = () => {
    resetGraph();
    bellmonFord();
}

fwButton.onclick = () => {
    resetGraph();
    floydWarshall();
}

let g = {
    0: [[1, 3, 0], [2, 6, 1], [3, 16, 2]],
    1: [[5, 18, 3], [6, 25, 4]],
    2: [[4, 40, 5]],
    3: [[2, 10, 6], [4, 12, 7]],
    4: [[1, 42, 8]],
    5: [],
    6: [[4, 23, 9]],
};

// from to weight edge-index
let edgeList = [
    [0, 1, 3, 0],
    [0, 2, 6, 1],
    [0, 3, 16, 2],
    [1, 5, 18, 3],
    [1, 6, 25, 4],
    [2, 4, 40, 5],
    [3, 2, 10, 6],
    [3, 4, 12, 7],
    [4, 1, 42, 8],
    [6, 4, 23, 9],
]

let graphMatrix = [
    [[-1, -1], [3, 0], [6, 1], [16, 2], [-1, -1], [-1, -1], [-1, -1],],
    [[-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [18, 3], [25, 4],],
    [[-1, -1], [-1, -1], [-1, -1], [-1, -1], [40, 5], [-1, -1], [-1, -1],],
    [[-1, -1], [-1, -1], [10, 6], [-1, -1], [12, 7], [-1, -1], [-1, -1],],
    [[-1, -1], [42, 8], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1],],
    [[-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1],],
    [[-1, -1], [-1, -1], [-1, -1], [-1, -1], [23, 9], [-1, -1], [-1, -1],]
];

let v = 7;
let visited = new Array(v).fill(false);
let nodes = graph.getNodes();
let edges = graph.getEdges();
let delayValue = 250;
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

function resetGraph() {
    for (let i = 0; i < nodes.length; i++)
        graph.clearItemStates(nodes[i]);

    for (let i = 0; i < edges.length; i++)
        graph.clearItemStates(edges[i]);

    for (let i = 0; i < visited.length; i++)
        visited[i] = false;
}

async function dfs(at) {
    visited[at] = true;
    markNodeVisiting(at);
    await delay(delayValue);

    for (let i = 0; i < g[at].length; i++) {
        let to = g[at][i][0];
        let w = g[at][i][1];
        let edgeIndex = g[at][i][2];
        markEdgeVisiting(edgeIndex);
        await delay(delayValue);

        if (!visited[to]) {
            await dfs(to);
        }

        markEdgeVisited(edgeIndex);
        await delay(delayValue);
    }

    markNodeVisited(at);
    await delay(delayValue);
}

async function bfs(start = 0) {
    var queue = [[0]];
    visited[start] = true;
    
    while (queue.length != 0) {
        let [at] = queue.shift();
        markNodeVisiting(at);
        await delay(delayValue);

        for (let i = 0; i < g[at].length; i++) {
            let to = g[at][i][0];
            let w = g[at][i][1];
            let edgeIndex = g[at][i][2];
            markEdgeVisiting(edgeIndex);
            await delay(delayValue);
    
            if (!visited[to]) {
                visited[to] = true;
                queue.push([to]);
            }
        }
    }
}

async function primsMST() {
    function minKey(distance, mstSet) { 
        let min = Number.MAX_VALUE, minIndex; 
    
        for (let i = 0; i < v; i++) {
            if (mstSet[i] == false && distance[i][0] < min) {
                min = distance[i][0];
                minIndex = i; 
            }
        }
    
        return minIndex; 
    }

    let parent = []; 
    let distance = []; 
    let mstSet = []; 
    let totalCost = 0;
    markAllEdgesVisited();

    for (let i = 0; i < v; i++) {
        parent[i] = i;
        distance[i] = [Number.MAX_VALUE, -1];
        mstSet[i] = false; 
    }

    distance[0] = [0, -1]; 
    parent[0] = -1;

    function allVisited() {
        for (let i = 0; i < mstSet.length; i++) {
            if (mstSet[i] == false)
                return false;
        }

        return true;
    }

    while (!allVisited()) {
        let at = minKey(distance, mstSet);

        if (mstSet[at])
            continue;

        mstSet[at] = true;
        totalCost += distance[at][0];
        
        if (!nodes[at].hasState("select")) {
            markNodeSelected(at);
            await delay(delayValue);
        }

        for (let i = 0; i < g[at].length; i++) {
            let to = g[at][i][0];
            let w = g[at][i][1];
            let edgeIndex = g[at][i][2];
            markEdgeVisiting(edgeIndex);
            await delay(delayValue);

            if (mstSet[to] == false && w < distance[to][0]) {
                let lastEdgeIndex = distance[to][1];
                parent[to] = at;
                distance[to] = [w, edgeIndex];
                
                if (lastEdgeIndex != -1) {
                    markEdgeVisited(lastEdgeIndex);
                    await delay(delayValue);
                }

                markEdgeSelected(edgeIndex);
                await delay(delayValue);
                
                if (!nodes[to].hasState("select")) {
                    markNodeSelected(to);
                    await delay(delayValue);
                }
            } else {
                markEdgeVisited(edgeIndex);
                await delay(delayValue);
            }
        }
    }
}

async function kruskalsMST() {
    let parent = new Array(v);
    let sizes = new Array(v).fill(1);
    let edgeListCopy = [...edgeList];
    edgeListCopy.sort((a, b) => a[2] - b[2]);

    for (let i = 0; i < parent.length; i++)
        parent[i] = i;

    function findParent(x) {
        if (x == parent[x])
            return x;

        return parent[x] = findParent(parent[x])
    }

    function doUnion(a, b) {
        a = findParent(a);
        b = findParent(b);

        if (a == b) {
            return false;
        } else {
            if (sizes[a] >= sizes[b]) {
                parent[b] = a;
                sizes[a] += sizes[b];
            } else {
                parent[a] = b;
                sizes[b] += sizes[a];
            }
        }

        return true;
    }

    for (let i = 0; i < edgeListCopy.length; i++) {
        let [u, v, w, edgeIndex] = edgeListCopy[i];
        markEdgeVisiting(edgeIndex);
        await delay(delayValue);
        let verdict = doUnion(u, v);

        if (verdict) {
            markEdgeSelected(edgeIndex);
            await delay(delayValue);

            if (!nodes[u].hasState("select")) {
                markNodeSelected(u);
                await delay(delayValue);
            }

            if (!nodes[v].hasState("select")) {
                markNodeSelected(v);
                await delay(delayValue);
            }
        } else {
            markEdgeVisited(edgeIndex);
            await delay(delayValue);
        }
    }
}

async function bellmonFord(at = 0) {
    let parent = [];
    let distance = []; 

    for (let i = 0; i < v; i++) {
        parent[i] = [i, -1];
        distance[i] = Number.MAX_VALUE;
    }

    distance[at] = 0; 
    parent[at] = [-1, -1]; // parent, edge-index

    for (let j = 0; j < v; j++) {
        for (let i = 0; i < edgeList.length; i++) {
            let [u, to, w, edgeIndex] = edgeList[i];

            if (distance[u] !== Number.MAX_VALUE && distance[u] + w < distance[to]) {
                distance[to] = distance[u] + w;
                parent[to] = [u, edgeIndex];
            }
        }
    }
}

async function floydWarshall() {
    let matrix = [...graphMatrix];

    for (let k = 0; k < v; k++) {
        for (let i = 0; i < v; i++) {
            for (let j = 0; j < v; j++) {
                if (matrix[i][k][0] != -1 && matrix[k][j][0] != -1) {
                    let distance = matrix[i][k][0] + matrix[k][j][0];
                    
                    if (matrix[i][j][0] == -1) {
                        matrix[i][j][0] = distance;
                    } else {
                        matrix[i][j][0] = Math.min(distance, matrix[i][j][0]);
                    }
                }
            }
        }
    }
}

function markAllNodesSelected() {
    for (let i = 0; i < nodes.length; i++) {
        graph.clearItemStates(nodes[i]);
        graph.setItemState(nodes[i], "select", true);
    }
}

function markAllEdgesSelected() {
    for (let i = 0; i < edges.length; i++) {
        graph.clearItemStates(edges[i]);
        graph.setItemState(edges[i], "select", true);
    }
}

function markAllNodesVisited() {
    for (let i = 0; i < nodes.length; i++) {
        graph.clearItemStates(nodes[i]);
        graph.setItemState(nodes[i], "visited", true);
    }
}

function markAllEdgesVisited() {
    for (let i = 0; i < edges.length; i++) {
        graph.clearItemStates(edges[i]);
        graph.setItemState(edges[i], "visited", true);
    }
}

function markNodeVisiting(at) {
    graph.clearItemStates(nodes[at]);
    graph.setItemState(nodes[at], "visiting", true);
    return;
}

function markNodeVisited(at) {
    graph.clearItemStates(nodes[at]);
    graph.setItemState(nodes[at], "visited", true);
    return;
}

function markNodeSelected(at) {
    graph.clearItemStates(nodes[at]);
    graph.setItemState(nodes[at], "select", true);
    return;
}

function markEdgeVisiting(at) {
    graph.clearItemStates(edges[at]);
    graph.setItemState(edges[at], "visiting", true);
    return;
}

function markEdgeSelected(at) {
    graph.clearItemStates(edges[at]);
    graph.setItemState(edges[at], "select", true);
    return;
}

function markEdgeVisited(at) {
    graph.clearItemStates(edges[at]);
    graph.setItemState(edges[at], "visited", true);
    return;
}