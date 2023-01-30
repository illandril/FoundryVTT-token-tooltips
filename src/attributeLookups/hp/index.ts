import calculateValue from '../../tooltip/calculateValue/index';
import AttributeLookup, { getAttributeValue, SimpleActorAttributeLookup } from '../AttributeLookup';
import simplifyHP from './simplifyHP';

export default [
  // Standard HP
  new AttributeLookup(
    () => 'heart',
    () => {
      switch (game.system.id) {
        case 'dnd5e':
          return game.i18n.localize('DND5E.HitPoints');
        case 'pf1':
          return game.i18n.localize('PF1.HitPoints');
        case 'pf2e':
          return game.i18n.localize('PF2E.HitPointsHeader');
        case 'D35E':
          return game.i18n.localize('D35E.HitPoints');
        case 'demonlord':
          return game.i18n.localize('DL.CharHealthDamage');
        case 'swade':
          return game.i18n.localize('SWADE.Wounds');
        case 'gurps4e':
          return game.i18n.localize('GURPS4E.attributes.hp');
        default:
          return '[HP]';
      }
    },
    (actor: Actor, token: Token) => {
      const value = getAttributeValue(actor.system, [
        // DnD5E and Pathfinder
        'attributes.hp',
        // Simple World-Building
        'health',
        // Shadow of the Demon Lord
        'characteristics.health',
        // SWADE
        'wounds',
        // GURPS
        'tracked.hp',
      ]);
      return simplifyHP(calculateValue(value, 'hp'), actor, token);
    },
  ),
  // starwarsffg
  new SimpleActorAttributeLookup(
    () => null,
    () => game.i18n.localize('SWFFG.Wounds'),
    ['stats.wounds'],
  ),
  new SimpleActorAttributeLookup(
    () => null,
    () => game.i18n.localize('SWFFG.Strain'),
    ['stats.strain'],
  ),
] satisfies AttributeLookup[];
