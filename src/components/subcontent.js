import React from 'react';
import '../css/subcontent.css';

// Template for a content page.
export default class Subcontent extends React.Component {
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
            <div className='subcontentContainer'>
                <div className='subcontentHeadings'>
                    <p className='subcontentHeading'> {this.props.heading} </p>
                    <div className='subcontentHeading2'>
                        {headingright2}
                        {headingright}
                    </div>
                </div>
                <div className='subcontent'>
                    {this.props.children}
                </div>
            </div>
        )
    }
}