import React from 'react';
import { prettyPrintStats } from '../util';
import './Table.css';

function Table({ countries }) {

  return (
    <div className='table'>
        <table>
            {countries.map(({country, cases}) => (
                <tr>
                    <td>{country}</td>
                    <td><strong>{prettyPrintStats(cases)}</strong></td>
                </tr>
            ))}
        </table>
    </div>
  )
}

export default Table
