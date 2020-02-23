import { CONVERTER } from '@/models/converter';

export const onChangeValue = (dispatch: any, type: string) => (value?: number) => {
  dispatch({
    type: `${CONVERTER}/${type}`,
    payload: value,
  });
};
