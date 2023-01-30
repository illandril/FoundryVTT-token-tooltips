export type PermissionLevel = 'NONE' | 'LIMITED' | 'OBSERVER' | 'OWNER' | 'SHOW_TO_GMS_ONLY' | 'FRIENDLY' | 'NEUTRAL';
export type StandardPermissionLevel = PermissionLevel | 'HIDE_FROM_EVERYONE';

export const HIDE_FROM_EVERYONE_OPTION = 'HIDE_FROM_EVERYONE';
export const SHOW_TO_GMS_ONLY = 'SHOW_TO_GMS_ONLY';
