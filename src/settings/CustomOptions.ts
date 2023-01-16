import module from '../module';
import { PermissionLevel } from './SpecialPermissions';

export type CustomOption = {
  name: string
  icon: string
  attributeKey: string
  permission: PermissionLevel
  hideFromGM: boolean
};

const CustomOptions = module.settings.register<CustomOption[]>(
  'customOptions', Object, [], { config: false },
);

export default CustomOptions;
