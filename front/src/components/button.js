import * as React from 'react';

class Button extends React.Component {
    render() {
        return (
            <button
                type="button"
                className={this.props.className}
                key={this.props.key}
                onClick={this.props.onClickFunc}>
                {this.props.text}
            </button>
        )
    }
}

export default Button;