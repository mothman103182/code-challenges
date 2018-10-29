import QuestionService from "./QuestionService";

it('parses city search requests from route and question input', () => {
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

    let citySearchRequests = QuestionService.parseCitySearchRequests(TEST_ROUTE_AND_QUESTION_INPUT);

    expect(citySearchRequests.length).toBe(2);
    expect(citySearchRequests[0]).toEqual({sourceCity: 'Summerton', jumps: 1});
    expect(citySearchRequests[1]).toEqual({sourceCity: 'Summerton', jumps: 2});
});

it('parses destination reachable requests from route and question input', () => {
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

    let destinationReachableRequests = QuestionService.parseDestinationReachableRequests(TEST_ROUTE_AND_QUESTION_INPUT);

    expect(destinationReachableRequests.length).toBe(2);
    expect(destinationReachableRequests[0]).toEqual({sourceCity: 'Springton', destinationCity: 'Atlantis'});
    expect(destinationReachableRequests[1]).toEqual({sourceCity: 'Oaktown', destinationCity: 'Atlantis'});
});

it('parses loop possible requests from route and question input', () => {
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

    let loopPossibleRequests = QuestionService.parseLoopPossibleRequests(TEST_ROUTE_AND_QUESTION_INPUT);

    expect(loopPossibleRequests.length).toBe(2);
    expect(loopPossibleRequests[0]).toEqual('Oaktown');
    expect(loopPossibleRequests[1]).toEqual('Fortuna');
});