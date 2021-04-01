import {Box,Image,useColorModeValue} from '@chakra-ui/react';
import Avatar from '../Avatar'

const PlayerCard = ({name}) =>
{
    return(
        
        <Box 
        display='flex'
        alignItems="center" 
        w='300px' 
        rounded='20px' 
        overflow='hidden' 
        boxShadow='sm'
        bg='gray.200'
        
        >
            <Image src={Avatar} alt='User Avatar'/>
            <Box p={5}>
            <h1>{name}</h1>
            </Box>
        </Box>
        
    )
}

export default PlayerCard