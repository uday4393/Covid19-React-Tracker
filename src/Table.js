import React from 'react'
import './Table.css';

function Table({ countries }) {
    return <div className="table">
        {
            countries.map(({ country, cases }) => (
                
                    <tr>
                        <td>{country}</td>
                        <strong><td>{cases}</td></strong>
                    </tr>
            ))
        }
    </div>
}

export default Table
