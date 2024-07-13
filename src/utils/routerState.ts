import { routerRedux } from "dva/router";
import { history } from "umi";

const routerState = {
  refreshUrl(dispatch: Function, state: object) {
    const { pathname } = history.location;
    dispatch(
      routerRedux.replace({
        pathname,
        state,
      })
    );
  },

  //  数值传入state
  set(obj: object, params: object, callback: Function) {
    const { dispatch, location } = obj.props;
    let state = {
      ...location.state,
      ...params,
    };
    this.refreshUrl(dispatch, state);
    if (callback && typeof callback === "function") {
      callback();
    }
  },

  //  读取state
  get(obj: object) {
    const { location } = obj.props;
    const _state = {
      ...obj.state,
      ...location.state,
    };
    return _state;
  },
};

export default routerState;
