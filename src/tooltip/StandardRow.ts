import AttributeLookup, { AsyncAttributeLookup } from '../attributeLookups/AttributeLookup';
import module from '../module';
import { StandardOption } from '../settings/StandardOptions';
import AttributeRow from './row/AttributeRow';
import showStandardRow from './showStandardRow';
import Tooltip from './Tooltip';

class StandardRow {
  readonly attributeLookup: AttributeLookup | AsyncAttributeLookup;
  readonly option: StandardOption;
  readonly groupID: string | undefined;
  row: AttributeRow | null;

  constructor(attributeLookup: AttributeLookup | AsyncAttributeLookup, option: StandardOption, groupID?: string) {
    this.attributeLookup = attributeLookup;
    this.option = option;
    this.row = null;
    this.groupID = groupID;
  }

  update(tooltip: Tooltip, actor: Actor, token: Token) {
    module.logger.debug('StandardRow update', this.groupID);
    if (showStandardRow(actor, token, this.option, tooltip.isPersistent)) {
      if (this.attributeLookup instanceof AsyncAttributeLookup) {
        const asyncLookup: AsyncAttributeLookup = this.attributeLookup;
        const reference = tooltip._prepareAsyncReference(asyncLookup.id);
        void (async () => {
          try {
            const rows = await asyncLookup.asyncRows(actor, token);
            for (const row of rows) {
              const attributeRow = new AttributeRow(row.label, row.icon, this.groupID);
              tooltip._updateRow(attributeRow, row.value, reference);
            }
          } catch (err) {
            module.logger.error('Error with async lookup', this.groupID, err, actor, token);
          }
        })();
      } else {
        try {
          const syncLookup: AttributeLookup = this.attributeLookup;
          if (this.row === null) {
            this.row = new AttributeRow(syncLookup.label(), syncLookup.icon(), this.groupID);
          }
          tooltip._updateRow(this.row, syncLookup.value(actor, token));
        } catch (err) {
          module.logger.error('Error with sync lookup', this.groupID, err, actor, token);
        }
      }
    }
  }
}

export default StandardRow;
