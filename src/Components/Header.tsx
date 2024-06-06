import * as React from 'react';
import { Container, AppBar, Box, Typography } from '@mui/material';

export default function ButtonAppBar() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ height: '150px', background: '#1B4965' }}>
                <Container sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight:'bold', letterSpacing:'4px'}}>
                        Dashboard Api <br />
                        <Typography variant='subtitle1'>
                            Hola Dan, Bienvenido
                        </Typography>
                    </Typography>
                </Container>
            </AppBar>
        </Box>
    );
}
