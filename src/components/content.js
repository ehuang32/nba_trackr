import React from 'react';
import '../css/content.css';

// Template for a content page.
export default class Content extends React.Component {
    render() {
        var headingright = " "
        if (this.props.headingright) {
            headingright = this.props.headingright
        }
        var headingright2 = " "
        if (this.props.headingright2) {
            headingright2 = this.props.headingright2
        }
        return (
            <div className = 'contentContainer'>
                <div className = 'contentHeadings'>
                    <p className = 'contentHeading'> {this.props.heading} </p>
                    <div className = 'contentHeading2'>
                        {headingright2}
                        {headingright}
                    </div>
                </div>
                <div className = 'content'>
                    {this.props.children}
                </div>
            </div>
        )
    }
}