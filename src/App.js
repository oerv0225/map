import React, { Component } from 'react';
import Map from './Map';
import SearchBox from './SearchBox';
import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <section>
                    <article>
                        <Map />
                    </article>
                </section>
            </div>
        );
    }
}

export default App;
