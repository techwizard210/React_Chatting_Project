import Icon from '@mui/material/Icon';
import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
import { motion } from 'framer-motion';

function GeneralHeader(props) {
  return (
    <div className="flex flex-1 w-full items-center justify-between">
      <div className="flex items-center">
        <Icon
          component={motion.span}
          initial={{ scale: 0 }}
          animate={{ scale: 1, transition: { delay: 0.2 } }}
          className="text-24 md:text-32"
        >
          settings
        </Icon>
        <Typography
          component={motion.span}
          initial={{ x: -20 }}
          animate={{ x: 0, transition: { delay: 0.2 } }}
          delay={300}
          className="hidden sm:flex text-16 md:text-24 mx-12 font-semibold"
        >
          General
        </Typography>
      </div>

      {/* <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}>
        <Button
          className="whitespace-nowrap mr-32"
          variant="contained"
          color="secondary"
          // onClick={handleNewClick}
        >
          <span>Save</span>
        </Button>
      </motion.div> */}
    </div>
  );
}

export default GeneralHeader;
