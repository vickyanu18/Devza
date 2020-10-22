import React, { Component } from "react";

class LoadingMask extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div id='overlayDiv' style={{display: this.props.show ? 'block' : 'none'}}>
				<div id='logo'>
					<div className='app-loader'>
					</div>
				</div>
			</div>
		)
	}
}

export default LoadingMask;