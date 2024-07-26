import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useAuth0 } from '@auth0/auth0-react';
import { updateUser } from '../services/user-service';
import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { isEmpty } from 'lodash';

export default function UserFormDialog(
  props: {
    loggedInUser: any,
    open: boolean,
    setOpen: (open: boolean) => void,
  },
) {
  const { loggedInUser, open, setOpen } = props;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [user, setUser] = React.useState<any>(loggedInUser);

  const [companySize, setCompanySize] = React.useState<string>(user.company_size);
  const [isEmailValid, setIsEmailValid] = React.useState<boolean>(
    !isEmpty(loggedInUser.work_email) || emailRegex.test(loggedInUser.work_email)
  );
  const [isNameValid, setIsNameValid] = React.useState<boolean>(
    !isEmpty(loggedInUser.name)
  );
  const [submitButtonDisabled, setSubmitButtonDisabled] 
    = React.useState<boolean>(
      isEmpty(loggedInUser.name) || isEmpty(loggedInUser.work_email)
    );

  const { getAccessTokenSilently } = useAuth0();

  const handleSubmit = async () => {
    console.log('UserFormDialog: submit: user: ', user);
    const accessToken = await getAccessTokenSilently();
    user.professional_data_submitted = true;
    console.log('UserFormDialog: Before submit: user: ', user);
    await updateUser(accessToken, user);
    setOpen(false);
  };

  const handleSkip = () => {
    setOpen(false);
  };

  const onWorkEmailChange = (e: any) => {
    // console.log('UserFormDialog: onWorkEmailChange: workEmail: ', e.target.value);
    user.work_email = e.target.value;
    setUser(user);
    setIsEmailValid(user.work_email !== '' && emailRegex.test(user.work_email));
    setSubmitButtonDisabled(
      user.name === '' || user.work_email === '' || !isEmailValid
    );
  };

  const onWorkEmailPaste = (e: any) => {
    const workEmail = e.clipboardData.getData("text/plain");
    // console.log('UserFormDialog: onWorkEmailPaste: workEmail: ', workEmail);
    user.work_email = workEmail;
    setUser(user);
    setIsEmailValid(user.work_email !== '' && emailRegex.test(user.work_email));
    setSubmitButtonDisabled(
      user.name === '' || user.work_email === '' || !isEmailValid
    );
  };
  
  return (
    <Dialog open={open}>
      <DialogTitle>Your Details</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          autoComplete='off'
          required={true}
          error={!isNameValid}
          margin="normal"
          id="name"
          label="Full Name"
          type="text"
          defaultValue={user.name ? user.name : ''}
          fullWidth
          variant="standard"
          helperText={isNameValid ? '' : 'Enter a valid full name'}
          onChange={
            (e: any) => {
              user.name = e.target.value;
              setUser(user);
              setIsNameValid(user.name !== '');
              setSubmitButtonDisabled(
                user.name === '' || user.work_email === '' || !isEmailValid
              );
            }
          }
        />
        <TextField
          autoFocus
          autoComplete='off'
          required={true}
          error={!isEmailValid}
          margin="normal"
          id="email"
          label="Work Email"
          type="email"
          defaultValue={user.work_email ? user.work_email : ''}
          fullWidth
          variant="standard"
          helperText={isEmailValid ? '' : 'Enter a valid email address'}
          onChange={onWorkEmailChange}
          onPaste={onWorkEmailPaste}
        />
        <TextField
          autoFocus
          margin="normal"
          id="phone"
          label="Phone Number"
          type="tel"
          defaultValue={user.phone ? user.phone : ''}
          fullWidth
          variant="standard"
          onChange={
            (e: any) => {
              user.phone = e.target.value;
              setUser(user);
            }
          }
        />
        <TextField
          autoFocus
          margin="normal"
          id="jobTitle"
          label="Job Title"
          type="text"
          defaultValue={user.job_title ? user.job_title : ''}
          fullWidth
          variant="standard"
          onChange={
            (e: any) => {
              user.job_title = e.target.value;
              setUser(user);
            }
          }
        />
        <TextField
          autoFocus
          margin="normal"
          id="website"
          label="Company Website"
          type="url"
          defaultValue={user.company_website ? user.company_website : ''}
          fullWidth
          variant="standard"
          onChange={
            (e: any) => {
              user.company_website = e.target.value;
              setUser(user);
            }
          }
        />
        <FormControl fullWidth sx={{marginTop: '30px'}}>
          <InputLabel id="company-size-select-label">Company Size</InputLabel>
          <Select
            labelId="company-size-select-label"
            id="company-size-select"
            value={companySize}
            label="Company Size"
            onChange={(e: SelectChangeEvent) => {
              console.log('UserFormDialog: company size: ', e.target.value);
              setCompanySize(e.target.value as string);
              user.company_size = e.target.value;
              setUser(user);
            }}
          >
            <MenuItem value={'1-10'}>1-10</MenuItem>
            <MenuItem value={'11-50'}>11-50</MenuItem>
            <MenuItem value={'51-250'}>51-250</MenuItem>
            <MenuItem value={'250+'}>250+</MenuItem>
          </Select>
          <FormControlLabel
            value="end"
            control={<Checkbox onChange={
              (event: React.ChangeEvent<HTMLInputElement>) => {
                console.log('UserFormDialog: opt-in: ', event.target.checked);
                user.alpha_opt_in = event.target.checked;
                setUser(user);
              }
            } />}
            label="I would like to opt-in for the Alpha program."
            labelPlacement="end"
            sx={{marginTop: '20px'}}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSkip}>Skip</Button>
        <Button onClick={handleSubmit} disabled={submitButtonDisabled}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}
