import {
  Box,
  useColorMode,
  Text,
} from '@chakra-ui/react';
import Avatar from '../Avatar';

const PlayerCard = ({ name, number, role }) => {
  const { colorMode } = useColorMode();
  const bgColor = { light: 'gray.200', dark: 'gray.700' };
  const textColor = { light: 'gray.500', dark: 'gray.100' };
  return (
    <Box
      w="200px"
      h="300px"
      rounded="20px"
      overflow="hidden"
      boxShadow="md"
      bg={bgColor[colorMode]}
      align="center"
    > <Box pt={5}><Avatar value={name} display="flex"/></Box>
      
      <Box p={5}>
        
        <Text
          textTransform="uppercase"
          fontSize="xl"
          color={textColor[colorMode]}
          fontWeight="black"
          letterSpacing="wide"
          my="5"
          isTruncated
        >
          {number} &bull; {name}
        </Text>
        <Text
          textTransform="uppercase"
          fontSize="xl"
          color={textColor[colorMode]}
          fontWeight="medium"
          letterSpacing="wide"
          my="5"
        >
          {role}
        </Text>
      </Box>
    </Box>
  );
};

export default PlayerCard;
