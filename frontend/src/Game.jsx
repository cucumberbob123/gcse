import React, { Component } from "react";

import Card from "./Card.jsx";
import Winner from "./Winner.jsx";
import Results from "./Results.jsx";

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.deck = {};
    //we just show black cards until we get a deck from the server
    this.state = {
      cards: {
        local: { color: "000000" },
        opponent: { color: "000000" }
      }
    };
  }

  async componentDidMount() {
    const amount = 30;
    this.deck = await this.getDeck(amount);

    this.setState({
      cards: {
        local: this.deck.shift(),
        opponent: this.deck.shift()
      }
    });
  }

  getDeck(amount) {
    return fetch(`/api/deck/new?amount=${amount}`).then(res => res.json());
  }

  redeal() {
    if (this.deck.length === 0) {
      //if we have no cards left, game over
      this.gameOver();
      return;
    }
    this.setState({
      cards: {
        local: this.deck.shift(),
        opponent: this.deck.shift()
      }
    });
  }

  gameOver() {
    this.props.gameOver();
  }

  render() {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <Card
              color={this.state.cards.local.color}
              number={this.state.cards.local.number}
            />
          </div>
          <div className="col-md-2">
            <Winner
              cards={this.state.cards}
              handleScore={winner => this.props.handleScore(winner)}
            />
            <button onClick={() => this.redeal()} className="btn align-bottom">
              Re-deal
            </button>
          </div>
          <div className="col-md-5">
            <Card
              color={this.state.cards.opponent.color}
              number={this.state.cards.opponent.number}
            />
          </div>
        </div>
        <div className="container my-8">
          <Results scores={this.props.scores} />
        </div>
        <p>Remaining hands: {this.deck.length / 2}</p>
      </div>
    );
  }
}
