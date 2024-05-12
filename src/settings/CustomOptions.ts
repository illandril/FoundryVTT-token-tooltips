import module from '../module';
import type { PermissionLevel } from './special-permissions';

export type CustomOption = {
  name: string;
  icon: string;
  attributeKey: string;
  permission: PermissionLevel;
  hideFromGM: boolean;
  hideOnPersistent?: boolean;
};

const CustomOptions = module.settings.register<CustomOption[]>('customOptions', Object, [], { config: false });

export default CustomOptions;
