import AttributeLookup from '../attributeLookups/AttributeLookup';
import { StandardOption } from '../settings/StandardOptions';
import AttributeRow from './row/AttributeRow';
import showStandardRow from './showStandardRow';
import Tooltip from './Tooltip';

class StandardRow {
  attributeLookup: AttributeLookup;
  option: StandardOption;
  groupID: string | undefined;
  row: AttributeRow | null;

  constructor(attributeLookup: AttributeLookup, option: StandardOption, groupID?: string) {
    this.attributeLookup = attributeLookup;
    this.option = option;
    this.row = null;
    this.groupID = groupID;
  }

  update(tooltip: Tooltip, actor: Actor, token: Token) {
    if (showStandardRow(actor, this.option)) {
      // if (this.attributeLookup.asyncRows) {
      //   const reference = tooltip._prepareAsyncReference(this.attributeLookup.id);
      //   (async () => {
      //     const rows = await this.attributeLookup.asyncRows(actor, token);
      //     for (const row of rows) {
      //       const attributeRow = new AttributeRow(row.label, row.icon, this.groupID);
      //       tooltip._updateRow(attributeRow, row.value, reference);
      //     }
      //   })();
      // } else if (this.attributeLookup.rows) {
      //   for (const row of this.attributeLookup.rows(actor, token)) {
      //     const attributeRow = new AttributeRow(row.label, row.icon, this.groupID);
      //     tooltip._updateRow(attributeRow, row.value);
      //   }
      // } else {
      if (this.row === null) {
        this.row = new AttributeRow(this.attributeLookup.label(), this.attributeLookup.icon(), this.groupID);
      }
      tooltip._updateRow(this.row, this.attributeLookup.value(actor, token));
      // }
    }
  }
}

export default StandardRow;
