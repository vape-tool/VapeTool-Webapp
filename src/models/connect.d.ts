import { Dispatch } from 'redux';
import { MenuDataItem } from '@ant-design/pro-layout';
import { RouterTypes } from 'umi';
import { GlobalModelState } from './global';
import { DefaultSettings as SettingModelState } from '../../config/defaultSettings';
import { UserModelState } from './user';
import { CoilModelState } from './coil';
import { CloudModelState } from './cloud';
import { LiquidModelState } from './liquid';
import { OhmModelState } from './ohm';
import { BatteriesModelState } from './batteries';
import { ConverterModelState } from './converter';
import { UploadPhotoState } from './uploadPhoto';
import { UserWizardState } from './userWizard';
import { UploadState } from './upload';
import { UploadPostState } from './uploadPost';
import { PreviewModelState } from './preview';
import { UserLoginModelState } from '@/pages/login/model';

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    coil?: boolean;
    liquid?: boolean;
    cloud?: boolean;
    operation?: boolean;
    batteries?: boolean;
    ohm?: boolean;
    uploadPhoto?: boolean;
    userWizard?: boolean;
    preview?: boolean;
  };
}

export interface ConnectState {
  global: GlobalModelState;
  loading: Loading;
  userLogin: UserLoginModelState;
  settings: SettingModelState;
  user: UserModelState;
  coil: CoilModelState;
  liquid: LiquidModelState;
  cloud: CloudModelState;
  operation: CloudModelState;
  ohm: OhmModelState;
  batteries: BatteriesModelState;
  converter: ConverterModelState;
  upload: UploadState;
  uploadPhoto: UploadPhotoState;
  uploadPost: UploadPostState;
  userWizard: UserWizardState;
  preview: PreviewModelState;
}

export interface Route extends MenuDataItem {
  routes?: Route[];
}

/**
 * @type T: Params matched in dynamic routing
 */
export interface ConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
  dispatch: Dispatch;
}
