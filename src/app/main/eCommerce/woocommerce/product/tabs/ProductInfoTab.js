import TextField from '@mui/material/TextField';
import { Autocomplete } from '@mui/material';
import { useFormContext, Controller } from 'react-hook-form';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

function BasicInfoTab(props) {
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
            autoFocus
            id="slug"
            variant="outlined"
            fullWidth
          />
        )}
      />

      <Controller
        name="sku"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            error={!!errors.sku}
            required
            helperText={errors?.sku?.message}
            label="SKU"
            id="sku"
            variant="outlined"
            fullWidth
          />
        )}
      />

      <Controller
        control={control}
        name="stock_status"
        render={({ field }) => (
          <FormControl variant="outlined" className="w-full">
            <InputLabel>Stock Status</InputLabel>
            <Select
              {...field}
              className="mb-24"
              label="Stock"
              id="stock_status"
              fullWidth
              required
            >
              <MenuItem value="instock">In Stock</MenuItem>
              <MenuItem value="outofstock">Out Of Stock</MenuItem>
            </Select>
          </FormControl>
        )}
      />

      <Controller
        name="regular_price"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            error={!!errors.regular_price}
            required
            helperText={errors?.regular_price?.message}
            label="RegularPrice"
            id="regular_price"
            variant="outlined"
            fullWidth
          />
        )}
      />

      <Controller
        control={control}
        name="status"
        render={({ field }) => (
          <FormControl variant="outlined" className="w-full">
            <InputLabel>Status</InputLabel>
            <Select
              {...field}
              className="mb-24"
              label="Status"
              id="status"
              fullWidth
              required
            >
              <MenuItem value="publish">Publish</MenuItem>
              <MenuItem value="pending">Pending Review</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
            </Select>
          </FormControl>
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

export default BasicInfoTab;
