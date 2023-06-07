import React from 'react';
import '../assets/scss/Name.scss';

function Name({className,length,name}) {
    return (
        <p className={className}>
                { length > 19 ? name.substring(0,19)+".." : name}
        </p>
    );
}

export default Name;