// import Typography from '@mui/material/Typography';
import { motion } from "framer-motion";

// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Controller, useForm } from 'react-hook-form';

// import Button from '@mui/material/Button';
// import Icon from '@mui/material/Icon';
// import TextField from '@mui/material/TextField';
// import InputAdornment from '@mui/material/InputAdornment';
// import FileCopy from '@mui/icons-material/FileCopy';
// import IconButton from '@mui/material/IconButton';

// import { showMessage } from 'app/store/fuse/messageSlice';
// import _ from '@lodash';
// import * as yup from 'yup';
// import { yupResolver } from '@hookform/resolvers/yup';

// import { updateOrganization } from './store/generalSlice';
import WorkingHoursSetting from "./components/WorkingHoursSetting";
import MotopressSetting from "./components/MotopressSetting";

function GeneralPageContent() {
  const container = {
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {/* <div className="md:flex m-1 md:m-14"> */}
      <div className="flex flex-col flex-1">
        <div className="flex flex-col mb-4">
          <WorkingHoursSetting />
        </div>

        <div className="flex flex-col mb-4">
          <MotopressSetting />
        </div>
      </div>
      {/* </div> */}
    </motion.div>
  );
}

export default GeneralPageContent;
