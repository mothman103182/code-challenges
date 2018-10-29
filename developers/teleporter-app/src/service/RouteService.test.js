import RouteService from "./RouteService";
import {Graph} from "@dagrejs/graphlib/index";

it('parses route map from route and question input', () => {
    const TEST_ROUTE_AND_QUESTION_INPUT =
        'Fortuna - Hemingway\n' +
        'Fortuna - Atlantis\n' +
        'Hemingway - Chesterfield\n' +
        'Chesterfield - Springton\n' +
        'Los Amigos - Paristown\n' +
        'Paristown - Oaktown\n' +
        'Los Amigos - Oaktown\n' +
        'Summerton - Springton\n' +
        'Summerton - Hemingway\n' +
        'cities from Summerton in 1 jumps\n' +
        'cities from Summerton in 2 jumps\n' +
        'can I teleport from Springton to Atlantis\n' +
        'can I teleport from Oaktown to Atlantis\n' +
        'loop possible from Oaktown\n' +
        'loop possible from Fortuna';

    let routesGraph = RouteService.parseRoutes(TEST_ROUTE_AND_QUESTION_INPUT);

    expect(routesGraph.edges().length).toBe(18);
});

it('finds cities at specified number of jumps from starting city', () => {
    let testRoutesGraph = new Graph({multigraph: true});

    testRoutesGraph.setEdge('Fortuna', 'Hemingway');
    testRoutesGraph.setEdge('Hemingway', 'Fortuna');
    testRoutesGraph.setEdge('Fortuna', 'Atlantis');
    testRoutesGraph.setEdge('Atlantis', 'Fortuna');
    testRoutesGraph.setEdge('Hemingway', 'Chesterfield');
    testRoutesGraph.setEdge('Chesterfield', 'Hemingway');
    testRoutesGraph.setEdge('Chesterfield', 'Springton');
    testRoutesGraph.setEdge('Springton', 'Chesterfield');
    testRoutesGraph.setEdge('Los Amigos', 'Paristown');
    testRoutesGraph.setEdge('Paristown', 'Los Amigos');
    testRoutesGraph.setEdge('Paristown', 'Oaktown');
    testRoutesGraph.setEdge('Oaktown', 'Paristown');
    testRoutesGraph.setEdge('Los Amigos', 'Oaktown');
    testRoutesGraph.setEdge('Oaktown', 'Los Amigos');
    testRoutesGraph.setEdge('Springton', 'Summerton');
    testRoutesGraph.setEdge('Hemingway', 'Summerton');
    testRoutesGraph.setEdge('Summerton', 'Springton');
    testRoutesGraph.setEdge('Summerton', 'Hemingway');

    let foundCities = RouteService.findCities(testRoutesGraph, 'Summerton', 1);

    expect(foundCities.length).toBe(2);
    expect(foundCities.includes('Springton')).toBeTruthy();
    expect(foundCities.includes('Hemingway')).toBeTruthy();

    foundCities = RouteService.findCities(testRoutesGraph, 'Summerton', 2);

    expect(foundCities.length).toBe(4);
    expect(foundCities.includes('Springton')).toBeTruthy();
    expect(foundCities.includes('Hemingway')).toBeTruthy();
    expect(foundCities.includes('Chesterfield')).toBeTruthy();
    expect(foundCities.includes('Fortuna')).toBeTruthy();
});

it('does route exist between 2 cities', () => {
    let testRoutesGraph = new Graph({multigraph: true});

    testRoutesGraph.setEdge('Fortuna', 'Hemingway');
    testRoutesGraph.setEdge('Hemingway', 'Fortuna');
    testRoutesGraph.setEdge('Fortuna', 'Atlantis');
    testRoutesGraph.setEdge('Atlantis', 'Fortuna');
    testRoutesGraph.setEdge('Hemingway', 'Chesterfield');
    testRoutesGraph.setEdge('Chesterfield', 'Hemingway');
    testRoutesGraph.setEdge('Chesterfield', 'Springton');
    testRoutesGraph.setEdge('Springton', 'Chesterfield');
    testRoutesGraph.setEdge('Los Amigos', 'Paristown');
    testRoutesGraph.setEdge('Paristown', 'Los Amigos');
    testRoutesGraph.setEdge('Paristown', 'Oaktown');
    testRoutesGraph.setEdge('Oaktown', 'Paristown');
    testRoutesGraph.setEdge('Los Amigos', 'Oaktown');
    testRoutesGraph.setEdge('Oaktown', 'Los Amigos');
    testRoutesGraph.setEdge('Springton', 'Summerton');
    testRoutesGraph.setEdge('Hemingway', 'Summerton');
    testRoutesGraph.setEdge('Summerton', 'Springton');
    testRoutesGraph.setEdge('Summerton', 'Hemingway');

    let routeExists = RouteService.doesRouteExist(testRoutesGraph, 'Springton', 'Atlantis');

    expect(routeExists).toBeTruthy();

    routeExists = RouteService.doesRouteExist(testRoutesGraph, 'Oaktown', 'Atlantis');

    expect(routeExists).not.toBeTruthy();
});

it('does loop exist for city', () => {
    let testRoutesGraph = new Graph({multigraph: true});

    testRoutesGraph.setEdge('Fortuna', 'Hemingway');
    testRoutesGraph.setEdge('Hemingway', 'Fortuna');
    testRoutesGraph.setEdge('Fortuna', 'Atlantis');
    testRoutesGraph.setEdge('Atlantis', 'Fortuna');
    testRoutesGraph.setEdge('Hemingway', 'Chesterfield');
    testRoutesGraph.setEdge('Chesterfield', 'Hemingway');
    testRoutesGraph.setEdge('Chesterfield', 'Springton');
    testRoutesGraph.setEdge('Springton', 'Chesterfield');
    testRoutesGraph.setEdge('Los Amigos', 'Paristown');
    testRoutesGraph.setEdge('Paristown', 'Los Amigos');
    testRoutesGraph.setEdge('Paristown', 'Oaktown');
    testRoutesGraph.setEdge('Oaktown', 'Paristown');
    testRoutesGraph.setEdge('Los Amigos', 'Oaktown');
    testRoutesGraph.setEdge('Oaktown', 'Los Amigos');
    testRoutesGraph.setEdge('Springton', 'Summerton');
    testRoutesGraph.setEdge('Summerton', 'Springton');
    testRoutesGraph.setEdge('Hemingway', 'Summerton');
    testRoutesGraph.setEdge('Summerton', 'Hemingway');

    let loopExists = RouteService.doesLoopExist(testRoutesGraph, 'Oaktown');

    expect(loopExists).toBeTruthy();

    loopExists = RouteService.doesLoopExist(testRoutesGraph, 'Fortuna');

    expect(loopExists).not.toBeTruthy();
});

it('filter non loop nodes', () => {
    let testRoutesGraph = new Graph({multigraph: true});

    testRoutesGraph.setEdge('Fortuna', 'Hemingway');
    testRoutesGraph.setEdge('Hemingway', 'Fortuna');
    testRoutesGraph.setEdge('Fortuna', 'Atlantis');
    testRoutesGraph.setEdge('Atlantis', 'Fortuna');
    testRoutesGraph.setEdge('Hemingway', 'Chesterfield');
    testRoutesGraph.setEdge('Chesterfield', 'Hemingway');
    testRoutesGraph.setEdge('Chesterfield', 'Springton');
    testRoutesGraph.setEdge('Springton', 'Chesterfield');
    testRoutesGraph.setEdge('Los Amigos', 'Paristown');
    testRoutesGraph.setEdge('Paristown', 'Los Amigos');
    testRoutesGraph.setEdge('Paristown', 'Oaktown');
    testRoutesGraph.setEdge('Oaktown', 'Paristown');
    testRoutesGraph.setEdge('Los Amigos', 'Oaktown');
    testRoutesGraph.setEdge('Oaktown', 'Los Amigos');
    testRoutesGraph.setEdge('Springton', 'Summerton');
    testRoutesGraph.setEdge('Summerton', 'Springton');
    testRoutesGraph.setEdge('Hemingway', 'Summerton');
    testRoutesGraph.setEdge('Summerton', 'Hemingway');

    let cycleWithNonLoopNodes = [
        'Atlantis',
        'Summerton',
        'Springton',
        'Chesterfield',
        'Hemingway',
        'Fortuna'
    ];

    let loopNodesOnly = RouteService.filterNonLoopNodes(testRoutesGraph, cycleWithNonLoopNodes);

    expect(loopNodesOnly.length).toBe(4);
    expect(loopNodesOnly.includes('Atlantis')).not.toBeTruthy();
    expect(loopNodesOnly.includes('Fortuna')).not.toBeTruthy();
});