const CITY_SEARCH_REQUEST_START = 'cities from ';
const CITY_SEARCH_REQUEST_MIDDLE = ' in ';
const CITY_SEARCH_REQUEST_END = ' jumps';

const DESTINATION_REACHABLE_REQUEST_START = 'can I teleport from ';
const DESTINATION_REACHABLE_REQUEST_MIDDLE = ' to ';

const LOOPS_POSSIBLE_REQUEST_IDENTIFYING_TEXT = 'loop possible from ';

export default {
    parseCitySearchRequests(routeAndQuestionInput) {
        let lines = routeAndQuestionInput.split("\n");
        let citySearchRequestLines = lines.filter(line => line.startsWith(CITY_SEARCH_REQUEST_START));
        return citySearchRequestLines.map(line => {
            let requestParts = line.replace(CITY_SEARCH_REQUEST_START, '')
                .replace(CITY_SEARCH_REQUEST_END, '')
                .split(CITY_SEARCH_REQUEST_MIDDLE);
            return {sourceCity: requestParts[0], jumps: parseInt(requestParts[1])};
        });
    },

    parseDestinationReachableRequests(routeAndQuestionInput) {
        let lines = routeAndQuestionInput.split("\n");
        let destinationReachableRequestLines = lines.filter(line => line.startsWith(DESTINATION_REACHABLE_REQUEST_START));
        return destinationReachableRequestLines.map(line => {
            let requestParts = line.replace(DESTINATION_REACHABLE_REQUEST_START, '')
                .split(DESTINATION_REACHABLE_REQUEST_MIDDLE);
            return {sourceCity: requestParts[0], destinationCity: requestParts[1]};
        });
    },

    parseLoopPossibleRequests(routeAndQuestionInput) {
        let lines = routeAndQuestionInput.split("\n");
        let loopPossibleRequestLines = lines.filter(line => line.startsWith(LOOPS_POSSIBLE_REQUEST_IDENTIFYING_TEXT));
        return loopPossibleRequestLines.map(line => {
            return line.replace(LOOPS_POSSIBLE_REQUEST_IDENTIFYING_TEXT, '');
        });
    }
}