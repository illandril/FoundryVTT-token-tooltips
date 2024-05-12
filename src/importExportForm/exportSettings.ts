import { saveAs } from 'file-saver';
import getStandardItems from '../customOptionsForm/getStandardOptions';
import module from '../module';
import CustomOptions from '../settings/CustomOptions';
import type { ImportObject } from './importSettings';

const downloadJson = (data: unknown, suffix: string) => {
  saveAs(
    new Blob([JSON.stringify(data)], {
      type: 'application/json;charset=utf-8',
    }),
    `${module.id}_${suffix}_${game.world.id}_${new Date().toISOString()}.json`,
  );
};

const exportSettings = () => {
  const importObject: ImportObject = {
    standard: getStandardItems().map((value) => ({
      key: value.key,
      hideFromGM: value.hideFromGMSetting.get(),
      hideOnPersistent: value.hideOnPersistentSetting.get(),
      permission: value.permission,
    })),
    custom: CustomOptions.get(),
  };
  module.logger.info('Exporting settings', importObject);

  downloadJson(importObject, 'export');
};

export default exportSettings;
