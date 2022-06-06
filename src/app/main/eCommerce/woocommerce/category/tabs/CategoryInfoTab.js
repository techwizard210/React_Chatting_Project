import TextField from '@mui/material/TextField';
import { Autocomplete } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

function CategoryInfoTab(props) {
  const methods = useFormContext();
  const { control, formState } = methods;
  const { errors } = formState;

  return (
    <div>
      <Controller
        name="id"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            disabled
            label="Product Id"
            id="id"
            variant="outlined"
            fullWidth
          />
        )}
      />
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            error={!!errors.name}
            required
            helperText={errors?.name?.message}
            label="Name"
            autoFocus
            id="name"
            variant="outlined"
            fullWidth
          />
        )}
      />
      <Controller
        name="slug"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            error={!!errors.slug}
            required
            helperText={errors?.slug?.message}
            label="Slug"
            id="slug"
            variant="outlined"
            fullWidth
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            label="Description"
            id="description"
            variant="outlined"
            fullWidth
          />
        )}
      />
    </div>
  );
}

export default CategoryInfoTab;
