import {Graph, alg} from "@dagrejs/graphlib/index";

function findNextSingleNeighborNode(routesGraph, cycle, nodesToRemoveFromCycle) {
    return cycle.find(node => {
        let neighbors = routesGraph.neighbors(node);
        //Remove any neighbors that we already know are going to be removed from this cycle
        neighbors = neighbors.filter(neighbor => !nodesToRemoveFromCycle.includes(neighbor));
        return !nodesToRemoveFromCycle.includes(node) && neighbors.length <= 1;
    });
}

export default {
    parseRoutes(routeAndQuestionInput) {
        let lines = routeAndQuestionInput.split("\n");
        let routeLines = lines.filter(line => line.includes('-'));
        return routeLines.reduce((routesGraph, routeLine) => {
            let routeParts = routeLine.split(' - ');

            routesGraph.setNode(routeParts[0]);
            routesGraph.setNode(routeParts[1]);
            routesGraph.setEdge(routeParts[0], routeParts[1]);
            routesGraph.setEdge(routeParts[1], routeParts[0]);

            return routesGraph;
        }, new Graph({multigraph: true}));
    },

    findCities(routesGraph, sourceCity, numberOfJumpsOrLess) {
        let shortestPathsToAllCities = alg.dijkstra(routesGraph, sourceCity);
        let matchingRoutes = Object.entries(shortestPathsToAllCities).filter(entry => {
            let route = entry[1];
            return route.distance > 0 && route.distance <= numberOfJumpsOrLess;
        });
        return matchingRoutes.map(route => route[0]);
    },

    doesRouteExist(routesGraph, sourceCity, destinationCity) {
        let shortestPathsToAllCities = alg.dijkstra(routesGraph, sourceCity);
        let routeToDestination = shortestPathsToAllCities[destinationCity];
        return routeToDestination && routeToDestination.distance !== Infinity;
    },

    doesLoopExist(routesGraph, city) {
        let loops = alg.findCycles(routesGraph);
        //Remove the nodes with routes that double back on themselves
        loops = loops.map(loop => this.filterNonLoopNodes(routesGraph, loop));
        let allNodesInALoop = [].concat(...loops);
        return allNodesInALoop.includes(city);
    },

    //A non-loop node is a node that has only 1 neighbor, these are included in graph cycles found, but should not be
    // counted as part of the loop.
    filterNonLoopNodes(routesGraph, cycle) {
        let nodesToRemove = [];
        let nextSingleNeighborNode;
        do {
            nextSingleNeighborNode = findNextSingleNeighborNode(routesGraph, cycle, nodesToRemove);
            if (nextSingleNeighborNode) {
                nodesToRemove.push(nextSingleNeighborNode);
            }
        } while(nextSingleNeighborNode);

        return cycle.filter(node => !nodesToRemove.includes(node));
    }
}