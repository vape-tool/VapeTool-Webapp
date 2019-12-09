import { AnyAction } from 'redux';
import { MenuDataItem } from '@ant-design/pro-layout';
import { RouterTypes } from 'umi';
import { GlobalModelState } from './global';
import { DefaultSettings as SettingModelState } from '../../config/defaultSettings';
import { UserModelState } from './user';
import { CoilModelState } from './coil';
import { CloudModelState } from './cloud';
import { LiquidModelState } from './liquid';
import { OhmModelState } from './ohm';
import { BatteriesModelState } from '@/models/batteries';
import { ConverterModelState } from '@/models/converter';
import { UploadPhotoState } from '@/models/uploadPhoto';
import { UserWizardState } from '@/models/userWizard';
import { UploadState } from '@/models/upload';
import { UploadPostState } from '@/models/uploadPost';
import { PreviewModelState } from '@/models/preview';

export { GlobalModelState, SettingModelState, UserModelState, CoilModelState };

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
  dispatch?<K = any>(action: AnyAction): K;
}
