import enumerize, { Any } from '@mrbarrysoftware/js-enumerize';

export default enumerize({
  Init: [],

  AddConnection: [Any, String],
  RemoveConnection: [Any, String],

  MessageTimer: [Any, String, Any],
  MessageTimerOwner: [Any, String, Any],

  UpdateStatisticsFromMessage: [String, Any],
  UpdateStatisticsFromConnections: [String],

  SetTimerOwner: [String],
});
