export const SET_RESULT = 'SET_RESULT';
export const SET_DICT = 'SET_DICT';
export const DISABLE_DICT = 'DISABLE_DICT';

export function setDict(dict) {
  return {
    type: SET_DICT,
    dict
  };
}

export function setResult(result) {
  return {
    type: SET_RESULT,
    result
  };
}

export function disableDict(dict) {
  return {
    type: DISABLE_DICT,
    dict
  };
}
