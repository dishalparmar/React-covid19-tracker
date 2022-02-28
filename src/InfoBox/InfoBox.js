import React from 'react';
import './InfoBox.css';
import { Card, CardContent, Typography } from '@material-ui/core';

function InfoBox({title, cases, total, ...props}) {   '...props = all other props I have sent in in this case onClick' 
return (
    <Card onClick={props.onClick} 
          className={`infoBox ${props.active && 'infoBox-active'} 
                              ${props.isRed && 'infoBox-red'}`}>
        <CardContent>
            <Typography className='infoBox-title' color='textSecondary'> {title}</Typography>
              <h2 className={`infoBox-cases ${!props.isRed && 'infoBox-cases-green'} `}>{cases} Today</h2>
            <Typography className='infoBox-total' color='textSecondary'> {total} Total</Typography>
        </CardContent>
    </Card>
  )
}

export default InfoBox
