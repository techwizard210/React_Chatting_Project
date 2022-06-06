import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import { showMessage } from 'app/store/fuse/messageSlice';

export const getRewards = createAsyncThunk('loyaltyApp/rewards/getRewards', async (params, { dispatch, getState }) => {
  try {
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.get(`/api/${orgId}/customer/reward/list`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const rewards = await response.data;
    return rewards;
  } catch (error) {
    dispatch(
      showMessage({
        message: 'Get Reward List error',
        variant: 'error',
      })
    );
    return [];
  }
});
export const addReward = createAsyncThunk('loyaltyApp/rewards/addReward', async (reward, { dispatch, getState }) => {
  try {
    delete reward.id;
    const { token } = await firebase.auth().currentUser.getIdTokenResult();
    if (!token) return null;
    const { id: orgId } = getState().auth.organization.organization;
    const response = await axios.post(
      `/api/${orgId}/customer/reward`,
      { reward },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const rewardResult = await response.data;
    dispatch(
      showMessage({
        message: 'Add Reward success.',
        variant: 'success',
      })
    );
    dispatch(getRewards());
    return rewardResult;
  } catch (error) {
    dispatch(
      showMessage({
        message: 'Add Reward error',
        variant: 'error',
      })
    );
    throw error;
  }
});
export const updateReward = createAsyncThunk(
  'loyaltyApp/rewards/updateReward',
  async (reward, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const response = await axios.put(
        `/api/${orgId}/customer/reward`,
        { reward },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const rewardResult = await response.data;
      dispatch(
        showMessage({
          message: 'Update Reward success.',
          variant: 'success',
        })
      );
      dispatch(getRewards());
      return rewardResult;
    } catch (error) {
      dispatch(
        showMessage({
          message: 'Update Reward error',
          variant: 'error',
        })
      );
      throw error;
    }
  }
);
export const removeReward = createAsyncThunk(
  'loyaltyApp/rewards/removeReward',
  async (rewardId, { dispatch, getState }) => {
    try {
      const { token } = await firebase.auth().currentUser.getIdTokenResult();
      if (!token) return null;
      const { id: orgId } = getState().auth.organization.organization;
      const response = await axios.delete(`/api/${orgId}/customer/reward`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: { id: rewardId },
      });
      const teams = await response.data;
      dispatch(
        showMessage({
          message: 'Delete Reward success.',
          variant: 'success',
        })
      );
      dispatch(getRewards());
      return teams;
    } catch (error) {
      dispatch(
        showMessage({
          message: 'Remove Reward error',
          variant: 'error',
        })
      );
      throw error;
    }
  }
);
const rewardsAdapter = createEntityAdapter({});

export const { selectAll: selectRewards, selectById: selectCustomersById } = rewardsAdapter.getSelectors(
  (state) => state.loyaltyApp.rewards
);

const rewardsSlice = createSlice({
  name: 'loyaltyApp/rewards',
  initialState: rewardsAdapter.getInitialState({
    searchText: '',
    routeParams: {},
    rewardDialog: {
      type: 'new',
      props: {
        open: false,
      },
      data: null,
    },
    reward: null,
  }),
  reducers: {
    resetReward: (state, action) => {
      state.reward = null;
    },
    setRewardsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
    openNewRewardDialog: (state, action) => {
      state.rewardDialog = {
        type: 'new',
        props: {
          open: true,
        },
        data: null,
      };
    },
    closeNewRewardDialog: (state, action) => {
      state.rewardDialog = {
        type: 'new',
        props: {
          open: false,
        },
        data: null,
      };
    },
    openEditRewardDialog: (state, action) => {
      state.rewardDialog = {
        type: 'edit',
        props: {
          open: true,
        },
        data: action.payload,
      };
    },
    closeEditRewardDialog: (state, action) => {
      state.rewardDialog = {
        type: 'edit',
        props: {
          open: false,
        },
        data: null,
      };
    },
  },
  extraReducers: {
    [getRewards.fulfilled]: (state, action) => {
      rewardsAdapter.setAll(state, action.payload);
      state.routeParams = {};
      state.searchText = '';
    },
    // [getCustomer.fulfilled]: (state, action) => {
    //   state.customer = action.payload;
    // },
  },
});

export const {
  setRewardsSearchText,
  openNewRewardDialog,
  closeNewRewardDialog,
  openEditRewardDialog,
  closeEditRewardDialog,
  resetCustomer,
} = rewardsSlice.actions;

export default rewardsSlice.reducer;
