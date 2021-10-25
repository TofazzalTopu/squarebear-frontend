import { Button, Typography } from '@material-ui/core'
import { AddCircle, DragHandle } from '@material-ui/icons';

const SecondCard = (props) => {
    const { titleVariant, titleColor, buttonText, children, categorySection } = props
    return (
        <div style={{
            minHeight: "989px",
            margin: '0 0 298px 16px',
            borderRadius: '6px',
            boxShadow: '-1px 4px 8px 0 rgba(0, 0, 0, 0.36)',
            backgroundColor: '#fff',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography style={{}} variant={titleVariant} color={titleColor}></Typography>
                {
                    buttonText && <Button
                        color="primary"
                        style={{ textAlign: 'center' }}
                        startIcon={
                            <AddCircle />
                        }
                        variant="outlined"
                    >{buttonText}</Button>
                }

            </div>
            <p style={{ color: 'black' }}>{categorySection}</p>
            {children}
        </div >
    )
}
export default SecondCard;