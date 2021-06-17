// Loading Page
import React from 'react';
import LoadingScreen from 'react-loading-screen';

class Loading extends React.Component {
    render() {
        return (
            <LoadingScreen 
                loading = {true}
                spinnerColor = '#FF3E3E'
                textColor = '#676767'
                text = {this.props.text}
            > <></>
            </LoadingScreen>
        )
    }
}

export default Loading;