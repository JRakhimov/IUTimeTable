import * as types from './mutation-types';

export default {
  [types.UPDATE_TIMETABLE_INFO](state, payload) {
    state.timeTableInfo = payload;
  }
};
