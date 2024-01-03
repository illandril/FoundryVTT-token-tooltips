import module from '../module';
import exportSettings from './exportSettings';
import importSettings from './importSettings';
import CSS from './styles';

const menuLocalize = (key: string, data?: Record<string, string>) => module.localize(`setting.menu.importExport.${key}`, data);

class ImportExportForm extends FormApplication {
  constructor(object?: never, options?: FormApplicationOptions) {
    super(object, options);
  }

  /**
   * Default Options for this FormApplication
   */
  static get defaultOptions(): FormApplicationOptions {
    return {
      ...super.defaultOptions,
      ...importExportFormOptions,
      classes: ['sheet'],
      // width: 960,
      closeOnSubmit: true,
    };
  }

  getData() {
    return {
      // export: getExportData(),
      CSS,
      menuLocalize,
    };
  }

  async _updateObject() {
    // Nothing to save - everything handled by button listeners
  }

  onExport(event: Event) {
    event.preventDefault();
    exportSettings();
    void this.close();
  }

  onImport(input: HTMLInputElement) {
    const files = input.files;
    if (files?.length !== 1) {
      module.logger.warn('No files (or multiple files) selected... it is expected the browser should stop this from happening');
    } else {
      const file = files[0];
      // eslint-disable-next-line no-alert
      if (!confirm(menuLocalize('confirmImport', { filename: file.name }))) {
        module.logger.info('Import aborted');
        return;
      }
      const reader = new FileReader();
      reader.addEventListener('load', (event) => {
        const settingsString = event.target?.result;
        try {
          if (typeof settingsString !== 'string') {
            throw new Error('file did not load as a string');
          }
          importSettings(settingsString);
          ui.notifications.info(menuLocalize('success'));
          void this.close();
        } catch (error) {
          module.logger.error('Error during import', error, settingsString);
          ui.notifications.error(menuLocalize('error'));
        }
      });
      reader.readAsText(file);
    }
  }

  onClose(event: Event) {
    event.preventDefault();
    void this.close();
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html);
    const form = html.get(0);
    if (!form) {
      module.logger.error('activateListeners called with empty element');
      return;
    }

    module.logger.debug('Activating ImportExportForm listeners');

    const importButton = form.querySelector(`.${CSS.IMPORT}`);
    if (!importButton) {
      module.logger.error(`Could not find .${CSS.IMPORT} button when adding listeners`);
    } else {
      const importInput = importButton.querySelector('input');
      if (!importInput) {
        module.logger.error('Could not find the file input for import');
      } else {
        importButton.addEventListener('click', () => {
          importInput.click();
        });
        importInput.addEventListener('change', this.onImport.bind(this, importInput));
      }
    }



    const exportButton = form.querySelector(`.${CSS.EXPORT}`);
    if (!exportButton) {
      module.logger.error(`Could not find .${CSS.EXPORT} button when adding listeners`);
    } else {
      exportButton.addEventListener('click', this.onExport.bind(this));
    }

    const closeButton = form.querySelector(`.${CSS.CLOSE}`);
    if (!closeButton) {
      module.logger.error(`Could not find .${CSS.CLOSE} button when adding listeners`);
    } else {
      closeButton.addEventListener('click', this.onClose.bind(this));
    }
  }
}

const importExportFormOptions = module.settings.registerMenu('importExport', {
  icon: 'fas fa-upload',
  type: ImportExportForm,
  restricted: true,
});

