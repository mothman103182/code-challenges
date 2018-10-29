import React, { Component } from 'react';
import './App.css';
import QuestionService from "./service/QuestionService";
import RouteService from "./service/RouteService";

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            routesAndQuestions: '',
            routes: {},
            citySearchRequests: [],
            destinationReachableRequests: [],
            loopPossibleRequests: []
        }
    }

    handleRouteAndQuestionChange = (event) => {
        this.setState({routesAndQuestions: event.target.value});
    };

    generateAnswers = () => {
        this.setState((state) => ({
            routes: RouteService.parseRoutes(state.routesAndQuestions),
            citySearchRequests: QuestionService.parseCitySearchRequests(state.routesAndQuestions),
            destinationReachableRequests: QuestionService.parseDestinationReachableRequests(state.routesAndQuestions),
            loopPossibleRequests: QuestionService.parseLoopPossibleRequests(state.routesAndQuestions)
        }));
    };

    render() {
        let {
            routesAndQuestions,
            routes,
            citySearchRequests,
            destinationReachableRequests,
            loopPossibleRequests
        } = this.state;
        return (
            <div className="tp-app">
                <h1>Welcome to Adam's Amazing Teleporter!</h1>
                <h3>Please enter available routes and your questions in the form below, then hit submit to see your answers.</h3>
                <form>
                    <label htmlFor="routesAndQuestions" >Routes and Questions:</label>
                    <textarea id="routesAndQuestions"
                              name="routesAndQuestions"
                              value={routesAndQuestions}
                              onChange={this.handleRouteAndQuestionChange}
                              placeholder="Enter your routes and questions here"
                    />
                    <div className="tp-error">{this.state.errorMessage}</div>
                    <button type="button" onClick={this.generateAnswers}>Submit</button>
                </form>
                <div id="routeQuestionAnswers">
                    <h3>Answers:</h3>
                    {
                        citySearchRequests.map(citySearchRequest =>
                            <div>
                                cities from {citySearchRequest.sourceCity} in {citySearchRequest.jumps} jumps: {RouteService.findCities(routes, citySearchRequest.sourceCity, citySearchRequest.jumps).join(', ')}
                            </div>
                        )
                    }
                    {
                        destinationReachableRequests.map(destinationReachableRequest =>
                            <div>
                                can I teleport from {destinationReachableRequest.sourceCity} to {destinationReachableRequest.destinationCity}: {RouteService.doesRouteExist(routes, destinationReachableRequest.sourceCity, destinationReachableRequest.destinationCity) ? 'yes' : 'no'}
                            </div>
                        )
                    }
                    {
                        loopPossibleRequests.map(loopPossibleRequest =>
                            <div>
                                loop possible from {loopPossibleRequest}: {RouteService.doesLoopExist(routes, loopPossibleRequest) ? 'yes' : 'no'}
                            </div>
                        )
                    }
                </div>
            </div>
        );
    }
}

export default App;
